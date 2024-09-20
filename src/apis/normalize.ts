import { BaseGraphQLResponse } from 'graphql/entities/base.graph'

import {
  PositionData,
  ResponsePositionData,
  ResponseTraderData,
  TraderData,
  TraderTokenStatistic,
} from 'entities/trader'
import { MarginModeEnum, PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { decodeRealisedData } from 'utils/helpers/handleRealised'
import { convertDurationInSecond } from 'utils/helpers/transform'

import { PROTOCOLS_CROSS_MARGIN } from '../utils/config/protocols'
import { getSymbolByTokenTrade, getTokenTradeSupport } from '../utils/config/trades'
import { ApiListResponse } from './api'

export const normalizeTraderData = (t: ResponseTraderData) => {
  const normalizedData: TraderData = {
    ...t,
    totalGain: t.realisedTotalGain,
    totalLoss: t.realisedTotalLoss,
    avgRoi: t.realisedAvgRoi,
    maxRoi: t.realisedMaxRoi,
    pnl: t.realisedPnl,
    maxPnl: t.realisedMaxPnl,
    maxDrawdown: t.realisedMaxDrawdown,
    maxDrawdownPnl: t.realisedMaxDrawdownPnl,
    profitRate: t.realisedProfitRate,
    gainLossRatio: t.realisedGainLossRatio,
    profitLossRatio: t.realisedProfitLossRatio,
    ranking: t.ranking ? decodeRealisedData(t.ranking) : {},
  }
  return normalizedData
}

export const normalizePositionData = (p: ResponsePositionData): PositionData => {
  return {
    ...p,
    roi: p.realisedRoi,
    pnl: p.realisedPnl,
    durationInSecond:
      p.status === PositionStatusEnum.OPEN ? convertDurationInSecond(p.openBlockTime) : p.durationInSecond,
    marginMode: p.marginMode
      ? p.marginMode
      : PROTOCOLS_CROSS_MARGIN.includes(p.protocol)
      ? MarginModeEnum.CROSS
      : MarginModeEnum.ISOLATED,
  }
}

export const normalizeTraderResponse = (res: ApiListResponse<ResponseTraderData>): ApiListResponse<TraderData> => {
  if (!res.data) return res
  return {
    ...res,
    data: res.data.map(normalizeTraderData),
  }
}

export const normalizePositionResponse = (
  res: ApiListResponse<ResponsePositionData> | BaseGraphQLResponse<ResponsePositionData>
): ApiListResponse<PositionData> => {
  if (!res.data) return res
  return {
    ...res,
    data: res.data.map(normalizePositionData),
  }
}

export const normalizePositionListResponse = (res: ResponsePositionData[]): PositionData[] => {
  if (!res) return res
  return res.map(normalizePositionData)
}

export const normalizeTokenStatisticResponse = ({
  protocol,
  res,
}: {
  protocol: ProtocolEnum
  res: ApiListResponse<TraderTokenStatistic>
}): ApiListResponse<TraderTokenStatistic> => {
  if (!res.data) return res
  const symbolByIndexToken = getSymbolByTokenTrade(protocol)
  const mappedSymbolData: TraderTokenStatistic[] = res.data.map((_v) => ({
    ..._v,
    symbol: symbolByIndexToken[_v.indexToken],
  }))
  const checker: Record<string, number> = {}
  let parsedData: TraderTokenStatistic[] = []
  mappedSymbolData.forEach((_v) => {
    if (checker[_v.symbol] == null) {
      checker[_v.symbol] = parsedData.length
      parsedData.push({
        ..._v,
        indexTokens: Array.from(new Set([...(_v.indexTokens || []), ...(_v.indexTokens || []), _v.indexToken])),
      })
    } else {
      const _data = parsedData[checker[_v.symbol]]
      Object.entries(_v).forEach(([_key, _value]) => {
        const key = _key as keyof TraderTokenStatistic
        if (_data[key] != null && typeof _value === 'number') {
          //@ts-ignore
          _data[key] += _value
        }
        if (key === 'indexTokens') {
          _data.indexTokens = Array.from(
            new Set([...(_data.indexTokens || []), ...(_v.indexTokens || []), _v.indexToken])
          )
        }
      })
    }
  })
  parsedData = parsedData.map((_v) => ({ ..._v, winRate: _v.totalTrade ? (_v.totalWin / _v.totalTrade) * 100 : 0 }))

  parsedData.sort((a, b) => {
    return (b.totalTrade ?? 0) - (a.totalTrade ?? 0)
  })

  return {
    ...res,
    data: parsedData,
  }
}

export const normalizeSymbolData = (symbol: string) => {
  switch (symbol) {
    case '1000BONK':
      return 'BONK'
    case '1000PEPE':
      return 'PEPE'
    default:
      return symbol
  }
}
