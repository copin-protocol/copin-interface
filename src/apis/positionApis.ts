import { ChartData, ChartDataV2 } from 'entities/chart.d'
import { OpenInterestMarketData } from 'entities/statistic'
import { PositionStatisticCounter, ResponsePositionData } from 'entities/trader.d'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum, TimeframeEnum } from 'utils/config/enums'
import { capitalizeFirstLetter, normalizePriceData } from 'utils/helpers/transform'

import { ApiListResponse } from './api'
import requester from './index'
import {
  normalizePositionData,
  normalizePositionListResponse,
  normalizePositionResponse,
  normalizeSymbolData,
} from './normalize'
import { GetApiParams, RequestBodyApiData } from './types'

const SERVICE = 'position'

const normalizePayload = (body: RequestBodyApiData) => {
  let sortBy = body.sortBy
  if (sortBy === 'pnl') {
    sortBy = 'realised' + capitalizeFirstLetter(sortBy)
  }
  if (!body.ranges) return { ...body, sortBy }
  const ranges = body.ranges.map((range) => ({
    ...range,
  }))
  ranges.forEach((range) => {
    if (range.fieldName === 'pnl') {
      range.fieldName = 'realised' + capitalizeFirstLetter(range.fieldName)
    }
  })
  return { ...body, ranges, sortBy }
}

export async function searchPositionsApi({
  txHash,
  protocol,
  limit = DEFAULT_LIMIT,
  offset = 0,
  sortBy,
  sortType,
}: GetApiParams & { txHash: string; protocol?: ProtocolEnum; sortBy?: string; sortType?: string }) {
  const params: Record<string, any> = {}
  params.txHash = txHash
  if (!!protocol) params.protocol = protocol
  if (!!sortBy) params.sortBy = sortBy
  if (!!sortType) params.sortType = sortType
  if (params.sortBy === 'pnl') {
    params.sortBy = 'realisedPnl'
  }
  return requester
    .get(`${SERVICE}/filter`, { params: { limit, offset, ...params } })
    .then((res: any) => normalizePositionListResponse(res.data as ResponsePositionData[]))
}

export async function getTopOpeningPositionsApi({
  protocol,
  limit = DEFAULT_LIMIT,
  offset = 0,
  sortBy,
  sortType,
  indexToken,
  from,
  to,
}: GetApiParams & {
  protocol: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
  indexToken?: string
  from?: string
  to?: string
}) {
  return requester
    .post(
      `${protocol}/top-positions/opening`,
      normalizePayload({
        pagination: {
          limit,
          offset,
        },
        sortBy,
        sortType,
        indexToken,
        from,
        to,
      })
    )
    .then((res: any) => normalizePositionResponse(res.data as ApiListResponse<ResponsePositionData>))
}
export async function getOpenInterestMarketApi({
  protocol,
  sortBy,
  sortType,
  indexToken,
  from,
  to,
  timeframe,
}: GetApiParams & {
  protocol: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
  indexToken?: string
  from?: string
  to?: string
  timeframe?: number
}) {
  return requester
    .get(`${protocol}/top-positions/open-interest`, {
      params: {
        sortBy,
        sortType,
        indexToken,
        from,
        to,
        timeframe,
      },
    })
    .then((res: any) => res.data as OpenInterestMarketData[])
}

export async function getPositionDetailByIdApi({ protocol, id }: { protocol: ProtocolEnum; id: string }) {
  return requester
    .get(`${protocol}/${SERVICE}/detail/${id}`)
    .then((res: any) => normalizePositionData(res.data as ResponsePositionData))
}

export async function searchPositionDetailByTxHashApi({
  protocol,
  txHash,
  account,
  logId,
}: {
  protocol: ProtocolEnum
  txHash: string
  account?: string
  logId?: number
}) {
  const params: Record<string, any> = {}
  if (!!account) params.account = account
  if (!!logId) params.logId = logId
  return requester
    .get(`${protocol}/${SERVICE}/${txHash}`, { params })
    .then((res: any) => normalizePositionListResponse(res.data as ResponsePositionData[]))
}

export async function getOpeningPositionDetailApi({
  protocol,
  account,
  indexToken,
  key,
}: {
  protocol: ProtocolEnum
  account: string
  indexToken: string
  key: string
}) {
  return requester
    .get(`${protocol}/${SERVICE}/opening/${account}/${indexToken}/${key}`)
    .then((res: any) => normalizePositionData(res.data as ResponsePositionData))
}

export async function getOpeningPositionsApi({
  protocol,
  account,
  sortBy,
  sortType,
}: {
  protocol: ProtocolEnum
  account: string
  sortBy?: string
  sortType?: string
}) {
  const params: Record<string, any> = {}
  if (!!sortBy && !!sortType) {
    params.sortBy = sortBy
    params.sortType = sortType
    switch (sortBy) {
      case 'fee':
        params.sortType = sortType === SortTypeEnum.ASC ? SortTypeEnum.DESC : SortTypeEnum.ASC
        break
      case 'pnl':
        params.sortBy = 'realisedPnl'
        break
    }
  }
  return requester.get(`${protocol}/${SERVICE}/opening/${account}`, { params }).then((res: any) =>
    (res.data as ResponsePositionData[])?.map((p) => {
      return normalizePositionData(p)
    })
  )
}

export async function getTokenTradesByTraderApi({ protocol, account }: { protocol: ProtocolEnum; account: string }) {
  return requester.get(`${protocol}/${SERVICE}/tokens/${account}`).then((res: any) => res.data?.tokens as string[])
}

export const getLatestPrices = () => requester.get(`prices/latest`).then((res) => res.data)

export const getChartData = ({
  symbol,
  timeframe,
  from,
  to,
}: {
  symbol: string
  timeframe: number | string
  from: number
  to: number
}) => requester.get(`prices`, { params: { symbol, timeframe, from, to } }).then((res) => res.data as ChartData[])

export const getChartDataV2 = ({
  symbol,
  timeframe,
  from,
  to,
}: {
  symbol: string
  timeframe: number | string
  from: number
  to: number
}) =>
  requester
    .get(`prices/v2`, {
      params: {
        symbol: normalizeSymbolData(symbol),
        timeframe: timeframe === TimeframeEnum.D1 ? '1D' : timeframe,
        from,
        to,
      },
    })
    .then((res) => {
      const data = res.data as ChartDataV2
      const tempData: ChartData[] = []
      let tempTime = 0
      for (let i = 0; i < data.o.length - 1; i++) {
        if (tempTime === data.t[i]) continue
        tempData.push({
          open: normalizePriceData(symbol, data.o[i]),
          close: normalizePriceData(symbol, data.c[i]),
          low: normalizePriceData(symbol, data.l[i]),
          high: normalizePriceData(symbol, data.h[i]),
          timestamp: data.t[i],
        })
        tempTime = data.t[i]
      }
      return tempData
    })

export const getPositionsCounterApi = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) =>
  requester
    .get(`/public/${protocol}/${SERVICE}/statistic/counter/${account}`)
    .then((res) => res.data?.data as PositionStatisticCounter[])
