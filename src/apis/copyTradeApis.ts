import {
  CopyTradeBalanceDataResponse,
  CopyTradeData,
  CopyTradePnL,
  MyCopyTradeOverview,
  PreDeleteCopyTradeData,
  RequestCopyTradeData,
  TraderCopyCountData,
  UpdateCopyTradeData,
} from 'entities/copyTrade.d'
import { MyAllCopyTradersData, MyCopyTraderData } from 'entities/trader'
import { MAX_LIMIT } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { INTERNAL_SERVICE_KEYS, SERVICE_KEYS } from 'utils/config/keys'

import { ApiListResponse } from './api'
import requester from './index'
import { GetCopyTradeSettingsParams } from './types'

const SERVICE = 'copy-trades'

export async function requestCopyTradeApi({ data, isInternal }: { data: RequestCopyTradeData; isInternal?: boolean }) {
  const service = isInternal ? INTERNAL_SERVICE_KEYS : SERVICE_KEYS
  const serviceKey =
    data.exchange == CopyTradePlatformEnum.GNS_V8 || data.exchange == CopyTradePlatformEnum.SYNTHETIX_V2
      ? 'MIRROR_SIGNAL'
      : service[data.protocol ?? ProtocolEnum.GMX]
  return requester.post(`${SERVICE}`, { ...data, serviceKey }).then((res: any) => res.data as CopyTradeData)
}

export async function updateCopyTradeApi({ data, copyTradeId }: { data: UpdateCopyTradeData; copyTradeId: string }) {
  return requester.put(`${SERVICE}/${copyTradeId}`, data).then((res: any) => res.data as CopyTradeData)
}

export async function duplicateCopyTradeApi({
  data,
  copyTradeId,
  isInternal,
}: {
  data: UpdateCopyTradeData
  copyTradeId: string
  isInternal?: boolean
}) {
  const service = isInternal ? INTERNAL_SERVICE_KEYS : SERVICE_KEYS
  const serviceKey =
    data.exchange == CopyTradePlatformEnum.GNS_V8 || data.exchange == CopyTradePlatformEnum.SYNTHETIX_V2
      ? 'MIRROR_SIGNAL'
      : service[data.protocol ?? ProtocolEnum.GMX]
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
export async function getCopyTradeSettingsListApi(params?: {
  accounts: string[]
  copyWalletId: string | undefined
  status: CopyTradeStatusEnum | undefined
  protocols?: ProtocolEnum[]
}) {
  return requester.post(`${SERVICE}/list`, params).then((res: any) => res.data as CopyTradeData[])
}

export async function getCopyTradeDetailsApi({ id }: { id: string }) {
  return requester.get(`${SERVICE}/${id}`).then((res: any) => res.data as CopyTradeData)
}

export const getCopyTradePnLApi = ({
  exchange,
  from,
  to,
  copyWalletId,
}: {
  exchange: string
  from: number
  to: number
  copyWalletId: string | undefined
}) =>
  requester
    .get(`${SERVICE}/statistic/balance-snapshots`, { params: { exchange, from, to, uniqueKey: copyWalletId } })
    .then((res) => res.data?.data as CopyTradePnL[])

export async function getTradersCopyingApi(protocol?: ProtocolEnum): Promise<string[]> {
  return requester
    .get(`${SERVICE}/traders`, {
      params: {
        limit: MAX_LIMIT,
        offset: 0,
        protocol,
      },
    })
    .then((res: any) => res.data?.traders as string[])
}

// exclude deleted traders
export async function getMyCopyTradersApi(params: {
  exchange: CopyTradePlatformEnum
  copyWalletId?: string
  protocol?: ProtocolEnum
}) {
  return requester.get(`${SERVICE}/traders/list`, { params }).then((res: any) => res.data as MyCopyTraderData[])
}

export async function getAllMyCopyTradersApi(params?: {
  protocol?: ProtocolEnum
  copyWalletIds: string[] | undefined
}) {
  return requester.get(`${SERVICE}/traders/group`, { params }).then((res: any) => res.data as MyAllCopyTradersData)
}

export async function getMyCopyTradeOverviewApi(params: {
  exchange: CopyTradePlatformEnum
  copyWalletId: string | undefined
  protocol?: ProtocolEnum
}) {
  return requester.get(`${SERVICE}/overview`, { params }).then((res: any) => res.data as MyCopyTradeOverview)
}

export async function getTraderCopyCount(params: { protocol: ProtocolEnum; accounts: string[] }) {
  return requester.get(`/public/${SERVICE}/count`, { params }).then((res: any) => res.data as TraderCopyCountData[])
}

export async function getTraderVolumeCopy(params?: {
  exchange?: CopyTradePlatformEnum
  protocol?: ProtocolEnum
  account?: string
}) {
  return requester
    .get(`${SERVICE}/copy-trade-volume`, { params })
    .then((res: any) => res.data as { account: string; protocol: ProtocolEnum; totalVolume: number }[])
}
