import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'

export interface HlAccountData {
  marginSummary: MarginSummary
  crossMarginSummary: CrossMarginSummary
  crossMaintenanceMarginUsed: string
  withdrawable: string
  assetPositions: AssetPosition[]
  time: number
}

interface MarginSummary {
  accountValue: string
  totalNtlPos: string
  totalRawUsd: string
  totalMarginUsed: string
}

interface CrossMarginSummary {
  accountValue: string
  totalNtlPos: string
  totalRawUsd: string
  totalMarginUsed: string
}

interface Leverage {
  type: string
  value: number
  rawUsd?: string
}

interface CumFunding {
  allTime: string
  sinceOpen: string
  sinceChange: string
}

interface Position {
  coin: string
  szi: string
  leverage: Leverage
  entryPx: string
  positionValue: string
  unrealizedPnl: string
  returnOnEquity: string
  liquidationPx: string | null
  marginUsed: string
  maxLeverage: number
  cumFunding: CumFunding
}

export interface AssetPosition {
  type: string
  position: Position
}

export interface HlOrderRawData {
  coin: string
  side: string // B: Bid -> Buy | A: Ask -> Sell
  limitPx: string
  sz: string
  oid: number
  timestamp: number
  triggerCondition: string
  isTrigger: boolean
  triggerPx: string
  isPositionTpsl: boolean
  reduceOnly: boolean // This order will not open a new position no matter how large the order size is. It will compare to the existing position at the time of execution
  orderType: string // Limit | Stop Market | Take Profit Market
  origSz: string
  tif?: string
  cloid?: string
}

export interface HlOrderData {
  orderId: number
  closeId?: number
  account: string
  pair: string
  indexToken: string
  side: string
  originalSizeNumber: number
  originalSizeInTokenNumber: number
  sizeNumber: number
  sizeInTokenNumber: number
  priceNumber: number
  triggerPriceNumber: number
  triggerCondition: string
  isTrigger: boolean
  isPositionTpsl: boolean
  isLong: boolean
  isBuy: boolean
  reduceOnly: boolean
  orderType: string
  type: OrderTypeEnum
  protocol: ProtocolEnum
  timestamp: number
}

export interface HlOrderFillRawData {
  closedPnl: string
  coin: string
  crossed: boolean
  dir: string
  hash: string
  oid: number
  px: string
  side: string
  startPosition: string
  sz: string
  time: number
  fee: string
  feeToken: string
  builderFee?: string
  tid: number
}

export interface HlOrderFillData {
  id: number
  orderId: number
  txHash: string
  account: string
  pair: string
  indexToken: string
  side: string
  direction: string
  sizeNumber: number
  sizeInTokenNumber: number
  priceNumber: number
  pnl: number
  fee: number
  builderFee?: number
  feeToken: string
  isLong: boolean
  isBuy: boolean
  protocol: ProtocolEnum
  timestamp: number
}

// Types for grouped fills
export interface GroupedFillsData {
  fills: HlOrderFillData[]
  totalSize: number
  totalSizeInToken: number
  avgPrice: number
  totalPnl: number
  totalFee: number
  totalBuilderFee: number
  timestamp: number
  direction: string
  pair: string
  isLong: boolean
  feeToken: string
  txHash: string
  orderId: number
}

export interface HlTwapOrderRawData {
  twapId: number
  fill: HlTwapOrderFillRawData
}

export interface HlTwapOrderFillRawData {
  tid: number
  oid: number
  coin: string
  side: string // B: Bid -> Buy | A: Ask -> Sell
  px: string
  sz: string
  startPosition: string
  dir: string // Direction: Long | Short
  hash: string
  closedPnl: string
  fee: string
  feeToken: string
  time: number
  crossed: boolean // This order will not open a new position no matter how large the order size is. It will compare to the existing position at the time of execution
}

export interface HlTwapOrderData {
  twapOrderId: number
  orderId: number
  twapFillId?: number
  account: string
  pair: string
  side: string
  direction: string
  sizeNumber: number
  sizeInTokenNumber: number
  startPosition: number
  priceNumber: number
  pnl: number
  fee: number
  isLong: boolean
  isBuy: boolean
  protocol: ProtocolEnum
  timestamp: number
}

export interface HlPortfolioHistoryPoint {
  timestamp: number
  value: string
}

export interface HlPortfolioRawDataItem {
  accountValueHistory: HlPortfolioHistoryPoint[]
  pnlHistory: HlPortfolioHistoryPoint[]
  vlm: string
}

export type HlPortfolioRawData = Array<[period: string, data: HlPortfolioRawDataItem]>

export interface HlNonFundingLedgerData {
  time: number
  hash: string
  delta: DeltaRawData
}

export interface DeltaRawData {
  type: string
  token: string
  amount: string
  usdc: string
  user: string
  destination: string
  fee: string
  nativeTokenFee: string
  nonce: number
}

export interface HlAccountSpotRawData {
  balances: HlSpotBalanceData[]
}

export interface HlSpotBalanceData {
  coin: string
  token: number
  total: string
  hold: string
  entryNtl: string
}

export interface HlAccountSpotData {
  coin: string
  token: number
  total: number
  price: number
  entryValue: number
  currentValue: number
  unrealizedPnl: number
  roe: number
}

export interface HlSpotMetaData {
  universe: HlUniverseData[]
  tokens: HlTokenData[]
}

export interface HlUniverseData {
  tokens: number[]
  name: string
  index: number
  isCanonical: boolean
}

export interface HlTokenData {
  tokenId: string
  name: string
  index: number
  szDecimals: number
  weiDecimals: number
  deployerTradingFeeShare: string
  fullName: string
  isCanonical: boolean
  evmContract?: HlEvmContractData
}

export interface HlTokenMappingData {
  pairName: string
  displayName: string
  baseToken: HlTokenData
  quoteToken: HlTokenData
  price: number
  index: number
  isCanonical: boolean
}

export interface HlEvmContractData {
  address: string
  evm_extra_wei_decimals: number
}

export interface HlPriceData {
  [token: string]: number
}
