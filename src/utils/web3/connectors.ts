import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { SUPPORTED_CHAIN_IDS } from 'utils/web3/chains'
import getNodeUrl from 'utils/web3/getRpcUrl'

const CONNECTOR_STORAGE_KEY = 'copin-connector'

const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: SUPPORTED_CHAIN_IDS.map((chainId) => ({ rpc: getNodeUrl(chainId) ?? '', chainId })).reduce((prev, cur) => {
    prev[cur.chainId] = cur.rpc
    return prev
  }, {} as any),
  qrcode: true,
})

const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

const connectors = { walletconnect, injected }

type ConnectorsKey = keyof typeof connectors
export type Connectors = (typeof connectors)[ConnectorsKey]

export const getStoredConnector = (): 'injected' | 'walletconnect' | null => {
  const connectorName = localStorage.getItem(CONNECTOR_STORAGE_KEY)
  if (connectorName !== 'injected' && connectorName !== 'walletconnect') return null
  return connectorName
}

export const storeConnector = (connectorName: string) => {
  localStorage.setItem(CONNECTOR_STORAGE_KEY, connectorName)
}

export const clearConnector = () => {
  localStorage.removeItem(CONNECTOR_STORAGE_KEY)
}

export default { walletconnect, injected }
