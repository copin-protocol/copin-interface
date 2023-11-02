import { TopTraderData } from 'entities/trader'

import { ApiListResponse } from './api'
import requester from './index'
import { GetLeaderboardParams } from './types'

const SERVICE = 'leaderboards'

export async function getLeaderboardApi(params: GetLeaderboardParams) {
  const newParams: Record<string, any> = { ...params }
  if (!!params.sortBy) {
    newParams.sort_by = params.sortBy
    delete newParams.sortBy
  }
  if (!!params.sortType) {
    newParams.sort_type = params.sortType
    delete newParams.sortType
  }
  if (!!params.keyword) {
    newParams.account = params.keyword
    delete newParams.keyword
  }
  return requester
    .get(`${SERVICE}/page`, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<TopTraderData>)
}
