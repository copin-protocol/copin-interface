import {
  CopyStatisticData,
  PerpDexHourlyStatistic,
  PerpDexStatisticData,
  StatisticOverviewData,
  TraderPnlStatisticData,
} from 'entities/statistic.d'
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

export async function getPerpDexDailyStatisticApi({
  perpdex,
  from,
  to,
}: {
  perpdex: string
  from: number
  to: number
}) {
  return requester
    .get(`perpdex-daily-statistic/${perpdex}`, { params: { from, to } })
    .then((res: any) => res.data as PerpDexStatisticData[])
}

export async function getProtocolDailyStatisticApi({
  protocol,
  from,
  to,
}: {
  protocol: ProtocolEnum | undefined
  from: number
  to: number
}) {
  return requester
    .get(`perpdex-daily-statistic/protocol/${protocol}`, { params: { from, to } })
    .then((res: any) => res.data as PerpDexStatisticData[])
}

export async function getPerpDexHourlyStatisticApi({
  perpdex,
  from,
  to,
}: {
  perpdex: string
  from: number
  to: number
}) {
  return requester
    .get(`perpdex-hourly-statistic/${perpdex}`, { params: { from, to } })
    .then((res: any) => res.data as { [date: string]: PerpDexHourlyStatistic })
}

export async function getProtocolHourlyStatisticApi({
  protocol,
  from,
  to,
}: {
  protocol: ProtocolEnum | undefined
  from: number
  to: number
}) {
  return requester
    .get(`perpdex-hourly-statistic/protocol/${protocol}`, { params: { from, to } })
    .then((res: any) => res.data as { [date: string]: PerpDexHourlyStatistic })
}
