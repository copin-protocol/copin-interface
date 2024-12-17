import requester from 'apis'

import { PerpDEXEventResponse, PerpDEXSourceResponse, ReportPerpDEXResponse } from 'entities/perpDexsExplorer'
import { formatPerpDexData } from 'pages/PerpDEXsExplorer/helpers/dataHelper'

export async function getPerpDexStatisticApi() {
  return requester
    .get(`/perpdex/list`)
    .then((res: any) => (res.data as PerpDEXSourceResponse[])?.map((data) => formatPerpDexData(data)))
}

export async function getPerpDexEventApi() {
  return requester.get(`/perpdex-events?isPublic=true`).then((res: any) => res.data as PerpDEXEventResponse[])
}

export async function reportPerpDexApi(data: FormData) {
  return requester.post(`/report-perpdex/report`, data).then((res: any) => res.data as ReportPerpDEXResponse)
}
