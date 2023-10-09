import { CopyOrderData, CopyPositionData } from 'entities/copyTrade.d'
import { PositionData } from 'entities/trader.d'

import requester from './index'

const SERVICE = 'copy-positions'

export async function getMyCopyPositionDetailApi({ copyId }: { copyId: string }) {
  return requester.get(`${SERVICE}/${copyId}`).then((res: any) => res.data as CopyPositionData)
}

export async function getMyCopySourcePositionDetailApi({ copyId, isOpen }: { copyId: string; isOpen: boolean }) {
  return requester
    .get(`${SERVICE}/${copyId}/position${isOpen ? '/opening' : ''}`)
    .then((res: any) => res.data as PositionData)
}

export async function getMyCopyOrdersApi({ copyId }: { copyId: string }) {
  return requester.get(`${SERVICE}/${copyId}/orders`).then((res: any) => res.data as CopyOrderData[])
}

export async function forceCloseCopyPositionApi(copyId: string) {
  return requester.post(`${SERVICE}/close/${copyId}`).then((res: any) => res.data as CopyPositionData)
}
