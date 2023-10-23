import { CopyTradeConfigData, RequestCopyTradeConfigData } from 'entities/copyTradeConfig'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetCopyTradeSettingsParams } from './types'

const SERVICE = 'copy-trade-configs'

export async function requestCopyTradeConfigsApi({ data }: { data: RequestCopyTradeConfigData }) {
  return requester.post(`${SERVICE}`, data).then((res: any) => res.data as CopyTradeConfigData)
}

export async function updateCopyTradeConfigApi({
  data,
  configId,
}: {
  data: RequestCopyTradeConfigData
  configId: string
}) {
  return requester.put(`${SERVICE}/${configId}`, data).then((res: any) => res.data as CopyTradeConfigData)
}

export async function deleteCopyTradeConfigApi({ configId, protocol }: { configId: string; protocol?: ProtocolEnum }) {
  return requester.delete(`${SERVICE}/${configId}`, { params: { protocol } })
}

export async function getCopyTradeConfigsApi(params: GetCopyTradeSettingsParams) {
  const newParams: Record<string, any> = { ...params }
  if (params?.accounts?.length) newParams.accounts = params.accounts.join(',')
  return requester
    .get(`${SERVICE}/page`, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<CopyTradeConfigData>)
}

export async function getConfigDetailsByIdApi({ id }: { id: string }) {
  return requester.get(`${SERVICE}/${id}`).then((res: any) => res.data as CopyTradeConfigData)
}

export async function getConfigDetailsByKeyApi({
  exchange,
  copyWalletId,
}: {
  exchange: CopyTradePlatformEnum
  copyWalletId: string
}) {
  return requester.get(`${SERVICE}/${exchange}/${copyWalletId}`).then((res: any) => res.data as CopyTradeConfigData)
}
