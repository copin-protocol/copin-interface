import { AxiosResponse } from 'axios'

import {
  CheckAvailableResultData,
  OrderData,
  PnlStatisticsResponse,
  ResponsePositionData,
  ResponseTraderData,
  ResponseTraderExchangeStatistic,
  StatisticData,
  TraderCounter,
  TraderData,
} from 'entities/trader.d'
import { TraderTokenStatistic } from 'entities/trader.d'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { PositionSortPros } from 'pages/TraderDetails'
import { ProtocolEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'
import { hideField } from 'utils/config/hideFileld'
import { capitalizeFirstLetter } from 'utils/helpers/transform'

import { ApiListResponse } from './api'
import { apiWrapper } from './helpers'
import requester from './index'
import {
  normalizePositionResponse,
  normalizeTokenStatisticResponse,
  normalizeTraderData,
  normalizeTraderResponse,
} from './normalize'
import {
  GetApiParams,
  GetTraderByLabelPayload,
  QueryFilter,
  RangeFilter,
  RequestBodyApiData,
  SearchTradersParams,
} from './types'

const SERVICE = 'position'

export function transformRealisedField(fieldName: string) {
  switch (fieldName) {
    case 'pnl':
    case 'maxPnl':
    case 'roi':
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

export const normalizeTraderPayload = (body: RequestBodyApiData) => {
  const pnlWithFeeEnabled = useUserPreferencesStore.getState().pnlWithFeeEnabled ?? false
  let sortBy = body.sortBy

  if (sortBy) {
    sortBy = pnlWithFeeEnabled ? sortBy : transformRealisedField(sortBy)
  }
  if (!body.ranges) return { ...body, sortBy }
  const ranges = body.ranges
    .map((range) => ({
      ...range,
    }))
    .filter((range) => range.fieldName !== 'indexTokens' || !!range.in?.length)
  if (ranges?.[0]?.fieldName?.match('ranking')) {
    ranges.forEach((range) => {
      const [_prefix, _fieldName] = range.fieldName.split('.')
      if (_fieldName === 'pnl') {
        if (pnlWithFeeEnabled) {
          range.fieldName = _prefix + '.realisedPnl'
        }
        return
      }
      range.fieldName = _prefix + '.' + transformRealisedField(_fieldName)
    })
  } else {
    ranges.forEach((range) => {
      range.fieldName = pnlWithFeeEnabled ? range.fieldName : transformRealisedField(range.fieldName)

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
  const params: Record<string, any> = {
    pagination: body.pagination,
    returnRanking: body.returnRanking,
    returnPnlStatistic: body.returnPnlStatistic,
  }
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
    .post(apiWrapper(`${protocol}/${SERVICE}/statistic/filter`), normalizeTraderPayload(params))
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
    .get(`/public/${SERVICE}/statistic/filter`, { params })
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
    params.sortType = sort?.sortType
    switch (sort.sortBy) {
      case 'fee':
        params.sortType = sort.sortType === SortTypeEnum.ASC ? SortTypeEnum.DESC : SortTypeEnum.ASC
        break
    }
  }
  return requester.post(`${protocol}/${SERVICE}/filter/${account}`, normalizeTraderPayload(params)).then((res: any) => {
    const normalize = normalizePositionResponse(res.data as ApiListResponse<ResponsePositionData>)
    return normalize
  })
}

export async function getTradersCounter(
  protocols: ProtocolEnum[],
  payload: RequestBodyApiData,
  timeframe: TimeFilterByEnum
) {
  const body = normalizeTraderPayload(payload)
  const params: Record<string, any> = { pagination: body.pagination }
  if (!!body.ranges && body.ranges.length > 0) params.ranges = body.ranges
  if (protocols?.length > 0) {
    params.protocols = protocols
  }

  return requester
    .post(`public/${SERVICE}/statistic/counter/level?type=${timeframe}`, params)
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
    .post(`${protocol}/${SERVICE}/custom/filter`, normalizeTraderPayload(body), { params })
    .then((res: any) => normalizeTraderResponse(res.data as ApiListResponse<ResponseTraderData>))
}

export async function getTraderStatisticApi({
  protocol,
  account,
  pnlWithFeeEnabled,
}: {
  protocol: ProtocolEnum
  account: string
  pnlWithFeeEnabled?: boolean
}) {
  return requester.get(apiWrapper(`${protocol}/${SERVICE}/statistic/trader/${account}`)).then((res: any) => {
    const data = res.data as { [key in TimeFilterByEnum]: ResponseTraderData }

    const normalizedData = {} as { [key in TimeFilterByEnum]: TraderData }

    for (const key in data) {
      const _key = key as TimeFilterByEnum
      normalizedData[_key] = normalizeTraderData(hideField(data[_key]) as ResponseTraderData, pnlWithFeeEnabled)
    }

    return normalizedData
  })
}

export async function getTraderTokensStatistic(
  { protocol, account }: { protocol: ProtocolEnum; account: string },
  others?: GetApiParams & { sortBy?: string; sortType?: SortTypeEnum }
) {
  const { limit = 100, offset = 0 } = others ?? {}
  const params = { limit, offset }
  return requester
    .get(`${protocol}/${SERVICE}/tokens/${account}/statistic`, { params })
    .then((res: AxiosResponse<ApiListResponse<TraderTokenStatistic>>) =>
      normalizeTokenStatisticResponse({ protocol, res: res.data })
    )
}

export async function getTraderExchangeStatistic({ account }: { account: string }) {
  return requester
    .get(`public/${SERVICE}/statistic/exchange/${account}`)
    .then((res: any) => res.data as ResponseTraderExchangeStatistic)
}

export async function getTraderMultiExchangeStatistic({
  account,
  params,
}: {
  account: string
  params: { statisticType: TimeFilterByEnum }
}) {
  return requester.get(`public/${SERVICE}/statistic/trader/${account}`, { params }).then((res: any) => {
    return res.data as { [protocol in ProtocolEnum]: ResponseTraderData }
  })
}

export async function getPnlStatisticsApi(payload: StatisticData) {
  return requester
    .post(`public/${SERVICE}/statistic/pnl-statistics-v2`, payload)
    .then((res: any) => res.data as PnlStatisticsResponse)
}

export async function getTraderByLabelApi({ payload }: { payload: GetTraderByLabelPayload }) {
  return requester
    .post(`/public/position/statistic/labels?offset=0&limit=16`, payload)
    .then((res: any) => res.data as ApiListResponse<ResponseTraderData>)
}

export async function exportTradersCsvApi(payload: any) {
  return requester.post(`${SERVICE}/statistic/download`, payload).then((res: any) => res.data)
}
export async function preExportTradersCsvApi(payload: any) {
  return requester
    .post(`${SERVICE}/statistic/pre-download`, payload)
    .then((res: any) => res.data as { estimatedQuota: number; remainingQuota: number })
}

export async function getTraderLastOrder({
  account,
  protocol,
}: {
  account: string
  protocol: ProtocolEnum
}): Promise<OrderData | null> {
  return requester.get(`${protocol}/order/${account}/last-order`).then((res: any) => res.data)
}
