// import requester from 'apis/index'
// import { TraderData } from 'entities/trader'
// import { ApiListResponse } from './api'
import { CheckAvailableResultData, PositionData, TraderCounter, TraderData } from 'entities/trader.d'
import { PositionSortPros } from 'pages/TraderDetails'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams, QueryFilter, RangeFilter, RequestBodyApiData } from './types'

const SERVICE = 'position'

const normalizePayload = (body: RequestBodyApiData) => {
  if (!body.ranges) return body
  const ranges = body.ranges.map((range) => ({
    ...range,
  }))
  ranges.forEach((range) => {
    if (range.fieldName === 'avgDuration' || range.fieldName === 'minDuration' || range.fieldName === 'maxDuration') {
      if (range.gte) {
        range.gte = range.gte * 3600
      }
      if (range.lte) {
        range.lte = range.lte * 3600
      }
    } else if (range.fieldName === 'lastTradeAtTs') {
      let gte, lte
      if (range.gte) {
        lte = Date.now() - range.gte * 24 * 3600 * 1000
      }
      if (range.lte) {
        gte = Date.now() - range.lte * 24 * 3600 * 1000
      }
      range.gte = gte
      range.lte = lte
    }
  })
  return { ...body, ranges }
}

export async function getTradersApi({ protocol, body }: { protocol: ProtocolEnum; body: RequestBodyApiData }) {
  const params: Record<string, any> = { pagination: body.pagination, returnRanking: body.returnRanking }
  if (!!body.queries && body.queries.length > 0) params.queries = body.queries
  if (!!body.ranges && body.ranges.length > 0) params.ranges = body.ranges
  if (!!body.sortBy) {
    params.sortBy = body.sortBy
  }
  if (!!body?.sortType) {
    params.sortType = body.sortType
  }
  if (!!body?.keyword) {
    params.keyword = body.keyword
  }
  // return traderListData
  return requester
    .post(`${protocol}/${SERVICE}/statistic/filter`, normalizePayload(params))
    .then((res: any) => res.data as ApiListResponse<TraderData>)
}

export async function getTraderApi({
  protocol,
  account,
  type,
  returnRanking,
}: {
  protocol: ProtocolEnum
  account: string
  type?: TimeFilterByEnum
  returnRanking?: boolean
}) {
  // return traderListData.data[0]
  const queryFilters: QueryFilter[] = [{ fieldName: 'account', value: account }]
  if (!!type) {
    queryFilters.push({ fieldName: 'type', value: type })
  }
  return requester
    .post(`${protocol}/${SERVICE}/statistic/filter`, { queries: queryFilters, returnRanking })
    .then((res: any) => (res.data.data && res.data.data.length > 0 ? (res.data.data[0] as TraderData) : undefined))
}

export async function getTraderHistoryApi({
  limit = 5,
  offset = 0,
  protocol,
  type,
  account,
  queryFilters,
  rangeFilters,
  sort,
}: GetApiParams & {
  protocol: ProtocolEnum
  type?: TimeFilterByEnum
  account?: string
  queryFilters?: QueryFilter[]
  rangeFilters?: RangeFilter[]
  sort?: PositionSortPros
}) {
  const params: Record<string, any> = { pagination: { limit, offset }, type, account }
  if (!!queryFilters && queryFilters.length > 0) params.queries = queryFilters
  if (!!rangeFilters && rangeFilters.length > 0) params.ranges = rangeFilters
  if (!!sort) {
    params.sortBy = sort.sortBy
    params.sortType = sort.sortType
  }
  return requester
    .post(`${protocol}/${SERVICE}/filter`, params)
    .then((res: any) => res.data as ApiListResponse<PositionData>)
}

export async function getTradersCounter(
  protocol: ProtocolEnum,
  payload: RequestBodyApiData,
  timeframe: TimeFilterByEnum
) {
  const body = normalizePayload(payload)
  const params: Record<string, any> = { pagination: body.pagination }
  if (!!body.ranges && body.ranges.length > 0) params.ranges = body.ranges

  return requester
    .post(`${protocol}/${SERVICE}/statistic/counter/level?type=${timeframe}`, params)
    .then((res: any) => res.data as TraderCounter[])
}

type RangeParams = { from: number; to: number }
export async function generateDataApi(protocol: ProtocolEnum, params: RangeParams) {
  return requester
    .get(`${protocol}/${SERVICE}/generate/temp-data`, { params })
    .then(() => true)
    .catch(() => false)
}

export async function checkAvailableDataApi(protocol: ProtocolEnum, params: RangeParams) {
  return requester
    .get(`${protocol}/${SERVICE}/check-available-position-statistic-data`, { params })
    .then((res: any) => res.data as CheckAvailableResultData)
}
export async function getTradersByTimeRangeApi({
  protocol,
  params,
  body,
}: {
  protocol: ProtocolEnum
  params: RangeParams
  body: RequestBodyApiData
}) {
  return requester
    .post(`${protocol}/${SERVICE}/custom/filter`, normalizePayload(body), { params })
    .then((res: any) => res.data as ApiListResponse<TraderData>)
}
