import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'

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
  const sizeUsd = (!!sizedDelta ? position.totalSizeDelta ?? 0 : 0) * position.entryPrice
  return calcPnL(position.isLong, position.entryPrice, marketPrice, sizeUsd)
}

export function calcOpeningPnL(position: PositionData, marketPrice?: number | undefined) {
  if (!marketPrice) return 0
  return calcPnL(
    position.isLong,
    position.averagePrice,
    marketPrice,
    !!position.lastSizeNumber ? Math.abs(position.lastSizeNumber) * position.averagePrice : position.size
  )
}

export function calcOpeningROI(position: PositionData, realPnL: number) {
  return (realPnL / position.collateral) * 100
}

export function calcCopyOpeningROI(position: CopyPositionData, realPnL: number) {
  const sizeUsd = Number(position.totalSizeDelta ?? position.sizeDelta) * position.entryPrice
  return (realPnL / (sizeUsd / position.leverage)) * 100
}

export function calcLiquidatePrice(position: PositionData) {
  let lastCollateral = position.size / position.leverage
  let lastSizeInToken = position.size / position.averagePrice
  let totalFee = position.fee
  switch (position.protocol) {
    case ProtocolEnum.GMX:
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

export function calcCopyLiquidatePrice(position: CopyPositionData, prices: UsdPrices) {
  const gmxPrice = prices[position.indexToken]
  if (!gmxPrice) return undefined
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
