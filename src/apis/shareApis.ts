import { BackTestResultData } from 'entities/backTest'
import { ImageData } from 'entities/image'
import { GetSharedPositionData, ShareBacktestData } from 'entities/share'
import { PositionData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'

import requester from '.'

export async function shareBacktestApi(data: ShareBacktestData) {
  return requester.post(`/share`, data).then((res: any) => res.data?.id as string)
}

export async function getSharedBacktestSettingApi(id: string) {
  return requester.get(`/share/${id}`).then((res: any) => res.data as ShareBacktestData)
}

export async function getSharedPositionSettingApi(id: string) {
  return requester.get(`/share/${id}`).then((res: any) => res.data as GetSharedPositionData)
}

export async function getSharedBacktestResultApi(id: string, protocol: ProtocolEnum) {
  return requester.get(`/${protocol}/back-testing/share/${id}`).then((res: any) => res.data as BackTestResultData[])
}
export async function sharePositionApi({ position, imageBlob }: { position: PositionData; imageBlob: Blob }) {
  const formData = new FormData()
  let endPoint = ''
  let params: Record<string, any> = {}
  endPoint = `/storage/share-position/${position.protocol}/${position.txHashes?.[0] ?? position.id}`
  formData.append(
    'image',
    imageBlob,
    `share_${position.protocol}_${position.txHashes?.[0] ?? position.id}_${position.account}_${position.logId}.png`
  )
  params = {
    account: position.account,
    logId: position.logId,
  }

  return requester
    .post(endPoint, formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res: any) => res.data as ImageData)
}
