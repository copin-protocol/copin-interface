import { HlOrderStatusEnum, OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'

import { MappedRebateTier, MappedVipTier } from '../hooks/features/trader/useHyperliquidFees'

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

export interface HlSubAccountData {
  subAccountUser: string
  master: string
  name: string
  clearinghouseState: HlAccountData
  spotState: HlAccountSpotRawData
  perpEquity: number
  spotEquity: number
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
  tif?: string
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
  account: string
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

export interface HlHistoricalOrderRawData {
  order: HlOrderRawData
  status:
    | 'filled'
    | 'open'
    | 'canceled'
    | 'triggered'
    | 'rejected'
    | 'marginCanceled'
    | 'openInterestCapCanceled'
    | 'vaultWithdrawalCanceled'
    | 'selfTradeCanceled'
    | 'reduceOnlyCanceled'
    | 'siblingFilledCanceled'
    | 'delistedCanceled'
    | 'liquidatedCanceled'
    | 'scheduledCancel'
    | 'tickRejected'
    | 'minTradeNtlRejected'
    | 'perpMarginRejected'
    | 'reduceOnlyRejected'
    | 'badAloPxRejected'
    | 'iocCancelRejected'
    | 'badTriggerPxRejected'
    | 'marketOrderNoLiquidityRejected'
    | 'positionIncreaseAtOpenInterestCapRejected'
    | 'positionFlipAtOpenInterestCapRejected'
    | 'tooAggressiveAtOpenInterestCapRejected'
    | 'openInterestIncreaseRejected'
    | 'insufficientSpotBalanceRejected'
    | 'oracleRejected'
    | 'perpMaxPositionRejected'
  statusTimestamp: number
}

export interface HlHistoricalOrderData {
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
  statusTimestamp: number
  status: HlOrderStatusEnum
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

export interface HlFeesRawData {
  dailyUserVlm: HlDailyVolumeData[]
  feeSchedule: HlFeeScheduleData
  userCrossRate: string
  userAddRate: string
  userSpotCrossRate: string
  userSpotAddRate: string
  activeReferralDiscount: string
  trial: string
  feeTrialReward: string
  nextTrialAvailableTimestamp: string
  stakingLink: HlStakingLink
  activeStakingDiscount: HlStakingDiscountTier
}

export interface HlFeesData {
  totalUserTaker: number
  totalUserMaker: number
  totalUser14DVolume: number
  makerVolumeShare: number
  takerFee: number
  makerFee: number
  spotTakerFee: number
  spotMakerFee: number
  vipTiers: MappedVipTier[]
  mmTiers: MappedRebateTier[]
  minTierVolume: number
  currentVipTier?: MappedVipTier
  currentMakerRebateTier?: MappedRebateTier
  stakingDiscount: number
  stakingLevel: number
  referralDiscount: number
  dailyUserVolume: HlDailyVolumeData[]
  stakingDiscountTiers: HlStakingDiscountTier[]
}

export interface HlDailyVolumeData {
  date: string
  userCross: string
  userAdd: string
  exchange: string
}

export interface HlFeeScheduleData {
  cross: string
  add: string
  spotCross: string
  spotAdd: string
  tiers: HlFeeTier
  referralDiscount: string
  stakingDiscountTiers: HlStakingDiscountTier[]
}

export interface HlStakingDiscountTier {
  bpsOfMaxSupply: string
  discount: string
}

export interface HlStakingLink {
  type: string
  stakingUser: string
}

export interface HlFeeTier {
  vip: HlFeeTierVIP[]
  mm: HlFeeTierMM[]
}

export interface HlFeeTierVIP {
  ntlCutoff: string
  cross: string
  add: string
  spotCross: string
  spotAdd: string
}

export interface HlFeeTierMM {
  makerFractionCutoff: string
  add: string
}

export interface HlAccountStakingData {
  delegated: string
  undelegated: string
  totalPendingWithdrawal: number
  nPendingWithdrawals: number
}

export interface HlAccountVaultData {
  vaultAddress: string
  equity: string
}

export interface HlPerpMetaData {
  universe: HlPerpUniverseData[]
  marginTables: HlPerpMarginTableData[]
}

export interface HlPerpUniverseData {
  name: string
  szDecimals: number
  maxLeverage: number
  marginTableId: number
  onlyIsolated?: boolean
  isDelisted?: boolean
}

export interface HlPerpMarginTableData extends Array<number | HlPerpMarginTable> {
  0: number // marginTableId
  1: HlPerpMarginTable
}

export interface HlPerpMarginTable {
  description: string
  marginTiers: HlPerpMarginTier[]
}

export interface HlPerpMarginTier {
  lowerBound: string // Amount as string to preserve precision
  maxLeverage: number
}
