import { AlertLogData } from 'entities/alertLog'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { AlertTypeEnum, SortTypeEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams } from './types'

const SERVICE = 'alert-logs'

export async function getAlertLogsApi({
  limit = DEFAULT_LIMIT,
  offset = 0,
  alertChannel,
  alertType,
  isSuccess,
  sortBy,
  sortType,
}: {
  alertChannel?: string
  alertType?: AlertTypeEnum
  isSuccess?: boolean
  sortBy?: string
  sortType?: SortTypeEnum
} & GetApiParams) {
  const params: Record<string, any> = {}
  if (!!alertChannel) params.alertChannel = alertChannel
  if (!!alertType) params.alertType = alertType
  if (isSuccess != null) params.isSuccess = isSuccess
  if (!!sortBy) params.sortBy = sortBy
  if (!!sortType) params.sortType = sortType
  return requester
    .get(`${SERVICE}/page`, { params: { limit, offset, ...params } })
    .then((res: any) => res.data as ApiListResponse<AlertLogData>)
}
