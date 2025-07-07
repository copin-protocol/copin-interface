import axios from 'axios'

import {
  HlAccountData, HlAccountSpotRawData,
  HlNonFundingLedgerData,
  HlOrderFillRawData,
  HlOrderRawData,
  HlPortfolioRawData, HlPriceData, HlSpotMetaData,
  HlTwapOrderRawData
} from 'entities/hyperliquid'
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

export async function getHlAccountSpotHolding({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'spotClearinghouseState',
      user,
    })
    .then((res: any) => res.data as HlAccountSpotRawData)
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

export async function getHlTwapOrderFilled({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'userTwapSliceFills',
      user,
    })
    .then((res: any) => res.data as HlTwapOrderRawData[])
}

export async function getHlPortfolio({ user }: { user: string }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'portfolio',
      user,
    })
    .then((res: any) => res.data as HlPortfolioRawData)
}

export async function getHlNonFundingLedger({ user, startTime }: { user: string; startTime: number }) {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'userNonFundingLedgerUpdates',
      user,
      startTime,
    })
    .then((res: any) => res.data as HlNonFundingLedgerData[])
}

export async function getHlSpotMeta() {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'spotMeta',
    })
    .then((res: any) => res.data as HlSpotMetaData)
}

export async function getHlLatestPrices() {
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'allMids',
    })
    .then((res: any) => res.data as HlPriceData)
}
