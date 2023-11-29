import { BotAlertData, TraderAlertData } from 'entities/alert'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams } from './types'

const SERVICE = 'bot-alerts'

export async function getBotAlertApi() {
  return requester.get(`${SERVICE}/me`).then((res: any) => res.data as BotAlertData)
}

export async function getTraderAlertListApi({
  limit = DEFAULT_LIMIT,
  offset = 0,
  address,
  protocol,
}: { address?: string; protocol?: ProtocolEnum } & GetApiParams) {
  return requester
    .get(`${SERVICE}/trader`, { params: { limit, offset, address, protocol } })
    .then((res: any) => res.data as ApiListResponse<TraderAlertData>)
}

export async function linkToBotAlertApi(state: string) {
  return requester.post(`${SERVICE}`, { state }).then((res: any) => res.data)
}

export async function createTraderAlertApi({ address, protocol }: { address: string; protocol: ProtocolEnum }) {
  return requester.post(`${SERVICE}/trader`, { address, protocol })
}

export async function deleteTraderAlertApi(alertId: string) {
  return requester.delete(`${SERVICE}/trader/${alertId}`)
}

export async function generateLinkBotAlertApi() {
  return requester.post(`${SERVICE}/state`).then((res: any) => res.data)
}
