import { PositionData, ResponsePositionData, ResponseTraderData, TraderData } from 'entities/trader'
import { decodeRealisedData } from 'utils/helpers/handleRealised'

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
