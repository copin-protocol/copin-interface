import { CopyWalletData, RequestCopyWalletData } from 'entities/copyWallet'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import requester from './index'

const SERVICE = 'copy-wallets'

export async function requestCopyWalletApi(data: RequestCopyWalletData) {
  return requester.post(`${SERVICE}`, data).then((res: any) => res.data as CopyWalletData)
}

export async function updateCopyWalletApi({
  data,
  copyWalletId,
}: {
  data: RequestCopyWalletData
  copyWalletId: string
}) {
  return requester.put(`${SERVICE}/${copyWalletId}`, data).then((res: any) => res.data as CopyWalletData)
}

export async function deleteCopyWalletApi({ copyWalletId }: { copyWalletId: string }) {
  return requester.delete(`${SERVICE}/${copyWalletId}`)
}

export async function getAllCopyWalletsApi(exchange?: CopyTradePlatformEnum) {
  return requester.get(`${SERVICE}/list`, { params: { exchange } }).then((res: any) => res.data as CopyWalletData[])
}

export async function getCopyWalletDetailsApi({ id }: { id: string }) {
  return requester.get(`${SERVICE}/${id}`).then((res: any) => res.data as CopyWalletData)
}

export async function getEmbeddedWalletsApi() {
  return requester.get(`${SERVICE}/hyperliquid-embedded/list`).then((res: any) => res.data as CopyWalletData[])
}

export async function checkEmbeddedWalletApi() {
  return requester.post(`wallets/embedded`).then((res) => res.data as { address: string })
}
