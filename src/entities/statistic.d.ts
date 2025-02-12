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
  totalRealisedProfit: number
  totalRealisedLoss: number
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
    totalRealisedPnl: number
    totalRealisedProfit: number
    totalRealisedLoss: number
  }
}

export interface TraderPnlStatisticData {
  cumulativePnl: number
  pnl: number
  fee: number
  percentage?: number
  date: string
}

export interface OpenInterestMarketData extends MarketStatData {
  indexToken: string
  pair: string
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
  pair: string
}

export type ProtocolsStatisticData = {
  [key in ProtocolEnum]: {
    traders: number
    traders30: number
    oi: number
  }
}

interface PerpDexStatisticData {
  statisticAt: string
  perpdex: string
  perpdexName: string
  volume: number
  traders: number
  traderPnl: number
  oi: number
  revenue: number
  liquidations: number
  longRatio: number
  longPnl: number
  shortPnl: number
  longLiquidations: number
  shortLiquidations: number
  longOi: number
  shortOi: number
  traderProfit: number
  traderLoss: number
  totalTraders: number
  pairStatistics: PairStatisticData
}

interface PairStatisticData {
  [pair: string]: {
    volume: number
    longOi: number
    shortOi: number
    longPnl: number
    shortPnl: number
    longProfit: number
    shortProfit: number
    totalProfit: number
    longLoss: number
    shortLoss: number
    totalLoss: number
  }
}

export interface PerpDexHourlyStatisticData {
  statisticAt: string
  perpdex: string
  perpdexName: string
  volume: number
  traders: number
  traderPnl: number
  oi: number
  revenue: number
  liquidations: number
  longRatio: number
  longPnl: number
  shortPnl: number
  longLiquidations: number
  shortLiquidations: number
  longOi: number
  shortOi: number
  traderProfit: number
  traderLoss: number
  orders: number
}

export interface PerpDexHourlyStatistic {
  [hour: string]: PerpDexHourlyStatisticData
}
