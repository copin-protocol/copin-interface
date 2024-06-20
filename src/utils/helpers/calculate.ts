import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import { OrderTypeEnum, PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'

export function calcPnL(isLong: boolean, averagePrice: number, lastPrice: number, sizeUsd: number) {
  const priceDelta = averagePrice > lastPrice ? averagePrice - lastPrice : lastPrice - averagePrice
  const hasProfit = isLong ? lastPrice > averagePrice : averagePrice > lastPrice
  const delta = (sizeUsd * priceDelta) / averagePrice

  return delta === 0 ? 0 : hasProfit ? delta : -delta
}

export function calcSynthetixPnL(isLong: boolean, averagePrice: number, marketPrice: number, sizeToken: number) {
  return sizeToken * (marketPrice - averagePrice) * (isLong ? 1 : -1)
}

export function calcCopyOpeningPnL(position: CopyPositionData, marketPrice?: number | undefined) {
  if (!marketPrice || !position.entryPrice) return 0
  const sizedDelta = Number(position.sizeDelta)
  const sizeUsd = (!!sizedDelta && sizedDelta > 0 ? sizedDelta : position.totalSizeDelta ?? 0) * position.entryPrice
  return calcPnL(position.isLong, position.entryPrice, marketPrice, sizeUsd)
}

export function calcOpeningPnL(position: PositionData, marketPrice?: number | undefined) {
  if (!marketPrice) return 0
  return calcPnL(
    position.isLong,
    position.averagePrice,
    marketPrice,
    position.status === PositionStatusEnum.OPEN && !!position.lastSizeNumber
      ? Math.abs(position.lastSizeNumber) * position.averagePrice
      : position.status === PositionStatusEnum.OPEN && !!position.lastSize
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
      const openingPnl = calcPnL(
        data.isLong,
        data.averagePrice,
        marketPrice,
        data.status === PositionStatusEnum.OPEN && !!data.lastSizeNumber
          ? Math.abs(data.lastSizeNumber) * data.averagePrice
          : data.status === PositionStatusEnum.OPEN && !!data.lastSize
          ? data.lastSize
          : data.sizeInToken
      )
      pnlInToken = ignoreFee ? openingPnl : openingPnl - data.feeInToken
    }
  } else {
    const openingPnl = calcOpeningPnL(data, marketPrice)
    pnl = ignoreFee ? openingPnl : openingPnl - data.fee
  }
  return { pnl, pnlInToken }
}

export function calcOpeningROI(position: PositionData, realPnL: number) {
  return (realPnL / position.collateral) * 100
}

export function calcCopyOpeningROI(position: CopyPositionData, realPnL: number) {
  const sizeUsd = Number(position.totalSizeDelta ?? position.sizeDelta) * position.entryPrice
  return (realPnL / (sizeUsd / position.leverage)) * 100
}
// TODO: Check when add new protocol
export function calcLiquidatePrice(position: PositionData) {
  const useToken = position.sizeInToken != null && position.feeInToken != null && position.fundingInToken != null
  let lastCollateral = (useToken ? position.sizeInToken : position.size) / position.leverage
  let lastSizeInToken = useToken ? position.sizeInToken : position.size / position.averagePrice
  let totalFee = useToken ? position.feeInToken : position.fee
  switch (position.protocol) {
    case ProtocolEnum.KWENTA:
    case ProtocolEnum.POLYNOMIAL:
    case ProtocolEnum.DEXTORO:
    case ProtocolEnum.CYBERDEX:
    case ProtocolEnum.COPIN:
      if (position.status === PositionStatusEnum.OPEN) {
        lastCollateral = position.lastCollateral
        lastSizeInToken = position.lastSize
          ? position.lastSize / position.averagePrice
          : position.lastSizeNumber
          ? Math.abs(position.lastSizeNumber)
          : lastSizeInToken
      }

      break
  }
  if (position.funding) {
    totalFee += useToken ? position.fundingInToken : position.funding
  }

  return (
    position.averagePrice +
    (((position.isLong ? 1 : -1) * (totalFee - 0.9 * lastCollateral)) / lastSizeInToken) *
      (useToken ? position.averagePrice : 1)
  )
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

export function calcClosedPrice(position?: PositionData) {
  if (!position || !position.orders?.length) return
  const decreaseList =
    position.orders.filter(
      (e) =>
        e.type === OrderTypeEnum.DECREASE ||
        (position.protocol !== ProtocolEnum.GMX && e.type === OrderTypeEnum.CLOSE) ||
        e.type === OrderTypeEnum.LIQUIDATE
    ) ?? []
  if (!decreaseList.length) return
  let totalSizeDecrease = 0
  let totalVolumeDecrease = 0
  // Todo: Check when add new protocol
  const useSizeNumber = [
    ProtocolEnum.KWENTA,
    ProtocolEnum.POLYNOMIAL,
    ProtocolEnum.DEXTORO,
    ProtocolEnum.CYBERDEX,
    ProtocolEnum.COPIN,
  ].includes(position.protocol)

  decreaseList.forEach((order) => {
    let sizeNumber = 0
    let sizeDeltaNumber = 0
    if (useSizeNumber && order.sizeNumber) {
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
