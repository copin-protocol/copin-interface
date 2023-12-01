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
