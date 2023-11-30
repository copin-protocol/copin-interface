import {
  CopyTradePlatformEnum,
  LeaderboardTypeEnum,
  OrderTypeEnum,
  PositionStatusEnum,
  ProtocolEnum,
  TimeFrameEnum,
} from 'utils/config/enums'

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
  lastTradeAt: string
  lastTradeAtTs: number
  statisticAt: string
  createdAt: string
  updatedAt: string
  ranking: { [key: string]: number }
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
  key: string
  reverseIndex: number
  logId: number
  blockTime: string
  collateral: number
  lastCollateral: number
  size: number
  lastSizeNumber: number
  averagePrice: number
  lastPriceNumber: number
  maxSizeNumber: number
  fee: number
  feeNumber: number
  lastFunding: number
  funding: number
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
  status: PositionStatusEnum
  orderIds: string[]
  orders: OrderData[]
  createdAt: string
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
  collateralDeltaNumber: number
  collateralNumber: number
  priceNumber: number
  averagePriceNumber: number
  feeNumber: number
  fundingNumber: number
  fundingRateNumber: number
  isLong: boolean
  isOpen: boolean
  isClose: boolean
  leverage: number
  type: OrderTypeEnum
  logId: number
  blockNumber: number
  blockTime: string
  createdAt: string
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
  time: number
  collateral: number
  price: number
}
