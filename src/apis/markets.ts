import { MarketsData } from 'entities/markets'

import requester from './index'

export async function getMarketData() {
  return requester.get(`/pairs/tokens`).then((res: any) => res.data?.data as MarketsData)
}
