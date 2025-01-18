import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import { OrderTypeEnum, PositionStatusEnum } from 'utils/config/enums'
import { PROTOCOLS_IN_TOKEN_COLLATERAL, PROTOCOL_USE_SIZE_NUMBER_TO_CALC } from 'utils/config/protocols'

export function calcPnL(isLong: boolean, averagePrice: number, lastPrice: number, sizeUsd: number) {
  const priceDelta = averagePrice > lastPrice ? averagePrice - lastPrice : lastPrice - averagePrice
  const hasProfit = isLong ? lastPrice > averagePrice : averagePrice > lastPrice
  const delta = (sizeUsd * priceDelta) / averagePrice

  return delta === 0 ? 0 : hasProfit ? delta : -delta
}

export function calcPnLBySizeInToken(isLong: boolean, averagePrice: number, lastPrice: number, sizeInToken: number) {
  return sizeInToken * (lastPrice - averagePrice) * (isLong ? 1 : -1)
}

export function calcCopyOpeningPnL(position: CopyPositionData, marketPrice?: number | undefined) {
  if (!marketPrice || !position.entryPrice) return 0
  const sizedDelta = Number(position.sizeDelta)
  const sizeUsd = (!!sizedDelta && sizedDelta > 0 ? sizedDelta : position.totalSizeDelta ?? 0) * position.entryPrice
  return calcPnL(position.isLong, position.entryPrice, marketPrice, sizeUsd)
}

export function calcOpeningPnL(position: PositionData, marketPrice?: number | undefined) {
  if (!marketPrice) return 0

  if (
    position.status === PositionStatusEnum.OPEN &&
    !PROTOCOLS_IN_TOKEN_COLLATERAL.includes(position.protocol) &&
    position.lastSizeInToken != null &&
    position.lastSizeInToken > 0
  )
    return calcPnLBySizeInToken(position.isLong, position.averagePrice, marketPrice, position.lastSizeInToken)

  return calcPnL(
    position.isLong,
    position.averagePrice,
    marketPrice,
    position.status === PositionStatusEnum.OPEN && position.lastSizeNumber != null
      ? Math.abs(position.lastSizeNumber) * marketPrice
      : position.status === PositionStatusEnum.OPEN && position.lastSize != null
      ? position.lastSize
      : position.size
  )
}

export function getOpeningPnl({
  data,
  marketPrice,
  ignoreFee = true,
}: {
  data: PositionData
  marketPrice: number | undefined
  ignoreFee?: boolean
}) {
  if (!marketPrice) return { pnl: data?.pnl, pnlInToken: data?.realisedPnlInToken }
  const useSizeInToken = data.size == null && data.fee == null
  let pnl: number | undefined
  let pnlInToken: number | undefined
  if (useSizeInToken) {
    if (!!marketPrice) {
      const openingPnl =
        calcPnLBySizeInToken(
          data.isLong,
          data.averagePrice,
          marketPrice,
          data.status === PositionStatusEnum.OPEN && !!data.lastSize ? data.lastSize : data.sizeInToken
        ) / marketPrice
      pnlInToken = ignoreFee ? openingPnl : openingPnl - data.feeInToken
    }
  } else {
    const openingPnl = calcOpeningPnL(data, marketPrice)
    pnl = ignoreFee ? openingPnl : openingPnl - data.fee
  }
  return { pnl, pnlInToken }
}

export function calcOpeningROI(position: PositionData, realPnL: number) {
  return position.collateral ? (realPnL / position.collateral) * 100 : undefined
}

export function calcCopyOpeningROI(position: CopyPositionData, realPnL: number) {
  const sizeUsd = Number(position.totalSizeDelta ?? position.sizeDelta) * position.entryPrice
  return (realPnL / (sizeUsd / position.leverage)) * 100
}
// TODO: Check when add new protocol
export function calcLiquidatePrice(position: PositionData) {
  // const useToken = position.sizeInToken != null && position.feeInToken != null && position.fundingInToken != null
  // let lastCollateral = (useToken ? position.sizeInToken : position.size) / position.leverage
  // let lastSizeInToken = useToken ? position.sizeInToken : position.size / position.averagePrice
  // let totalFee = useToken ? position.feeInToken : position.fee
  let lastCollateral = position.size / (position.leverage ?? undefined)
  let lastSizeInToken = position.size / position.averagePrice
  let totalFee = position.fee
  if (position.status === PositionStatusEnum.OPEN) {
    lastCollateral = position.lastCollateral
    lastSizeInToken =
      !PROTOCOLS_IN_TOKEN_COLLATERAL.includes(position.protocol) &&
      position.lastSizeInToken != null &&
      position.lastSizeInToken > 0
        ? position.lastSizeInToken
        : position.lastSize != null && position.lastSize > 0
        ? position.lastSize / position.averagePrice
        : lastSizeInToken
  }
  if (position.funding) {
    // totalFee += useToken ? position.fundingInToken : position.funding
    totalFee += position.funding
  }

  // return (
  //   position.averagePrice +
  //   (((position.isLong ? 1 : -1) * (totalFee - 0.9 * lastCollateral)) / lastSizeInToken) *
  //     (useToken ? position.averagePrice : 1)
  // )
  return position.averagePrice + ((position.isLong ? 1 : -1) * (totalFee - 0.9 * lastCollateral)) / lastSizeInToken
}

export function calcCopyLiquidatePrice(position: CopyPositionData) {
  const deltaPrice = (1 / position.leverage) * position.entryPrice
  return position.isLong ? position.entryPrice - deltaPrice : position.entryPrice + deltaPrice
}

export function calcRiskPercent(isLong: boolean, entryPrice: number, marketPrice: number, liquidatePrice: number) {
  return (
    ((isLong && marketPrice > entryPrice) || (!isLong && marketPrice < entryPrice) ? -1 : 1) *
    (Math.abs(marketPrice - entryPrice) / Math.abs(liquidatePrice - entryPrice)) *
    100
  )
}

export function calcSLTPUsd(amount: number, price: number, entryPrice: number) {
  return amount * Math.abs(price - entryPrice)
}

// TODO: Check when add new protocol
export function calcClosedPrice(position?: PositionData) {
  if (!position || !position.orders?.length) return
  const decreaseList =
    position.orders.filter(
      (e) => e.type === OrderTypeEnum.DECREASE || e.type === OrderTypeEnum.CLOSE || e.type === OrderTypeEnum.LIQUIDATE
    ) ?? []
  if (!decreaseList.length) return
  let totalSizeDecrease = 0
  let totalVolumeDecrease = 0

  decreaseList.forEach((order) => {
    let sizeNumber = 0
    let sizeDeltaNumber = 0
    if (order.sizeNumber) {
      sizeNumber = order.sizeNumber
      sizeDeltaNumber = order.sizeDeltaNumber
    } else if (order.sizeInTokenNumber || order.sizeDeltaInTokenNumber) {
      sizeNumber = order.sizeInTokenNumber
        ? order.sizeInTokenNumber
        : Math.abs((order.sizeDeltaInTokenNumber ?? 0) / order.priceNumber)
      sizeDeltaNumber = order.sizeDeltaInTokenNumber ?? 0
    } else {
      sizeDeltaNumber = order.sizeDeltaNumber
      sizeNumber = Math.abs(order.sizeDeltaNumber / order.priceNumber)
    }
    totalSizeDecrease += sizeNumber
    totalVolumeDecrease += sizeDeltaNumber
  })

  return totalSizeDecrease === 0 ? 0 : totalVolumeDecrease / totalSizeDecrease
}
