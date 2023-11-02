import { CopyTradePlatformEnum, OrderTypeEnum, ProtocolEnum, UserRoleEnum } from 'utils/config/enums'

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
  errorMsg?: string
  sourceOrderId?: string
  sourceTxHash?: string
  copyWalletId?: string
  copyWalletName?: string
  bingXOrderIds?: string[]
  sourcePrice: number
  copyOrderId?: string
  targetTxHash?: string
}
