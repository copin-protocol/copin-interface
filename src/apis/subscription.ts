import requester from 'apis'

import { SubscriptionCountData, UserSubscriptionData } from 'entities/user'

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
