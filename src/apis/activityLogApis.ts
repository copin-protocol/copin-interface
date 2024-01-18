import { LatestActivityLogData, UserActivityData } from 'entities/user'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { CopyTradePlatformEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams } from './types'

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
}: {
  copyTradeIds?: string[]
  copyWalletIds?: string[]
  exchange?: CopyTradePlatformEnum
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
} & GetApiParams) {
  const params: Record<string, any> = {}
  if (copyWalletIds) params.copyWalletIds = copyWalletIds
  if (copyTradeIds) params.copyTradeIds = copyTradeIds
  if (exchange) params.exchange = exchange
  if (protocol) params.protocol = protocol
  if (sortBy) params.sort_by = sortBy
  if (sortType) params.sort_type = sortType
  return requester
    .get(`${SERVICE}/page`, { params: { limit, offset, ...params } })
    .then((res: any) => res.data as ApiListResponse<UserActivityData>)
}

export async function getLatestActivityLogsApi({ limit = DEFAULT_LIMIT, offset = 0 }: GetApiParams) {
  return requester
    .get(`/public/${SERVICE}/latest`, { params: { limit, offset } })
    .then((res: any) => res.data as LatestActivityLogData[])
}
