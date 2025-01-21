import {
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum,
  CopyTradeSideEnum,
  CopyTradeStatusEnum,
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
  side: CopyTradeSideEnum
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
  skipLowCollateral?: boolean
  lowCollateral?: number
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
  excludingTokenAddresses: string[]
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
  side: CopyTradeSideEnum
  proxyUrl: string
  serviceKey?: string
  title?: string
  reverseCopy: boolean
  maxVolMultiplier: number | null
  skipLowLeverage?: boolean
  lowLeverage?: number
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  copyAll?: boolean
  skipLowCollateral?: boolean
  lowCollateral?: number
  multipleCopy: boolean
  accounts?: string[]
  skipLowSize?: boolean
  lowSize?: number
  // bingXBalance?: number
  // bingXAvailableMargin?: number
  // displayPrivateKey: string
  // bingXApiKey?: string
}

export interface PreDeleteCopyTradeData {
  totalOpeningPositions: number
}

export type UpdateCopyTradeData = Partial<CopyTradeData>

type CopyOpeningPositionType = 'onlyLiveHyper' | 'onlyLiveApp' | 'liveBoth'
export interface CopyPositionData {
  id?: string
  identifyKey?: string
  protocol?: ProtocolEnum
  exchange?: CopyTradePlatformEnum
  userId?: string
  copyTradeId?: string
  copyAccount?: string
  positionIndex?: number
  copyTradeTitle?: string
  copyWalletName?: string
  copyWalletId?: string
  name?: string
  indexToken?: string
  key?: string
  sourceSizeDelta?: string
  sizeDelta?: string
  sourceInitialVol?: string
  initialVol?: number
  leverage?: number
  sourceOrderTxHashes?: string[]
  orderTxHashes?: string[]
  isLong?: boolean
  // reverseCopy: boolean
  isReverse?: boolean
  entryPrice?: number
  closePrice?: number
  stopLossPrice?: number
  stopLossAmount?: number
  latestStopLossId?: string
  takeProfitPrice?: number
  takeProfitAmount?: number
  latestTakeProfitId?: string
  pnl?: number
  realisedPnl?: number
  fee?: number
  funding?: number
  closeType?: CopyPositionCloseTypeEnum
  status?: PositionStatusEnum
  lastOrderAt?: string
  createdAt?: string
  updatedAt?: string
  totalSizeDelta?: number
  pair?: string
  openingPositionType?: CopyOpeningPositionType // custom type
}

export interface CopyOrderData {
  price: number
  size: number
  sizeUsd: number
  collateral: number
  totalCollateral: number
  totalSize: number
  leverage: number
  isLong: boolean
  isIncrease: boolean
  txHash: string
  pnl?: number
  funding?: number
  fee?: number
  submitTxHash: string
  settleTxHash: string
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

export interface TraderCopyCountData {
  account: string
  count: number
}
