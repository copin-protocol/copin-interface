import { CopyPositionData } from 'entities/copyTrade.d'

import requester from './index'

const SERVICE = 'copy-positions'

export async function forceCloseCopyPositionApi(copyId: string) {
  return requester.post(`${SERVICE}/close/${copyId}`).then((res: any) => res.data as CopyPositionData)
}
