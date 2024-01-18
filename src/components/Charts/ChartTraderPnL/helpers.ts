import { TraderPnlStatisticData } from 'entities/statistic'
import { TraderData } from 'entities/trader'

export function parsePnLStatsData(data: TraderData['pnlStatistics'] | undefined): TraderPnlStatisticData[] {
  if (!data) return []
  return data.date.reduce((result, date, index) => {
    if (!date) return result
    return [
      ...result,
      {
        pnl: data.pnl?.[index] ?? 0,
        fee: data.fee?.[index] ?? 0,
        date,
      },
    ]
  }, [] as TraderPnlStatisticData[])
}
