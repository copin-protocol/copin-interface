import { ActionTypeEnum, CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'

import { CopyPositionData } from '../entities/copyTrade'
import requester from './index'

const SERVICE = 'dcp-positions'

export interface SltpData {
  sl: number
  tp: number
}

export interface SubmitActionPayload {
  smartWalletAddress: string
  positionIndex: number
  actionType: ActionTypeEnum
  data: SltpData
  signature: string
}

export interface SubmitActionForCopyPayload {
  actionType: ActionTypeEnum
  data: SltpData
  signature: string
}

export interface SubmitClosePayload {
  smartWalletAddress: string
  positionIndex: number
  acceptablePrice: string
  signature: string
}

export async function submitActionApi({
  exchange,
  payload,
}: {
  exchange: CopyTradePlatformEnum
  payload: SubmitActionPayload
}) {
  return requester.post(`${SERVICE}/action/${exchange}`, payload).then((res: any) => res.data)
}

export async function submitActionForCopyApi({
  copyPositionId,
  payload,
}: {
  copyPositionId: string
  payload: SubmitActionForCopyPayload
}) {
  return requester.post(`${SERVICE}/action-copy/${copyPositionId}`, payload).then((res: any) => res.data)
}

export async function manualCloseDcpPositionApi({
  copyPositionId,
  acceptablePrice,
  signature,
}: {
  copyPositionId: string
  acceptablePrice: string
  signature: string
}) {
  return requester
    .post(`${SERVICE}/close-copy/${copyPositionId}`, {
      acceptablePrice,
      signature,
    })
    .then((res: any) => res.data as CopyPositionData)
}

export async function submitCloseApi({
  exchange,
  payload,
}: {
  exchange: CopyTradePlatformEnum
  payload: SubmitClosePayload
}) {
  return requester.post(`${SERVICE}/close/${exchange}`, payload).then((res: any) => res.data)
}

export async function manualOpenDcpPositionApi({
  copyTradeId,
  positionId,
  acceptablePrice,
  signature,
  protocol = ProtocolEnum.GNS,
  exchange = CopyTradePlatformEnum.GNS_V8,
}: {
  copyTradeId: string
  positionId: string
  acceptablePrice: string
  signature: string
  protocol?: ProtocolEnum
  exchange?: CopyTradePlatformEnum
}) {
  return requester
    .post(`${SERVICE}/open/${exchange}`, {
      copyTradeId,
      positionId,
      acceptablePrice,
      signature,
      protocol,
    })
    .then((res: any) => res.data as CopyPositionData)
}
