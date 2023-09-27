import { CopyStatisticData, StatisticOverviewData, TraderPnlStatisticData } from 'entities/statistic.d'
import { ProtocolEnum } from 'utils/config/enums'

import requester from './index'

const SERVICE = 'statistic'
export async function getSystemStatsApi({ from, to }: { from: number; to: number }) {
  return requester.get(`${SERVICE}/copy`, { params: { from, to } }).then((res: any) => res.data as CopyStatisticData[])
}

export async function getSystemStatsOverviewApi() {
  return requester.get(`${SERVICE}/overview`).then((res: any) => res.data as StatisticOverviewData)
}
export async function getTraderPnlStatsApi({
  protocol,
  account,
  from,
  to,
}: {
  protocol: ProtocolEnum
  account: string
  from: number
  to: number
}) {
  return requester
    .get(`${protocol}/${SERVICE}/trader/pnl/${account}`, { params: { from, to } })
    .then((res: any) => res.data as TraderPnlStatisticData[])
}
