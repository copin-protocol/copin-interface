import {
  CopyTradeBalanceDataResponse,
  CopyTradeData,
  CopyTradePnL,
  MyCopyTradeOverview,
  PreDeleteCopyTradeData,
  RequestCopyTradeData,
  UpdateCopyTradeData,
} from 'entities/copyTrade.d'
import { MyAllCopyTradersData, MyCopyTraderData } from 'entities/trader'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'

import { ApiListResponse } from './api'
import requester from './index'
import { GetCopyTradeSettingsParams } from './types'

const SERVICE = 'copy-trades'

export async function requestCopyTradeApi({ data }: { data: RequestCopyTradeData }) {
  const serviceKey = SERVICE_KEYS[data.protocol ?? ProtocolEnum.GMX]
  return requester.post(`${SERVICE}`, { ...data, serviceKey }).then((res: any) => res.data as CopyTradeData)
}

export async function updateCopyTradeApi({ data, copyTradeId }: { data: UpdateCopyTradeData; copyTradeId: string }) {
  return requester.put(`${SERVICE}/${copyTradeId}`, data).then((res: any) => res.data as CopyTradeData)
}

export async function duplicateCopyTradeApi({ data, copyTradeId }: { data: UpdateCopyTradeData; copyTradeId: string }) {
  const serviceKey = SERVICE_KEYS[data.protocol ?? ProtocolEnum.GMX]
  return requester
    .post(`${SERVICE}/duplicate/${copyTradeId}`, { ...data, serviceKey })
    .then((res: any) => res.data as CopyTradeData)
}
export async function preDeleteCopyTradeApi({
  copyTradeId,
  protocol,
}: {
  copyTradeId: string
  protocol?: ProtocolEnum
}) {
  return requester
    .get(`${SERVICE}/pre-delete/${copyTradeId}`, { params: { protocol } })
    .then((res: any) => res.data as PreDeleteCopyTradeData)
}
export async function deleteCopyTradeApi({ copyTradeId, protocol }: { copyTradeId: string; protocol?: ProtocolEnum }) {
  return requester.delete(`${SERVICE}/${copyTradeId}`, { params: { protocol } })
}

export async function getCopyTradeSettingsApi(params: GetCopyTradeSettingsParams) {
  const newParams: Record<string, any> = { ...params }
  if (params?.accounts?.length) newParams.accounts = params.accounts.join(',')
  return requester
    .get(`${SERVICE}`, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<CopyTradeData>)
}
export async function getCopyTradeSettingsListApi(params: {
  accounts: string[]
  apiKey: string | undefined
  status: CopyTradeStatusEnum | undefined
  protocol?: ProtocolEnum
}) {
  return requester.post(`${SERVICE}/list`, params).then((res: any) => res.data as CopyTradeData[])
}

export async function getCopyTradeDetailsApi({ id }: { id: string }) {
  return requester.get(`${SERVICE}/${id}`).then((res: any) => res.data as CopyTradeData)
}

export async function getCopyTradeBalancesApi(): Promise<CopyTradeBalanceDataResponse> {
  return requester
    .get(`${SERVICE}/statistic/balances/BINGX`)
    .then((res: any) => res.data as CopyTradeBalanceDataResponse)
}

export const getCopyTradePnLApi = ({
  exchange,
  from,
  to,
  uniqueKey,
}: {
  exchange: string
  from: number
  to: number
  uniqueKey?: string | null
}) =>
  requester
    .get(`${SERVICE}/statistic/balance-snapshots`, { params: { exchange, uniqueKey, from, to } })
    .then((res) => res.data?.data as CopyTradePnL[])

export async function getTradersCopyingApi(protocol?: ProtocolEnum): Promise<string[]> {
  return requester
    .get(`${SERVICE}/traders`, {
      params: {
        limit: 1000,
        offset: 0,
        protocol,
      },
    })
    .then((res: any) => res.data?.traders as string[])
}

// exclude deleted traders
export async function getMyCopyTradersApi(params: {
  exchange: CopyTradePlatformEnum
  uniqueKey: string | null
  protocol?: ProtocolEnum
}) {
  return requester.get(`${SERVICE}/traders/list`, { params }).then((res: any) => res.data as MyCopyTraderData[])
}

export async function getAllMyCopyTradersApi(params?: { protocol?: ProtocolEnum }) {
  return requester.get(`${SERVICE}/traders/group`, { params }).then((res: any) => res.data as MyAllCopyTradersData)
}

export async function getMyCopyTradeOverviewApi(params: {
  exchange: CopyTradePlatformEnum
  uniqueKey: string | null
  protocol?: ProtocolEnum
}) {
  return requester.get(`${SERVICE}/overview`, { params }).then((res: any) => res.data as MyCopyTradeOverview)
}
