import { AxiosResponse } from 'axios'

import {
  CheckAvailableResultData,
  ResponsePositionData,
  ResponseTraderData,
  TraderCounter,
  TraderData,
} from 'entities/trader.d'
import { TraderTokenStatistic } from 'entities/trader.d'
import { PositionSortPros } from 'pages/TraderDetails'
import { ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'
import { capitalizeFirstLetter } from 'utils/helpers/transform'

import { ApiListResponse } from './api'
import { apiWrapper } from './helpers'
import requester from './index'
import { normalizePositionResponse, normalizeTraderData, normalizeTraderResponse } from './normalize'
import { GetApiParams, QueryFilter, RangeFilter, RequestBodyApiData, SearchTradersParams } from './types'

const SERVICE = 'position'

function transformRealisedField(fieldName: string) {
  switch (fieldName) {
    case 'pnl':
    case 'maxPnl':
    case 'avgRoi':
    case 'maxRoi':
    case 'totalGain':
    case 'totalLoss':
    case 'maxDrawdown':
    case 'maxDrawdownPnl':
    case 'profitRate':
    case 'gainLossRatio':
    case 'profitLossRatio':
      return 'realised' + capitalizeFirstLetter(fieldName)
    default:
      return fieldName
  }
}

const normalizePayload = (body: RequestBodyApiData) => {
  let sortBy = body.sortBy
  if (!!sortBy) {
    sortBy = transformRealisedField(sortBy)
  }
  if (!body.ranges) return { ...body, sortBy }
  const ranges = body.ranges.map((range) => ({
    ...range,
  }))
  if (ranges?.[0].fieldName.match('ranking')) {
    ranges.forEach((range) => {
      const [_prefix, _fieldName] = range.fieldName.split('.')
      if (_fieldName === 'pnl') return
      range.fieldName = _prefix + '.' + transformRealisedField(_fieldName)
    })
  } else {
    ranges.forEach((range) => {
      range.fieldName = transformRealisedField(range.fieldName)
      switch (range.fieldName) {
        case 'avgDuration':
        case 'minDuration':
        case 'maxDuration':
          if (range.gte) {
            range.gte = range.gte * 3600
          }
          if (range.lte) {
            range.lte = range.lte * 3600
          }
          break
        case 'lastTradeAtTs':
          let gte, lte
          if (range.gte) {
            lte = Date.now() - range.gte * 24 * 3600 * 1000
          }
          if (range.lte) {
            gte = Date.now() - range.lte * 24 * 3600 * 1000
          }
          range.gte = gte
          range.lte = lte
          break
        case 'longRate':
          if (range.gte && range.gte > 100) {
            range.gte = 100
          }
          break
      }
    })
  }
  return { ...body, ranges, sortBy }
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
  return requester
    .post(apiWrapper(`${protocol}/${SERVICE}/statistic/filter`), normalizePayload(params))
    .then((res: any) => normalizeTraderResponse(res.data as ApiListResponse<ResponseTraderData>))
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
    .post(apiWrapper(`${protocol}/${SERVICE}/statistic/filter`), { queries: queryFilters, returnRanking })
    .then((res: any) =>
      res.data.data && res.data.data.length > 0
        ? normalizeTraderData(res.data.data[0] as ResponseTraderData)
        : undefined
    )
}

export async function searchTradersApi(params: SearchTradersParams) {
  return requester
    .get(`${SERVICE}/statistic/filter`, { params })
    .then((res: any) => normalizeTraderResponse(res.data as ApiListResponse<ResponseTraderData>))
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
    .then((res: any) => normalizePositionResponse(res.data as ApiListResponse<ResponsePositionData>))
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
    .post(apiWrapper(`${protocol}/${SERVICE}/statistic/counter/level?type=${timeframe}`), params)
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
    .then((res: any) => normalizeTraderResponse(res.data as ApiListResponse<ResponseTraderData>))
}

export async function getTraderStatisticApi({ protocol, account }: { protocol: ProtocolEnum; account: string }) {
  return requester.get(apiWrapper(`${protocol}/${SERVICE}/statistic/trader/${account}`)).then((res: any) => {
    const data = res.data as { [key in TimeFilterByEnum]: ResponseTraderData }
    const normalizedData = {} as { [key in TimeFilterByEnum]: TraderData }
    for (const key in data) {
      const _key = key as unknown as TimeFilterByEnum
      normalizedData[_key] = normalizeTraderData(data[_key])
    }
    return normalizedData
  })
}

export async function getTraderTokensStatistic(
  { protocol, account }: { protocol: ProtocolEnum; account: string },
  others?: GetApiParams & { sortBy?: string; sortType?: SortTypeEnum }
) {
  const { limit = 100, offset = 0, sortBy: sort_by, sortType: sort_type } = others ?? {}
  const params = { limit, offset, sort_by, sort_type }
  return requester
    .get(`${protocol}/${SERVICE}/tokens/${account}/statistic`, { params })
    .then((res: AxiosResponse<ApiListResponse<TraderTokenStatistic>>) => res.data)
}
