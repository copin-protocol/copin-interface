import { BackTestResultData } from 'entities/backTest'
import { GetSharedPositionData, ShareBacktestData, SharePositionData } from 'entities/share'
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
  endPoint = `/share/position/closed/${position.protocol}`
  formData.append('image', imageBlob, `share_${position.protocol}_${position.id}.png`)
  params = {
    positionId: position.id,
  }

  return requester
    .post(endPoint, formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res: any) => res.data as SharePositionData)
}
