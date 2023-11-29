import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'

export type ConnectorName = 'injected' | 'walletconnect'

export type Status = 'connected' | 'disconnected' | 'connecting' | 'error'

export type RpcData = {
  [key: number]: string
}

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}
export interface Chain {
  id: string
  token: string
  label: string
  rpcUrl: string
  icon: string
  blockExplorerUrl: string
  secondaryTokens?: {
    address: string
    icon?: string
  }[]
}
type TokenSymbol = string

export type Account = {
  address: string
  ens: {
    name?: string
    avatar?: string
    contentHash?: string
    getText?: (key: string) => Promise<string | undefined>
  }
  uns: {
    name?: string
  }
  balance: Record<TokenSymbol, string>
  secondaryTokens: {
    name: string
    balance: string
    icon?: string
  }[]
}

export interface Balances {
  $NATIVE: number | undefined
  [key: string]: number | undefined
}
export interface ContractInfo {
  address: string
  abi: any
}

export interface ConfirmationInfo {
  txHash: string
  txLink: string
  status: number | undefined
  confirmations: number
}

export interface MultiCall {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

export interface SignTypeData {
  domain: TypedDataDomain
  types: Record<string, Array<TypedDataField>>
  value: Record<string, any>
}

export interface PythLatestPrice {
  id: string
  price: PythPrice
  ema_price: PythEmaPrice
}

export interface PythPrice {
  priceFeedId: string
  priceStr: string
  price: number
  expo: number
  publishTime: number
}

export interface PythEmaPrice {
  conf: string
  expo: number
  price: string
  publish_time: number
}
