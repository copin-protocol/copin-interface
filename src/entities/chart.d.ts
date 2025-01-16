import { ExchangeStatsData, PairStatisticData } from './statistic'

export interface ChartData {
  open: number
  close: number
  high: number
  low: number
  timestamp: number
}

export interface ChartDataV2 {
  o: number[]
  c: number[]
  h: number[]
  l: number[]
  t: number[]
}

export type StatisticChartData = {
  date: string
  exchanges: ExchangeStatsData
  totalDistinctTrader: number
  totalVolume: number
  volumeCumulative: number
  totalOrder: number
  orderCumulative: number
  totalProfit: number
  totalLoss: number
  profitCumulative: number
  lossCumulative: number
  pnl: number
  pnlCumulative: number
  profitPercent: number
  lossPercent: number
  totalRealisedProfit: number
  totalRealisedLoss: number
  realisedProfitCumulative: number
  realisedLossCumulative: number
  realisedPnl: number
  realisedPnlCumulative: number
  realisedProfitPercent: number
  realisedLossPercent: number
  totalCopier: number
  totalActiveCopier: number
  totalInactiveCopier: number
  copierCumulative: number
  copierActiveCumulative: number
  totalCopyTrade: number
  totalActiveCopyTrade: number
  totalInactiveCopyTrade: number
  copyTradeCumulative: number
  copyTradeActiveCumulative: number
}

export type StatsData = {
  maxProfit: number
  maxLoss: number
  minProfit: number
  minLoss: number
  maxProfitLoss: number
  minProfitLoss: number
  profitCumulative: number
  lossCumulative: number
  maxCumulativeProfitLoss: number
  maxAbsPnl: number
  maxAbsCumulativePnl: number
  minHourly: number
  maxHourly: number
  rangeHourly: number[]
}

export type CopyTradeChartData = {
  label: string
  date: string
  pnl: number
  roi: number
}

export type CopyTradeStatsData = {
  maxPnl: number
  maxRoi: number
  minPnl: number
  minRoi: number
  maxAbsPnl: number
  maxAbsRoi: number
}

export interface DrawChartData {
  open: number
  close: number
  high: number
  low: number
  time: Date
}

export type PerpDexChartData = {
  date: string
  dateTime: string
  perpdex: string
  perpdexName: string
  volume: number
  volumeCumulative: number
  traders: number
  traderCumulative: number
  revenue: number
  revenueCumulative: number
  liquidations: number
  liquidationCumulative: number
  longLiquidations: number
  shortLiquidations: number
  longPnl: number
  shortPnl: number
  traderPnl: number
  traderPnlCumulative: number
  traderProfit: number
  traderLoss: number
  traderProfitCumulative: number
  traderLossCumulative: number
}

export interface TopPairChartData {
  pair: string
  volume: number
  longPnl: number
  shortPnl: number
  totalPnl: number
  longOi: number
  shortOi: number
  totalOi: number
  top?: number
  backgroundColor?: string
  longProfit: number
  shortProfit: number
  totalProfit: number
  longLoss: number
  shortLoss: number
  totalLoss: number
  totalNet: number
}

export interface DataPoint {
  day: number
  hour: number
  value: number
}

export interface HourlyChartData {
  [date: string]: PerpDexHourlyStatistic
}

type HourlyChartOptionType = 'traders' | 'volume' | 'orders'
