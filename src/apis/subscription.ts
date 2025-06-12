import requester from 'apis'

import {
  PaymentCurrencyData,
  PaymentDetailsData,
  PaymentRequestData,
  SubscriptionDiscountCodeData,
  SubscriptionPackageData,
  SubscriptionPlanData,
  SubscriptionUsageData,
} from 'entities/subscription'
import { SubscriptionCountData, UserSubscriptionData } from 'entities/user'
import { pageToOffset } from 'utils/helpers/transform'

import { ApiListResponse } from './api'
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

export async function getFungiesPaymentDetails(orderId: string) {
  return requester.get(`/payments/fungies/${orderId}`).then((res: any) => res.data as PaymentDetailsData)
}

export async function getUserSubscriptionUsageApi() {
  return requester.get(`subscription-plans/usage`).then((res: any) => res.data as SubscriptionUsageData)
}

export async function getSubscriptionDiscountCodeApi(code: string) {
  return requester
    .get(`/discounts/getDiscountByCode`, { params: { code } })
    .then((res: any) => res.data as SubscriptionDiscountCodeData)
}

export async function getSubscriptionFungiesPackagesApi() {
  return requester.get(`/payments/elements/checkout/list`).then((res: any) => res.data as SubscriptionPackageData[])
}

export async function getSubscriptionPaymentHistoryApi({ page, limit }: { page: number; limit: number }) {
  return requester
    .get(`/payments/subscription/history`, {
      params: {
        limit,
        offset: pageToOffset(page, limit),
      },
    })
    .then((res: any) => res.data as ApiListResponse<PaymentDetailsData>)
}
