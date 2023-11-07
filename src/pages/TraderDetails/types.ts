export interface TraderPnlChartData {
  label: string
  date: string
  pnl: number
  fee: number
  roi: number
}

export type TraderPnlStatsData = {
  maxPnl: number
  maxRoi: number
  minPnl: number
  minRoi: number
  maxAbsPnl: number
  maxAbsRoi: number
}
