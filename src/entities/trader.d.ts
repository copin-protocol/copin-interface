import {
  CopyTradePlatformEnum,
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
  protocol: ProtocolEnum
  type: TimeFrameEnum
  avgDuration: number
  maxDrawDownPnl: number
  maxDrawDownRoi: number
  maxDuration: number
  minDuration: number
  profitLossRatio: number
  statisticAt: string
  totalGain: number
  totalLose: number
  totalLoss: number
  totalWin: number
  totalTrade: number
  avgVolume: number
  winLoseRatio: number
  winRate: number
  gainLossRatio: number
  orderPositionRatio: number
  profit: number
  profitRate: number
  avgRoi: number
  maxRoi: number
  minRoi: number
  runTimeDays: number
  isOpenPosition: boolean
  lastTradeAt: string
  lastTradeAtTs: number
  createdAt: string
  updatedAt: string
  ranking: { [key: string]: number }
  avgLeverage: number
  maxLeverage: number
  minLeverage: number
}

export type TraderDataKey = keyof TraderData

export interface PositionData {
  id: string
  positionId: string
  account: string
  name: string
  protocol: ProtocolEnum
  indexToken: string
  key: string
  entryFundingRate: string
  logId: number
  blockNumber: number
  blockTime: string
  collateral: number
  size: number
  averagePrice: number
  lastPriceNumber: number
  marginNumber: number
  maxMarginNumber: number
  maxSizeNumber: number
  fee: number
  paidFee: number
  feeNumber: number
  fundingRateNumber: number
  totalFundingRateFee: number
  totalVolume: number
  pnl: number
  realisedPnl: number
  roi: number
  isLong: boolean
  leverage: number
  orderCount: number
  orderIncreaseCount: number
  orderDecreaseCount: number
  openBlockNumber: number
  openBlockTime: string
  closeBlockNumber: number
  closeBlockTime: string
  durationInSecond: number
  isWin: boolean
  isClose: boolean
  isLiquidate: boolean
  status: PositionStatusEnum
  orderIds: string[]
  orders: OrderData[]
  createdAt: string
}

export interface PositionStatistics {
  time: number
  entry: number
  size: number
  pnl: number
}

export interface OrderData {
  id: string
  txHash: string
  indexToken: string
  sizeDelta: number
  size: number
  collateralDelta: number
  collateral: number
  price: number
  averagePrice: number
  fee: number
  realisedPnl: number
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
