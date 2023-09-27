import { JsonRpcProvider } from '@ethersproject/providers'

import METAMASK_ICON_URL from 'assets/images/metamask.png'
import WALLETCONNECT_ICON_URL from 'assets/images/walletconnect.png'
import { WalletInfo } from 'utils/web3/types'

import { CHAINS } from './chains'

declare global {
  interface Window {
    ethereum: any
    gtag: any
  }
}

function isElectron() {
  // See https://github.com/electron/electron/issues/2288
  return (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  )
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connectorName: 'injected',
    name: 'Metamask',
    iconURL: METAMASK_ICON_URL,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connectorName: 'walletconnect',
    name: 'Wallet Connect',
    iconURL: WALLETCONNECT_ICON_URL,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
}

function getWalletProvider(providerId: string): WalletInfo | undefined {
  return SUPPORTED_WALLETS[providerId]
}

function identifyWalletProvider(provider: any) {
  if (provider && isElectron()) {
    return 'frame'
  }
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

function getWalletProviderFromConnector(id: string) {
  if (id === 'injected') {
    return getWalletProvider(identifyWalletProvider(window.ethereum)) || getWalletProvider('unknown')
  }
  return getWalletProvider(id) || getWalletProvider('unknown')
}

export const rpcProvider = (chainId: number) => new JsonRpcProvider(CHAINS[chainId].rpcUrls[0])

export { getWalletProvider, identifyWalletProvider, getWalletProviderFromConnector }
