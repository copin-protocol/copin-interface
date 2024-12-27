import {
  CopyTradePlatformEnum,
  LeaderboardTypeEnum,
  MarginModeEnum,
  OrderTypeEnum,
  PositionStatusEnum,
  ProtocolEnum,
  TimeFrameEnum,
} from 'utils/config/enums'

import { TraderPnlStatisticData } from './statistic'

// import { ImageData } from './image'
// import { LinksData } from './types'

export interface TraderData {
  id: string
  name: string
  note?: string
  account: string
  smartAccount: string
  protocol: ProtocolEnum
  type: TimeFrameEnum
  maxDrawdown: number
  maxDrawdownPnl: number
  maxDuration: number
  minDuration: number
  avgDuration: number
  totalDuration: number
  totalGain: number
  totalLose: number
  totalLoss: number
  totalWin: number
  totalTrade: number
  totalLiquidation: number
  totalLiquidationAmount: number
  totalFee: number
  avgVolume: number
  totalVolume: number
  winLoseRatio: number
  gainLossRatio: number
  orderPositionRatio: number
  profitLossRatio: number
  winRate: number
  longRate: number
  profitRate: number
  pnl: number
  avgRoi: number
  maxRoi: number
  maxPnl: number
  totalLeverage: number
  avgLeverage: number
  maxLeverage: number
  minLeverage: number
  runTimeDays: number
  isOpenPosition: boolean
  indexTokens: string[]
  lastTradeAt: string
  lastTradeAtTs: number
  statisticAt: string
  createdAt: string
  updatedAt: string
  ranking: { [key: string]: number }
  pnlStatistics?: TraderPnlStatisticData
  pairs: string[]
}

export interface ResponseTraderData extends TraderData {
  realisedTotalGain: number
  realisedTotalLoss: number
  realisedPnl: number
  realisedAvgRoi: number
  realisedMaxRoi: number
  realisedMaxPnl: number
  realisedMaxDrawdown: number
  realisedMaxDrawdownPnl: number
  realisedProfitRate: number
  realisedGainLossRatio: number
  realisedProfitLossRatio: number
}

export type TraderDataKey = keyof TraderData

export interface PositionData {
  id: string
  synthetixPositionId: string
  account: string
  smartAccount: string
  name: string
  protocol: ProtocolEnum
  indexToken: string
  collateralToken: string
  key: string
  reverseIndex: number
  logId: number
  blockTime: string
  collateralInToken: number
  collateral: number
  lastCollateral: number
  size: number
  lastSizeNumber: number
  lastSize?: number
  lastSizeInToken?: number
  sizeInToken: number
  averagePrice: number
  liquidationPrice?: number
  lastPriceNumber: number
  maxSizeNumber: number
  fee: number
  feeNumber: number
  feeInToken: number
  lastFunding: number
  funding: number
  fundingInToken: number
  totalVolume: number
  pnl: number
  roi: number
  leverage: number
  orderCount: number
  orderIncreaseCount: number
  orderDecreaseCount: number
  openBlockNumber: number
  openBlockTime: string
  closeBlockNumber: number
  closeBlockTime: string
  durationInSecond: number
  isLong: boolean
  isWin: boolean
  isLiquidate: boolean
  marginMode: MarginModeEnum
  status: PositionStatusEnum
  txHashes: string[]
  orderIds: string[]
  orders: OrderData[]
  createdAt: string
  realisedPnlInToken?: number
  realisedPnl: number
  realisedRoi: number
  pair: string
  updatedAt: string
}

export interface ResponsePositionData extends PositionData {
  realisedPnl: number
  realisedRoi: number
}

export interface PositionStatistics {
  time: number
  entry: number
  size: number
  pnl: number
}

export interface OrderData {
  id: string
  synthetixPositionId: string
  account: string
  smartAccount: string
  txHash: string
  indexToken: string
  collateralToken: string
  sizeDeltaNumber: number
  sizeNumber: number
  sizeDeltaInTokenNumber?: number
  sizeInTokenNumber?: number
  collateralDeltaInTokenNumber: number
  collateralDeltaNumber: number
  collateralNumber: number
  priceNumber: number
  averagePriceNumber: number
  feeInTokenNumber?: number
  feeNumber: number
  fundingNumber: number
  fundingRateNumber: number
  isLong: boolean
  isOpen: boolean
  isClose: boolean
  isCrossMargin: boolean
  leverage: number
  type: OrderTypeEnum
  protocol: ProtocolEnum
  marginMode: MarginModeEnum
  logId: number
  blockNumber: number
  blockTime: string
  createdAt: string
  pair: string
}

export interface CheckAvailableResultData {
  status?: CheckAvailableStatus
  total?: number
  processed?: number
  lastProcessTime?: string
}

export interface TraderCounter {
  counter: number
  total: number
}

export interface FavoritedTrader {
  id: string
  userId: string
  account: string
  note: string
  createdAt: string
  protocol?: ProtocolEnum
}

export interface PositionStatisticCounter {
  date: string
  total: number
}

export interface MyCopyTraderData {
  protocol: ProtocolEnum
  account: string
  accounts?: string[]
  exchange: CopyTradePlatformEnum
  lastTradeAt: string
  pnl: number
  pnl7D: number
  pnl30D: number
}

export interface MyAllCopyTradersData {
  copyingTraders: string[]
  deletedTraders: string[]
}

export interface TopTraderData {
  id: string
  account: string
  protocol: ProtocolEnum
  statisticType: LeaderboardTypeEnum
  ranking: number
  lastRanking: number
  statisticAt: string
  totalRealisedPnl: number
  totalPnl: number
  totalVolume: number
  totalFee: number
  totalLose: number
  totalWin: number
  totalTrade: number
  totalLiquidation: number
  totalLiquidationAmount: number
  rankingAt: string
  createdAt: string
  updatedAt: string
}

export type TickPosition = {
  size: number
  sizeInToken: number
  time: number
  collateral: number
  collateralInToken: number
  price: number
  averagePrice: number
}

export interface TraderTokenStatistic {
  // symbol: string
  pair: string
  indexTokens: string[]
  indexToken: string
  totalTrade: number
  totalOrder: number
  totalWin: number
  totalLose: number
  totalLong: number
  totalShort: number
  realisedPnl: number
  totalLiquidation: number
  totalLiquidationAmount: number
  totalFee: number
  realisedTotalGain: number
  totalGainFee: number
  realisedTotalLoss: number
  totalLossFee: number
  totalVolume: number
  totalRoi: number
  realisedTotalRoi: number
  realisedAvgRoi: number
  maxRoi: number
  realisedMaxRoi: number
  maxPnl: number
  realisedMaxPnl: number
  maxDrawDown: number
  realisedMaxDrawdown: number
  maxDrawDownPnl: number
  realisedMaxDrawdownPnl: number
  totalDuration: number
  minDuration: number
  maxDuration: number
  totalLeverage: number
  maxLeverage: number
  minLeverage: number
  winRate?: number
}

export interface TraderExchangeStatistic {
  id: string
  isOpenPosition: boolean
  lastTradeAt: string
  lastTradeAtTs: number
  protocol: ProtocolEnum
  totalVolume: number
}

export type ResponseTraderExchangeStatistic = Record<ProtocolEnum, TraderExchangeStatistic> | undefined

export interface Account {
  account: string
  protocol: string
}

export interface StatisticData {
  accounts: Account[]
  statisticType: TimeFilterByEnum
}

export type PnlStatisticsResponse = {
  [account: string]: TraderPnlStatisticData
}
