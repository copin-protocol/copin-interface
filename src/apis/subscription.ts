import requester from 'apis'

import {
  PaymentCurrencyData,
  PaymentDetailsData,
  PaymentRequestData,
  SubscriptionDiscountCodeData,
  SubscriptionPlanData,
  SubscriptionUsageData,
} from 'entities/subscription'
import { SubscriptionCountData, UserSubscriptionData } from 'entities/user'

import { GetSubscriptionPaymentPayload } from './types'

const SERVICE = 'nft-subscriptions'

export async function getUserSubscription() {
  return requester.get(`${SERVICE}/latest`).then((res: any) => res.data as UserSubscriptionData)
}

export async function getUserSubscriptionList() {
  return requester.get(`${SERVICE}/list`).then((res: any) => res.data as UserSubscriptionData[])
}

export async function getSubscriptionCountApi() {
  return requester.get(`${SERVICE}/count`).then((res: any) => res.data as SubscriptionCountData[])
}

export async function getSubscriptionPlansApi() {
  return requester.get(`/public/subscription-plans/all`).then((res: any) => res.data as SubscriptionPlanData[])
}

export async function paySubscriptionApi({ payload }: { payload: GetSubscriptionPaymentPayload }) {
  return requester.post(`payments`, payload).then((res: any) => res.data as PaymentRequestData)
}

export async function getPaymentCurrenciesApi() {
  return requester.get(`payments/currencies`).then((res: any) => res.data as PaymentCurrencyData[])
}

export async function getPaymentDetails(id: string) {
  return requester.get(`payments/${id}`).then((res: any) => res.data as PaymentDetailsData)
}

export async function getUserSubscriptionUsageApi() {
  return requester.get(`subscription-plans/usage`).then((res: any) => res.data as SubscriptionUsageData)
}

export async function getSubscriptionDiscountCodeApi(code: string) {
  return requester
    .get(`/discounts/getDiscountByCode`, { params: { code } })
    .then((res: any) => res.data as SubscriptionDiscountCodeData)
}
