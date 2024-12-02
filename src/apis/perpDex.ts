import requester from 'apis'

import { PerpDEXEventResponse, PerpDEXSourceResponse, ReportPerpDEXResponse } from 'entities/perpDexsExplorer'

export async function getPerpDexStatisticApi() {
  return requester.get(`/perpdex/list`).then((res: any) => res.data as PerpDEXSourceResponse[])
}

export async function getPerpDexEventApi() {
  return requester.get(`/perpdex-events?isPublic=true`).then((res: any) => res.data as PerpDEXEventResponse[])
}

export async function reportPerpDexApi(data: FormData) {
  return requester.post(`/report-perpdex/report`, data).then((res: any) => res.data as ReportPerpDEXResponse)
}
