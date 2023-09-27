import {
  CopyTradePlatformEnum,
  CopyTradeStatusEnum,
  CopyTradeTypeEnum,
  PositionStatusEnum,
  ProtocolEnum,
} from 'utils/config/enums'

export interface RequestCopyTradeData {
  account?: string
  privateKey?: string
  tokenAddresses?: string[]
  leverage?: number
  volume?: number
  enableStopLoss?: boolean
  stopLossAmount?: number
  protocol?: ProtocolEnum
  type?: CopyTradeTypeEnum
  exchange?: CopyTradePlatformEnum
  bingXApiKey?: string
  bingXSecretKey?: string
  proxyUrl?: string
  serviceKey?: string
  title?: string
  reverseCopy?: boolean
  maxVolMultiplier?: number
  volumeProtection?: boolean
  lookBackOrders?: number
  skipLowLeverage?: boolean
}

export interface CopyTradeData {
  id: string
  protocol: ProtocolEnum
  userId: string
  account: string
  traderName: string
  displayPrivateKey: string
  bingXApiKey?: string
  tokenAddresses: string[]
  leverage: number
  volume: number
  enableStopLoss: boolean
  stopLossAmount: number
  volumeProtection: boolean
  lookBackOrders: number
  pnl: number
  pnl7D: number
  pnl30D: number
  status: CopyTradeStatusEnum
  createdAt: string
  type: CopyTradeTypeEnum
  proxyUrl: string
  serviceKey?: string
  title?: string
  bingXBalance?: number
  bingXAvailableMargin?: number
  reverseCopy: boolean
  maxVolMultiplier?: number
  skipLowLeverage?: boolean
}

export interface PreDeleteCopyTradeData {
  totalOpeningPositions: number
}

export type UpdateCopyTradeData = Partial<CopyTradeData>

export interface CopyPositionData {
  id: string
  protocol: ProtocolEnum
  userId: string
  copyTradeId: string
  copyAccount: string
  copyTradeTitle: string
  name: string
  indexToken: string
  key: string
  sourceSizeDelta: string
  sizeDelta: string
  sourceInitialVol: string
  initialVol: number
  leverage: number
  sourceOrderTxHashes: string[]
  orderTxHashes: string[]
  isLong: boolean
  entryPrice: number
  closePrice: number
  stopLossPrice: number
  stopLossAmount: number
  pnl: number
  status: PositionStatusEnum
  lastOrderAt: string
  createdAt: string
  updatedAt: string
  totalSizeDelta?: string | number
}

export interface CopyOrderData {
  price: number
  size: number
  sizeUsd: number
  collateral: number
  isLong: boolean
  isIncrease: boolean
  createdAt: string
}

export interface CopyTradeBalanceData {
  snapshotAt: string
  uniqueKey: string
  balance: number
  exchangeUserId: string
}

export interface CopyTradeBalanceDataResponse {
  totalBalance: number
  balances: CopyTradeBalanceData[]
}

export interface CopyTradePnL {
  date: string
  amount: number
}

export interface MyCopyTradeOverview {
  balance: number
  copies: number
  pnl: number | null
  totalVolume: number
}
