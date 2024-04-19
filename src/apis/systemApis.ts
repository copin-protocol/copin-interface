import requester from 'apis'

import { ListenerStatsData, VolumeLimitData } from 'entities/system'

const SERVICE = 'system-statuses'

export async function getListenerStatsApi() {
  return requester.get(`${SERVICE}/listener-stats`).then((res: any) => res.data as ListenerStatsData)
}

export async function getVolumeLimit() {
  return requester.get(`/public/copy-trades/volume-config`).then((res: any) => res.data as VolumeLimitData)
}
