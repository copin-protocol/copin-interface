import { LatestActivityLogData, UserActivityData } from 'entities/user'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { CopyTradePlatformEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import {
  GetApiParams,
  GetUserActifityLogPayload,
  PaginationParams,
  QueryFilter,
  RangeFilter,
  RequestBodyApiData,
} from './types'

const SERVICE = 'activity-logs'

export async function getUserActivityLogsApi({
  limit = DEFAULT_LIMIT,
  offset = 0,
  copyTradeIds,
  copyWalletIds,
  exchange,
  protocol,
  sortBy,
  sortType,
  traders,
  method = 'GET',
}: GetUserActifityLogPayload & GetApiParams & { method?: 'GET' | 'POST' }) {
  if (method === 'GET') {
    const params: Record<string, any> = {}
    if (copyWalletIds) params.copyWalletIds = copyWalletIds
    if (copyTradeIds) params.copyTradeIds = copyTradeIds
    if (exchange) params.exchange = exchange
    if (protocol) params.protocol = protocol
    if (sortBy) params.sort_by = sortBy
    if (sortType) params.sort_type = sortType
    if (!!traders) params.traders = traders
    return requester
      .get(`${SERVICE}/page`, { params: { limit, offset, ...params } })
      .then((res: any) => res.data as ApiListResponse<UserActivityData>)
  } else {
    const payload: RequestBodyApiData = {}
    payload.pagination = {
      limit,
      offset,
    }
    const ranges: RangeFilter<keyof UserActivityData>[] = []
    if (!!traders) {
      ranges.push({
        fieldName: 'sourceAccount',
        in: traders,
      })
    }
    if (copyTradeIds?.length) {
      ranges.push({
        fieldName: 'copyTradeId',
        in: copyTradeIds,
      })
    }
    if (copyWalletIds?.length) {
      ranges.push({
        fieldName: 'copyWalletId',
        in: copyWalletIds,
      })
    }
    payload.ranges = ranges

    if (sortBy) payload.sortBy = sortBy
    if (sortType) payload.sortType = sortType
    return requester.post(`${SERVICE}/page`, payload).then((res: any) => res.data as ApiListResponse<UserActivityData>)
  }
}

export async function getLatestActivityLogsApi({ limit = DEFAULT_LIMIT, offset = 0 }: GetApiParams) {
  return requester
    .get(`/public/${SERVICE}/latest`, { params: { limit, offset } })
    .then((res: any) => res.data as LatestActivityLogData[])
}
