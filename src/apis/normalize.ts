import {
  PositionData,
  ResponsePositionData,
  ResponseTraderData,
  TraderData,
  TraderTokenStatistic,
} from 'entities/trader'
import { SortTypeEnum } from 'utils/config/enums'
import { decodeRealisedData } from 'utils/helpers/handleRealised'
import { convertDurationInSecond } from 'utils/helpers/transform'

import { ApiListResponse } from './api'

export const normalizeTraderData = (t: ResponseTraderData) => {
  t.totalGain = t.realisedTotalGain
  t.totalLoss = t.realisedTotalLoss
  t.avgRoi = t.realisedAvgRoi
  t.maxRoi = t.realisedMaxRoi
  t.pnl = t.realisedPnl
  t.maxPnl = t.realisedMaxPnl
  t.maxDrawdown = t.realisedMaxDrawdown
  t.maxDrawdownPnl = t.realisedMaxDrawdownPnl
  t.profitRate = t.realisedProfitRate
  t.gainLossRatio = t.realisedGainLossRatio
  t.profitLossRatio = t.realisedProfitLossRatio
  if (t.ranking) {
    t.ranking = decodeRealisedData(t.ranking)
  }
  return t as TraderData
}

export const normalizePositionData = (p: ResponsePositionData) => {
  p.roi = p.realisedRoi
  p.pnl = p.realisedPnl
  if (!p.durationInSecond) {
    p.durationInSecond = convertDurationInSecond(p.openBlockTime)
  }
  return p as PositionData
}

export const normalizeTraderResponse = (res: ApiListResponse<ResponseTraderData>): ApiListResponse<TraderData> => {
  if (!res.data) return res
  return {
    ...res,
    data: res.data.map(normalizeTraderData),
  }
}

export const normalizePositionResponse = (
  res: ApiListResponse<ResponsePositionData>
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
  res,
  sortBy,
  sortType,
}: {
  res: ApiListResponse<TraderTokenStatistic>
  sortBy?: string
  sortType?: SortTypeEnum
}): ApiListResponse<TraderTokenStatistic> => {
  if (!res.data) return res
  const data = res.data.map((item) => {
    return { ...item, winRate: item.totalTrade ? (item.totalWin / item.totalTrade) * 100 : 0 } as TraderTokenStatistic
  })
  if (sortBy === 'winRate') {
    return {
      ...res,
      data: data.sort((a, b) => {
        return ((a.winRate ?? 0) - (b.winRate ?? 0)) * (sortType === SortTypeEnum.DESC ? -1 : 1)
      }),
    }
  }
  return {
    ...res,
    data,
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
