import { UserLogData } from 'entities/userLog'

import requester from './index'

const SERVICE = 'user-logs'

export async function getUserLogDetailsByModelIdApi(modelId: string) {
  return requester.get(`${SERVICE}/detail/${modelId}`).then((res: any) => res.data as UserLogData[])
}
