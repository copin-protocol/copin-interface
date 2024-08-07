import {
  CopyTradePlatformEnum,
  OrderTypeEnum,
  ProtocolEnum,
  SubscriptionPlanEnum,
  UserRoleEnum,
} from 'utils/config/enums'

export interface UserCopyData {
  address: string
  totalInvest: number
  pnl: number
}

export interface UserStatisticsData {
  copies: number
}

export interface UserData {
  id: string
  username: string
  account: string
  role: UserRoleEnum
  copyTradeQuota: number
  isActivated: boolean
  isBlocked: boolean
  blockNote?: string
  referralCode?: string
  isAddedReferral?: boolean
  isSkippedReferral?: boolean
  createdAt: string
  updatedAt: string
  plan?: SubscriptionPlanEnum
}

export interface ReferralData {
  username: string
  createdAt: string
}

export interface ReferralStat {
  totalReferral?: number
  todayReferral?: number
  yesterdayReferral?: number
  d30Referral?: number
}

export interface UserActivityData {
  id: string
  createdAt: string
  protocol: ProtocolEnum
  sourceAccount: string
  userId?: string
  copyTradeId?: string
  copyPositionId: string
  copyTradeTitle?: string
  exchange: CopyTradePlatformEnum
  indexToken: string
  pair: string
  price?: number
  volume?: number
  leverage?: number
  isLong: boolean
  type?: OrderTypeEnum
  isSuccess?: boolean
  isProcessing?: boolean
  isReverse?: boolean
  errorMsg?: string
  sourceOrderId?: string
  sourceTxHash?: string
  copyWalletId?: string
  copyWalletName?: string
  cexOrderIds?: string[]
  sourcePrice: number
  copyOrderId?: string
  targetTxHash?: string
}

export interface LatestActivityLogData {
  id: string
  protocol: ProtocolEnum
  sourceAccount: string
  copyTradeTitle: string
  exchange: CopyTradePlatformEnum
  indexToken: string
  pair: string
  price: number
  sourcePrice: number
  copyTradeId: string
  volume: number
  leverage: number
  isLong: true
  type: OrderTypeEnum
  isSuccess: true
  sourceTxHash: string
  copyWalletId: string
  cexOrderId: string
  isReverse: false
  copyOrderId: string
  copyPositionId: string
  userId: string
  username: string
  createdAt: string
}

export interface UserSubscriptionData {
  tokenId: number
  tierId: SubscriptionPlanEnum
  startedTime: string
  expiredTime: string
  id: string
  owner: string // address
  createdAt: string
}
