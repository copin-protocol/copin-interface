import { StaticJsonRpcProvider } from '@ethersproject/providers'

import { getChainMetadata } from './chains'

const getNodeUrl = (chainId: number, rpcUrl?: string) => {
  // Use custom node if available (both for development and production)
  // However on the testnet it wouldn't work, so if on testnet - comment out the REACT_APP_NODE_PRODUCTION from env file
  // if (import.meta.env.VITE_NODE_PRODUCTION) {
  //   return import.meta.env.VITE_NODE_PRODUCTION
  // }
  if (!rpcUrl) {
    const chainInfo = getChainMetadata(chainId)
    rpcUrl = chainInfo.rpcUrl
  }
  return rpcUrl
}

export const getSimpleRpcProvider = (chainId: number) => new StaticJsonRpcProvider(getNodeUrl(chainId))

export default getNodeUrl
