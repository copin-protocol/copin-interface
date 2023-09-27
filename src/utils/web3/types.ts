import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'

export type ConnectorName = 'injected' | 'walletconnect'

export type Status = 'connected' | 'disconnected' | 'connecting' | 'error'

export type RpcData = {
  [key: number]: string
}

export type ConnectorInit = () => Promise<Connector>

export type Connector = {
  // Using `params: any` rather than `params: { chainId: number; [key: string]: any }`:
  // TS 3.9 doesn’t seem to accept `[key: string]: any` as valid to add extra
  // parameters, when using `class implements Connector`. It also rejects any
  // extra parameters added to `{}` or `object` in this case.
  web3ReactConnector: (params: any) => AbstractConnector
  handleActivationError?: (error: Error) => Error | null
}

export interface Wallet {
  account: string | null | undefined
  connect: (connectorName: ConnectorName) => Promise<string | undefined | null>
  disconnect: () => void
  signMessage: (message: string) => void
  connector: string | null
  error: Error | null
  status: Status
  openModal: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  isConnected: boolean
  providerInfo: WalletInfo | undefined
}

export interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}
export interface Chain {
  chainId: string
  chainName: string
  nativeCurrency: NativeCurrency
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export interface WalletInfo {
  connectorName: ConnectorName
  name: string
  iconURL: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export interface ActiveWeb3React {
  connector?: AbstractConnector
  account?: null | string
  active: boolean
  error?: Error
  library: any
  chainId: number
  chainInfo: Chain
  activate: (
    connector: AbstractConnector,
    onError?: ((error: Error) => void) | undefined,
    throwErrors?: boolean | undefined
  ) => Promise<any>
  setError: (error: Error) => void
  deactivate: () => void
  switchChain: (chainId: number) => Promise<boolean>
  simpleRpcProvider: StaticJsonRpcProvider
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
