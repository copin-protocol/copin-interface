import { CopyTradeData, RequestCopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { VaultAprData } from 'entities/vault'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { INTERNAL_SERVICE_KEYS, SERVICE_KEYS } from 'utils/config/keys'

import { ApiListResponse } from './api'
import requester from './index'
import { GetCopyTradeSettingsParams } from './types'

const VAULT_SERVICE = 'vault'
const COPY_SERVICE = 'copy-trades'
const WALLET_SERVICE = 'copy-wallets'

export async function getVaultDetailsAprApi() {
  return requester.get(`${VAULT_SERVICE}/past-month-return`).then((res: any) => res.data as VaultAprData)
}

export async function getAllVaultCopyWalletsApi(exchange?: CopyTradePlatformEnum) {
  return requester
    .get(`${WALLET_SERVICE}/${VAULT_SERVICE}/list`, { params: { exchange } })
    .then((res: any) => res.data as CopyWalletData[])
}

export async function requestVaultCopyTradeApi({
  data,
  isInternal,
}: {
  data: RequestCopyTradeData
  isInternal?: boolean
}) {
  const service = isInternal ? INTERNAL_SERVICE_KEYS : SERVICE_KEYS
  const serviceKey =
    data.exchange == CopyTradePlatformEnum.GNS_V8 || data.exchange == CopyTradePlatformEnum.SYNTHETIX_V2
      ? 'MIRROR_SIGNAL'
      : service[data.protocol ?? ProtocolEnum.GMX]
  return requester.post(`${COPY_SERVICE}/vault`, { ...data, serviceKey }).then((res: any) => res.data as CopyTradeData)
}

export async function updateVaultCopyTradeApi({
  data,
  copyTradeId,
}: {
  data: UpdateCopyTradeData
  copyTradeId: string
}) {
  const serviceKey = SERVICE_KEYS[data.protocol ?? ProtocolEnum.GMX]
  return requester
    .put(`${COPY_SERVICE}/${copyTradeId}`, { ...data, serviceKey })
    .then((res: any) => res.data as CopyTradeData)
}

export async function getVaultCopyTradeSettingsListApi(params?: {
  copyWalletId: string | undefined
  status: CopyTradeStatusEnum | undefined
  protocols?: ProtocolEnum[]
}) {
  return requester
    .post(`${COPY_SERVICE}/list`, { ...params, type: CopyTradeTypeEnum.COPIN_VAULT })
    .then((res: any) => res.data as CopyTradeData[])
}

export async function getVaultCopyTradeSettingsApi(params: GetCopyTradeSettingsParams) {
  const newParams: Record<string, any> = { ...params, type: CopyTradeTypeEnum.COPIN_VAULT }
  if (params?.accounts?.length) newParams.accounts = params.accounts.join(',')
  return requester
    .get(`${COPY_SERVICE}`, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<CopyTradeData>)
}
