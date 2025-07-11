import { DeviceLog } from 'entities/deviceLog'

import { ApiListResponse } from './api'
import requester from './index'
import { PaginationParams } from './types'

export const postLogApi = (data: string) => {
  return requester.post('/logs', { data })
}

export const getLogsApi = (params: PaginationParams): Promise<ApiListResponse<DeviceLog>> => {
  return requester.get('/logs/page', { params }).then((res) => res.data)
}
