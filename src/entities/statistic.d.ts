export interface StatisticOverviewData {
  totalVolume: StatisticData
  totalOrder: StatisticData
  totalProfit: StatisticData
  totalLoss: StatisticData
  totalCopier: StatisticData
}

export interface StatisticData {
  allTime: number
  today: number
  yesterday: number
}

export interface CopyStatisticData {
  totalVolume: number
  totalOrder: number
  totalProfit: number
  totalLoss: number
  totalActiveCopier: number
  totalInactiveCopier: number
  totalActiveCopyTrade: number
  totalInactiveCopyTrade: number
  totalDistinctTrader: number
  exchange: ExchangeStatsData
  statisticAt: string
}

export interface ExchangeStatsData {
  [key: string]: {
    totalActiveCopyTrade: number
    totalInactiveCopyTrade: number
  }
}

export interface TraderPnlStatisticData {
  pnl: number
  fee: number
  percentage?: number
  date: string
}
