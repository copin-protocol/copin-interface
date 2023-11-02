import { UserActivityData } from 'entities/user'
import { DEFAULT_LIMIT } from 'utils/config/constants'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams } from './types'

const SERVICE = 'activity-logs'

export async function getUserActivityLogsApi({ limit = DEFAULT_LIMIT, offset = 0 }: GetApiParams) {
  return requester
    .get(`${SERVICE}/page`, { params: { limit, offset } })
    .then((res: any) => res.data as ApiListResponse<UserActivityData>)
}
