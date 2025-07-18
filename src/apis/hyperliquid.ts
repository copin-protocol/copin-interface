import axios from 'axios'

import {
  HlAccountData,
  HlAccountSpotRawData,
  HlAccountStakingData,
  HlAccountVaultData,
  HlFeesRawData,
  HlHistoricalOrderRawData,
  HlNonFundingLedgerData,
  HlOrderFillRawData,
  HlOrderRawData,
  HlPortfolioRawData,
  HlPriceData,
  HlSpotMetaData,
  HlSubAccountData,
  HlTwapOrderRawData,
} from 'entities/hyperliquid'
import { HYPERLIQUID_BUILDER_CODE } from 'utils/config/constants'

const HYPERLIQUID_API = 'https://hyper.copin.io'

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
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'clearinghouseState',
      user,
    })
    .then((res: any) => res.data as HlAccountData)
}

export async function getHlAccountSpotHolding({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'spotClearinghouseState',
      user,
    })
    .then((res: any) => res.data as HlAccountSpotRawData)
}

export async function getHlSubAccounts({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'subAccounts',
      user,
    })
    .then((res: any) => res.data as HlSubAccountData[])
}

export async function getHlOpenOrders({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'frontendOpenOrders',
      user,
    })
    .then((res: any) => res.data as HlOrderRawData[])
}

export async function getHlOrderFilled({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'userFills',
      user,
      aggregateByTime: true,
    })
    .then((res: any) => res.data as HlOrderFillRawData[])
}

export async function getHlHistoricalOrders({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'historicalOrders',
      user,
    })
    .then((res: any) => res.data as HlHistoricalOrderRawData[])
}

export async function getHlTwapOrderFilled({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'userTwapSliceFills',
      user,
    })
    .then((res: any) => res.data as HlTwapOrderRawData[])
}

export async function getHlPortfolio({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'portfolio',
      user,
    })
    .then((res: any) => res.data as HlPortfolioRawData)
}

export async function getHlAccountFees({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'userFees',
      user,
    })
    .then((res: any) => res.data as HlFeesRawData)
}

export async function getHlAccountStaking({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'delegatorSummary',
      user,
    })
    .then((res: any) => res.data as HlAccountStakingData)
}

export async function getHlAccountVault({ user }: { user: string }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'userVaultEquities',
      user,
    })
    .then((res: any) => res.data as HlAccountVaultData[])
}

export async function getHlNonFundingLedger({ user, startTime }: { user: string; startTime: number }) {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'userNonFundingLedgerUpdates',
      user,
      startTime,
    })
    .then((res: any) => res.data as HlNonFundingLedgerData[])
}

export async function getHlSpotMeta() {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'spotMeta',
    })
    .then((res: any) => res.data as HlSpotMetaData)
}

export async function getHlLatestPrices() {
  return axios
    .post(`${HYPERLIQUID_API}/info`, {
      type: 'allMids',
    })
    .then((res: any) => res.data as HlPriceData)
}
