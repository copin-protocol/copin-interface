import { CopyTradePnL } from 'entities/copyTrade'
import { TraderPnlStatisticData } from 'entities/statistic'
import { TraderData } from 'entities/trader'

import { ChartDataType } from '../types'

// parse data from pnlStatistic in trader data (api explorer)
export function parsePnLStatsData(data: TraderData['pnlStatistics'] | undefined): ChartDataType[] {
  if (!data) return []
  //@ts-ignore
  return data.date.reduce((result, date, index) => {
    if (!date) return result
    //@ts-ignore
    const realisedPnl = data.realisedPnl?.[index] ?? 0
    //@ts-ignore
    const unrealisedPnl = data.unrealisedPnl?.[index] ?? 0
    return [
      ...result,
      {
        realisedPnl,
        unrealisedPnl,
        pnl: realisedPnl + unrealisedPnl,
        //@ts-ignore
        fee: data.fee?.[index] ?? 0,
        date,
      },
    ]
  }, [] as ChartDataType[])
}

// parse data from api get trader pnl
export function parseTraderPnLStatisticData(data: TraderPnlStatisticData[] | undefined) {
  if (!data) return []
  return data.map((stats) => {
    const realisedPnl = stats.realisedPnl ?? 0
    const unrealisedPnl = stats.unrealisedPnl ?? 0
    return {
      realisedPnl: stats.realisedPnl ?? 0,
      unrealisedPnl: stats.unrealisedPnl ?? 0,
      pnl: realisedPnl + unrealisedPnl,
      fee: stats.fee ?? 0,
      roi: stats.percentage ?? 0,
      date: stats.date,
    }
  }, [] as ChartDataType[])
}

// parse data from copy trade pnl api
export function parseCopyTraderPnLData(data: CopyTradePnL[] | undefined) {
  if (!data) return []
  return data.map((stats) => {
    return {
      realisedPnl: 0,
      unrealisedPnl: 0,
      pnl: stats.amount ?? 0,
      fee: 0,
      roi: stats.roi,
      date: stats.date,
    }
  }, [] as ChartDataType[])
}
