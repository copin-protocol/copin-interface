import { CopierLeaderboardData } from 'entities/copier'

import { ApiListResponse } from './api'
import requester from './index'
import { GetCopierLeaderboardParams } from './types'

const SERVICE = 'copier-statistics'

export async function getCopierLeaderboardApi(params: GetCopierLeaderboardParams) {
  const newParams: Record<string, any> = { ...params }
  if (!!params.sortBy) {
    newParams.sort_by = params.sortBy
    delete newParams.sortBy
  }
  if (!!params.sortType) {
    newParams.sort_type = params.sortType
    delete newParams.sortType
  }
  return requester
    .get(`${SERVICE}/page`, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<CopierLeaderboardData>)
}
