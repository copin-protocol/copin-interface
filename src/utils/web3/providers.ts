import { JsonRpcProvider } from '@ethersproject/providers'

import { CHAINS, DEFAULT_CHAIN_ID } from './chains'

export const rpcProvider = (chainId: number | string) => new JsonRpcProvider(CHAINS[chainId].rpcUrl)

export const defaultRpcProvider = rpcProvider(DEFAULT_CHAIN_ID)
