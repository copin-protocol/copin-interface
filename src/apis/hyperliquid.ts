import axios from 'axios'

import { HlAccountData, HlOrderFillRawData, HlOrderRawData } from 'entities/hyperliquid'
import { HYPERLIQUID_BUILDER_CODE } from 'utils/config/constants'

export async function checkUserApproveBuilderFees(user: string) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'maxBuilderFee',
      builder: HYPERLIQUID_BUILDER_CODE,
      user,
    })
    .then((res: any) => res.data)
}

export async function getHlAccountInfo({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'clearinghouseState',
      user,
    })
    .then((res: any) => res.data as HlAccountData)
}

export async function getHlOpenOrders({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'frontendOpenOrders',
      user,
    })
    .then((res: any) => res.data as HlOrderRawData[])
}

export async function getHlOrderFilled({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'userFills',
      user,
      aggregateByTime: true,
    })
    .then((res: any) => res.data as HlOrderFillRawData[])
}
