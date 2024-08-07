import { ProtocolEnum } from 'utils/config/enums'

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
  exchanges: ExchangeStatsData
  statisticAt: string
}

export interface ExchangeStatsData {
  [key: string]: {
    totalActiveCopyTrade: number
    totalInactiveCopyTrade: number
    totalOrder: number
    totalVolume: number
    totalPnl: number
    totalProfit: number
    totalLoss: number
  }
}

export interface TraderPnlStatisticData {
  pnl: number
  fee: number
  percentage?: number
  date: string
}

export interface OpenInterestMarketData extends MarketStatData {
  indexToken: string
  latestStat: MarketStatData
}

export interface MarketStatData {
  latestPrice: number
  price: number
  totalLong: number
  totalShort: number
  totalTraderLong: number
  totalTraderShort: number
  totalVolumeLong: number
  totalVolumeShort: number
  totalInterest: number
}

export type ProtocolsStatisticData = {
  [key in ProtocolEnum]: {
    traders: number
    oi: number
  }
}
