import {
  AlertSettingData,
  BotAlertData,
  ChannelAlertRequestData,
  CustomAlertRequestData,
  TraderAlertData,
} from 'entities/alert'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { AlertCustomType, AlertTypeEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { normalizeCustomAlertConfigData, normalizeCustomAlertConfigResponse } from './normalize'
import { GetApiParams } from './types'

const SERVICE = 'bot-alerts'

export async function getBotAlertApi() {
  return requester.get(`${SERVICE}/me`).then((res: any) => res.data as AlertSettingData[])
}

export async function getTraderAlertListApi({
  limit = DEFAULT_LIMIT,
  offset = 0,
  address,
  protocol,
  sortBy,
  sortType,
  keyword,
}: {
  address?: string
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
  keyword?: string
} & GetApiParams) {
  const params: Record<string, any> = {}
  if (!!protocol) params.protocols = protocol
  if (!!address) params.address = address
  if (!!protocol) params.protocol = protocol
  if (!!sortBy) params.sort_by = sortBy
  if (!!sortType) params.sort_type = sortType
  if (!!keyword) params.keyword = keyword
  return requester
    .get(`${SERVICE}/trader`, { params: { limit, offset, ...params } })
    .then((res: any) => res.data as ApiListResponse<TraderAlertData>)
}

export async function postAlertLabelApi({ address, protocol, enableAlert, label }: TraderAlertData) {
  return requester
    .post(`${SERVICE}/trader`, { address, protocol, enableAlert, label })
    .then((res: any) => res.data as ApiListResponse<TraderAlertData>)
}

export async function putAlertLabelApi({ id, label }: TraderAlertData) {
  return requester
    .put(`${SERVICE}/trader/${id}`, { label })
    .then((res: any) => res.data as ApiListResponse<TraderAlertData>)
}

export async function linkGroupToBotAlertApi({
  type,
  chatId,
  name,
  customAlertId,
}: {
  type: AlertTypeEnum
  chatId: string
  name?: string
  customAlertId?: string
}) {
  return requester.post(`${SERVICE}`, { type, chatId, name, customAlertId }).then((res: any) => res.data)
}

export async function linkToBotAlertApi(state: string) {
  return requester.post(`${SERVICE}`, { state }).then((res: any) => res.data)
}

export async function linkWebhookToBotAlertApi({
  type,
  webhookUrl,
  name,
  customAlertId,
}: {
  type: AlertTypeEnum
  webhookUrl: string
  name?: string
  customAlertId?: string
}) {
  return requester.post(`${SERVICE}/webhook`, { type, webhookUrl, name, customAlertId }).then((res: any) => res.data)
}

export async function updateChannelWebhookAlertApi({ id, data }: { id: string; data: ChannelAlertRequestData }) {
  return requester.put(`${SERVICE}/webhook/${id}`, { ...data })
}

export async function deleteChannelWebhookAlertApi(id: string) {
  return requester.delete(`${SERVICE}/webhook/${id}`)
}

export async function bulkUpdateStatusAlertApi({
  type,
  isPause,
  customAlertId,
}: {
  type: AlertTypeEnum
  isPause: boolean
  customAlertId?: string
}) {
  return requester.put(`${SERVICE}/stop`, { type, isPause, customAlertId }).then((res: any) => res.data)
}

export async function updateChannelAlertApi({ id, data }: { id: string; data: ChannelAlertRequestData }) {
  return requester.put(`${SERVICE}/${id}`, { ...data })
}

export async function deleteChannelAlertApi(id: string) {
  return requester.delete(`${SERVICE}/${id}`)
}

export async function createTraderAlertApi({ address, protocol }: { address: string; protocol: ProtocolEnum }) {
  return requester.post(`${SERVICE}/trader`, { address, protocol })
}

export async function deleteTraderAlertApi(alertId: string) {
  return requester.delete(`${SERVICE}/trader/${alertId}`)
}

export async function updateTraderAlertApi(id: string) {
  return requester.put(`${SERVICE}/trader/on-off-alert/${id}`)
}

export async function generateLinkBotAlertApi({
  type,
  customAlertId,
}: {
  type: AlertTypeEnum
  customAlertId?: string
}) {
  return requester.post(`${SERVICE}/state`, { type, customAlertId }).then((res: any) => res.data)
}

export async function checkLinkedBotAlertApi(state?: string) {
  return requester.get(`${SERVICE}/state/isLinked`, { params: { state } }).then((res: any) => res.data as boolean)
}

export async function unlinkToBotAlertApi(telegramAlertSettingId: string) {
  return requester.delete(`${SERVICE}/unlink`, { params: { telegramAlertSettingId } }).then((res: any) => res?.data)
}

export async function getCustomAlertsApi({
  limit,
  offset,
  sortBy,
  sortType,
  name,
  type,
  showAlert,
}: { name?: string; sortBy?: string; sortType?: string; type?: AlertCustomType; showAlert?: boolean } & GetApiParams) {
  const params: Record<string, any> = {}
  if (name) params.name = name
  if (sortBy) params.sort_by = sortBy
  if (sortType) params.sort_type = sortType
  if (type) params.type = type
  if (showAlert) params.showAlert = showAlert
  return requester
    .get(`${SERVICE}/custom`, { params: { limit, offset, ...params } })
    .then((res: any) => normalizeCustomAlertConfigResponse(res.data as ApiListResponse<BotAlertData>))
}

export async function getCustomAlertDetailsByIdApi(id: string) {
  return requester
    .get(`${SERVICE}/custom/${id}`)
    .then((res: any) => normalizeCustomAlertConfigData(res.data as BotAlertData))
}

export async function countCustomAlertApi() {
  return requester.get(`${SERVICE}/custom/count`).then((res: any) => res.data)
}

export async function createCustomAlertApi(data: CustomAlertRequestData) {
  return requester.post(`${SERVICE}/custom`, data).then((res: any) => res.data as BotAlertData)
}

export async function updateCustomAlertApi({ id, data }: { id: string; data: CustomAlertRequestData }) {
  return requester.put(`${SERVICE}/custom/${id}`, data).then((res: any) => res.data as BotAlertData)
}

export async function deleteCustomAlertApi(id: string) {
  return requester.delete(`${SERVICE}/custom/${id}`).then((res: any) => res.data)
}

export async function getCustomTraderGroupByIdApi({
  limit = DEFAULT_LIMIT,
  offset = 0,
  customAlertId,
  address,
  protocol,
  sortBy,
  sortType,
}: {
  customAlertId?: string
  address?: string
  protocol?: ProtocolEnum
  sortBy?: string
  sortType?: SortTypeEnum
} & GetApiParams) {
  const params: Record<string, any> = {}
  if (!!protocol) params.protocols = protocol
  if (!!address) params.address = address
  if (!!protocol) params.protocol = protocol
  if (!!sortBy) params.sort_by = sortBy
  if (!!sortType) params.sort_type = sortType
  return requester
    .get(`${SERVICE}/custom/trader/${customAlertId}`, { params: { limit, offset, ...params } })
    .then((res: any) => res.data as ApiListResponse<TraderAlertData>)
}
