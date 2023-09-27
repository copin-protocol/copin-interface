import { CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'

export function calcPnL(isLong: boolean, averagePrice: number, priceChange: number, size: number) {
  const priceDelta = averagePrice > priceChange ? averagePrice - priceChange : priceChange - averagePrice
  const hasProfit = isLong ? priceChange > averagePrice : averagePrice > priceChange
  const delta = (size * priceDelta) / averagePrice

  return delta === 0 ? 0 : hasProfit ? delta : -delta
}

export function calcCopyOpeningPnL(position: CopyPositionData, marketPrice?: number | undefined) {
  if (!marketPrice || !position.entryPrice) return 0
  const sizeUsd = Number(position.totalSizeDelta ?? position.sizeDelta) * position.entryPrice
  return calcPnL(position.isLong, position.entryPrice, marketPrice, sizeUsd)
}

export function calcOpeningPnL(position: PositionData, marketPrice?: number | undefined) {
  if (!marketPrice) return 0
  return calcPnL(position.isLong, position.averagePrice, marketPrice, position.size)
}

export function calcOpeningROI(position: PositionData, realPnL: number) {
  return (realPnL / (position.size / position.leverage)) * 100
}

export function calcCopyOpeningROI(position: CopyPositionData, realPnL: number) {
  const sizeUsd = Number(position.totalSizeDelta ?? position.sizeDelta) * position.entryPrice
  return (realPnL / (sizeUsd / position.leverage)) * 100
}

export function calcLiquidatePrice(position: PositionData, prices: UsdPrices) {
  const gmxPrice = prices[position.indexToken]
  if (!gmxPrice) return undefined
  const deltaPrice =
    (1 / position.leverage) * (1 - (position.paidFee ?? position.fee) / position.collateral) * position.averagePrice
  return position.isLong ? position.averagePrice - deltaPrice : position.averagePrice + deltaPrice
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
