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
    return [
      ...result,
      {
        //@ts-ignore
        pnl: data.pnl?.[index] ?? 0,
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
    return {
      pnl: stats.pnl ?? 0,
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
      pnl: stats.amount ?? 0,
      fee: 0,
      roi: stats.roi,
      date: stats.date,
    }
  }, [] as ChartDataType[])
}
