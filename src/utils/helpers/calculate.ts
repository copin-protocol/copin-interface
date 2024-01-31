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
      : position.size
  )
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
  let lastCollateral = position.size / position.leverage
  let lastSizeInToken = position.size / position.averagePrice
  let totalFee = position.fee
  switch (position.protocol) {
    case ProtocolEnum.GMX:
    case ProtocolEnum.GMX_V2:
      break
    case ProtocolEnum.KWENTA:
    case ProtocolEnum.POLYNOMIAL:
      if (position.status === PositionStatusEnum.OPEN) {
        lastCollateral = position.lastCollateral
        lastSizeInToken = Math.abs(position.lastSizeNumber)
      }
      totalFee -= position.funding
      break
  }

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

  decreaseList.forEach((order) => {
    const sizeNumber = order.sizeNumber
      ? Math.abs(order.sizeNumber)
      : Math.abs(order.sizeDeltaNumber / order.priceNumber)
    totalSizeDecrease += sizeNumber
    totalVolumeDecrease += order.sizeDeltaNumber
  })

  return totalSizeDecrease === 0 ? 0 : totalVolumeDecrease / totalSizeDecrease
}
