import requester from 'apis'

import { UserSubscriptionData } from 'entities/user'

const SERVICE = 'nft-subscriptions'

export async function getUserSubscription() {
  return requester.get(`${SERVICE}/latest`).then((res: any) => res.data as UserSubscriptionData)
}
