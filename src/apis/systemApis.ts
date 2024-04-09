import requester from 'apis'

import { ListenerStatsData } from 'entities/system'

const SERVICE = 'system-statuses'

export async function getListenerStatsApi() {
  return requester.get(`${SERVICE}/listener-stats`).then((res: any) => res.data as ListenerStatsData)
}
