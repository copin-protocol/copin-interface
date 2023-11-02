import { JsonRpcProvider } from '@ethersproject/providers'

import { CHAINS } from './chains'

export const rpcProvider = (chainId: number) => new JsonRpcProvider(CHAINS[chainId].rpcUrl)
