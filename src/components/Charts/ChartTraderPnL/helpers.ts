import { TraderPnlStatisticData } from 'entities/statistic'
import { TraderData } from 'entities/trader'

export function parsePnLStatsData(data: TraderData['pnlStatistics'] | undefined): TraderPnlStatisticData[] {
  if (!data) return []
  return data.date.reduce((result, date, index) => {
    if (!date) return result
    return [
      ...result,
      {
        pnl: data.value[index] ?? 0,
        fee: 0,
        date,
      },
    ]
  }, [] as TraderPnlStatisticData[])
}
