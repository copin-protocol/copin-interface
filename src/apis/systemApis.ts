import requester from 'apis'

import { SystemConfigData } from 'entities/systemConfig.d'

const SERVICE = 'main-service/public/system-configs'

export async function getSystemConfigsApi() {
  return requester.get(`${SERVICE}`).then((res: any) => res.data?.data as SystemConfigData)
}
