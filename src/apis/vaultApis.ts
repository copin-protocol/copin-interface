import { CopyTradeData, RequestCopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { VaultAprData } from 'entities/vault'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { getCopyService } from 'utils/helpers/getCopyService'

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
  const serviceKey = getCopyService({
    protocol: data.protocol ?? DEFAULT_PROTOCOL,
    exchange: data.exchange,
    isInternal,
  })
  return requester.post(`${COPY_SERVICE}/vault`, { ...data, serviceKey }).then((res: any) => res.data as CopyTradeData)
}

export async function updateVaultCopyTradeApi({
  data,
  copyTradeId,
}: {
  data: UpdateCopyTradeData
  copyTradeId: string
}) {
  const serviceKey = getCopyService({ protocol: data.protocol ?? DEFAULT_PROTOCOL, exchange: data.exchange })
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
