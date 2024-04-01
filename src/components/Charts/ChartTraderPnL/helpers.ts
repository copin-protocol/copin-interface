import { TraderPnlStatisticData } from 'entities/statistic'
import { TraderData } from 'entities/trader'

export function parsePnLStatsData(data: TraderData['pnlStatistics'] | undefined): TraderPnlStatisticData[] {
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
  }, [] as TraderPnlStatisticData[])
}
