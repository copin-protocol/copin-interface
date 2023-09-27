import { BackTestResultData } from 'entities/backTest'
import { ShareBacktestData } from 'entities/share'
import { ProtocolEnum } from 'utils/config/enums'

import requester from '.'

export async function shareBacktestApi(data: ShareBacktestData) {
  return requester.post(`/share`, data).then((res: any) => res.data?.id as string)
}

export async function getSharedBacktestSettingApi(id: string) {
  return requester.get(`/share/${id}`).then((res: any) => res.data as ShareBacktestData)
}

export async function getSharedBacktestResultApi(id: string, protocol: ProtocolEnum) {
  return requester.get(`/${protocol}/back-testing/share/${id}`).then((res: any) => res.data as BackTestResultData[])
}
