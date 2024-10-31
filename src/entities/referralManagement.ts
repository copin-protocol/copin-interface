import {
  ClaimRewardStatusEnum,
  ReferralActivityTypeEnum,
  ReferralHistoryStatusEnum,
  ReferralTierEnum,
  ReferralTypeEnum,
  SubscriptionPlanEnum,
  TimeFilterByEnum,
} from 'utils/config/enums'

export interface ReferralListData {
  // userId: string
  totalFee: number
  totalVolume: number
  totalCommission: number
  referralTier: ReferralTierEnum
  referralType: ReferralTypeEnum
  joinTime: string
  // createdAt: string
  referralPlan: SubscriptionPlanEnum
  referralAccount: string
  statisticAt?: string
}

export interface ReferralRebateHistoryData {
  userId: string
  fee: number
  volume: number
  commission: number
  referralTier: ReferralTierEnum
  referralType: ReferralTypeEnum
  commissionRatio: number
  status: ReferralHistoryStatusEnum
  time: string
  // "createdAt": string,
  referralPlan: SubscriptionPlanEnum
  referralAccount: string
  statisticAt?: string
}

export interface ReferralClaimHistoryData {
  id: string
  // userId: string
  txHash: string
  amount: number
  time: string
  status: ClaimRewardStatusEnum
  createdAt: string
  nonce?: string
  signature?: string
}

export interface ReferralStatisticData {
  f1Referrals: number
  f2Referrals: number
  f1Commissions: number
  f2Commissions: number
  feeRebates: number
  totalEarned: number
  statisticType: TimeFilterByEnum
}

export interface ReferralActivityData {
  id: string
  commission: number
  referralFromUser: string
  referralUser: string
  type: ReferralActivityTypeEnum
  time: string
}

export interface ReferralRewardData {
  // userId: string
  claimable: number
  pending: number
  totalUnclaim: number
}

export interface RequestClaimRewardData {
  user: string
  amount: number
  nonce: string
  signature: string
}
