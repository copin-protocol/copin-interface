import { SubscriptionPlanEnum } from 'utils/config/enums'

export interface SubscriptionPlanData {
  plan: SubscriptionPlanEnum
  price: number
  durationInDays: number
  isEnabled: boolean
  discountByPeriod: {
    [key: string]: number
  }
}
export interface PaymentRequestData {
  id: string
  checkoutLink: string
}

export interface PaymentCurrencyData {
  currency: string
  token: string
  chain: string
}

export interface PaymentDetailsData {
  id: string
  status: 'PENDING' | 'FAILURE' | 'SUCCESS' | 'EXPIRED'
  plan: SubscriptionPlanEnum
  price: number
  currency: string
  amount: number
  planDurationInDays: number
}

export interface SubscriptionUsageData {
  watchedListAlerts: number
  webhookAlerts: number
  groupAlerts: number
  customAlerts: number
  channelAlerts: number
  monthlyAlerts: number
  exchangeApis: number
  copyTrades: number
  csvDownloads: number
}

export interface SubscriptionDiscountCodeData {
  id: string
  code: string
  status: string
  discountPercent: number
  expiredTime: string
  startedTime: string
  createdAt: string
}
