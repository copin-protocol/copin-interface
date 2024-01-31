import {
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum,
  CopyTradeStatusEnum,
  CopyTradeTypeEnum,
  PositionStatusEnum,
  ProtocolEnum,
  SLTPTypeEnum,
} from 'utils/config/enums'

export interface RequestCopyTradeData {
  account?: string
  tokenAddresses?: string[]
  leverage?: number
  volume?: number
  enableStopLoss?: boolean
  stopLossType?: SLTPTypeEnum
  stopLossAmount?: number
  enableTakeProfit?: boolean
  takeProfitType?: SLTPTypeEnum
  takeProfitAmount?: number
  protocol?: ProtocolEnum
  type?: CopyTradeTypeEnum
  exchange?: CopyTradePlatformEnum
  proxyUrl?: string
  serviceKey?: string
  title?: string
  reverseCopy?: boolean
  maxVolMultiplier: number | null
  volumeProtection?: boolean
  lookBackOrders?: number | null
  skipLowLeverage?: boolean
  copyAll?: boolean
  // privateKey?: string
  // bingXApiKey?: string
  // bingXSecretKey?: string
}

export interface CopyTradeData {
  id: string
  protocol: ProtocolEnum
  userId: string
  account: string
  traderName: string
  tokenAddresses: string[]
  leverage: number
  volume: number
  enableStopLoss: boolean
  stopLossType: SLTPTypeEnum
  stopLossAmount: number
  enableTakeProfit: boolean
  takeProfitType: SLTPTypeEnum
  takeProfitAmount: number
  volumeProtection: boolean
  lookBackOrders: number | null
  pnl: number
  pnl7D: number
  pnl30D: number
  status: CopyTradeStatusEnum
  createdAt: string
  type: CopyTradeTypeEnum
  proxyUrl: string
  serviceKey?: string
  title?: string
  reverseCopy: boolean
  maxVolMultiplier: number | null
  skipLowLeverage?: boolean
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  copyAll?: boolean
  // bingXBalance?: number
  // bingXAvailableMargin?: number
  // displayPrivateKey: string
  // bingXApiKey?: string
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
  // reverseCopy: boolean
  isReverse?: boolean
  entryPrice: number
  closePrice: number
  stopLossPrice: number
  stopLossAmount: number
  latestStopLossId?: string
  takeProfitPrice: number
  takeProfitAmount: number
  latestTakeProfitId?: string
  pnl: number
  closeType: CopyPositionCloseTypeEnum
  status: PositionStatusEnum
  lastOrderAt: string
  createdAt: string
  updatedAt: string
  totalSizeDelta?: number
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
  roi: number
}

export interface MyCopyTradeOverview {
  balance: number
  copies: number
  pnl: number | null
  totalVolume: number
}
