import requester from 'apis'

import { ListenerStatsData, PlanLimitData, SystemConfigData, VolumeLimitData } from 'entities/system'

const SERVICE = 'system-statuses'

export async function getListenerStatsApi() {
  return requester.get(`${SERVICE}/listener-stats`).then((res: any) => res.data as ListenerStatsData)
}

export async function getVolumeLimit() {
  return requester.get(`/public/copy-trades/volume-config`).then((res: any) => res.data as VolumeLimitData)
}

export async function getPlanLimit() {
  return requester.get(`/public/plans/list`).then((res: any) => res.data as PlanLimitData[])
}

export async function getSystemConfigApi() {
  return requester.get(`/public/system-configs`).then((res: any) => res.data as SystemConfigData)
}
