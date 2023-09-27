import { Chain, NativeCurrency } from 'utils/web3/types'

export const ARBITRUM_MAINNET = 42161
export const AVALANCHE_MAINNET = 43114
export const OPTIMISM_MAINNET = 10
export const ZKSYNC_ERA_MAINNET = 324
export const ETHEREUM_MAINNET = 1
export const BSC_MAINNET = 56
export const POLYGON_MAINNET = 137
export const DEFAULT_CHAIN_ID = OPTIMISM_MAINNET

export const SUPPORTED_CHAIN_IDS: number[] = [
  ARBITRUM_MAINNET,
  AVALANCHE_MAINNET,
  OPTIMISM_MAINNET,
  ETHEREUM_MAINNET,
  BSC_MAINNET,
  POLYGON_MAINNET,
  // ZKSYNC_ERA_MAINNET,
]

const NATIVE_CURRENCIES: { [key: string]: NativeCurrency } = {
  ETH: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  ARB: {
    name: 'ARB',
    symbol: 'ARB',
    decimals: 18,
  },
  OP: {
    name: 'OP',
    symbol: 'OP',
    decimals: 18,
  },
  BNB: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  MATIC: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  AVAX: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
}

const CHAINS: { [key: number]: Chain } = {
  [ARBITRUM_MAINNET]: {
    chainId: `0x${ARBITRUM_MAINNET.toString(16)}`,
    chainName: 'Arbitrum',
    nativeCurrency: NATIVE_CURRENCIES.ARB,
    rpcUrls: ['https://arbitrum-one.publicnode.com'],
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  [AVALANCHE_MAINNET]: {
    chainId: `0x${AVALANCHE_MAINNET.toString(16)}`,
    chainName: 'Avalanche C-Chain',
    nativeCurrency: NATIVE_CURRENCIES.AVAX,
    rpcUrls: ['https://rpc.ankr.com/avalanche'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
  [OPTIMISM_MAINNET]: {
    chainId: `0x${OPTIMISM_MAINNET.toString(16)}`,
    chainName: 'Optimism',
    nativeCurrency: NATIVE_CURRENCIES.OP,
    rpcUrls: ['https://optimism.publicnode.com'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
  },
  [ETHEREUM_MAINNET]: {
    chainId: `0x${ETHEREUM_MAINNET.toString(16)}`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: NATIVE_CURRENCIES.ETH,
    rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/72fn_owjChR9dmCH-kREoY8pVeXW_GEM/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [POLYGON_MAINNET]: {
    chainId: `0x${POLYGON_MAINNET.toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: NATIVE_CURRENCIES.MATIC,
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [BSC_MAINNET]: {
    chainId: `0x${BSC_MAINNET.toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: NATIVE_CURRENCIES.BNB,
    rpcUrls: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
    ],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  // [ZKSYNC_ERA_MAINNET]: {
  //   chainId: `0x${ZKSYNC_ERA_MAINNET.toString(16)}`,
  //   chainName: 'zkSync Era Mainnet',
  //   nativeCurrency: NATIVE_CURRENCIES.ETH,
  //   rpcUrls: ['https://mainnet.era.zksync.io'],
  //   blockExplorerUrls: ['https://explorer.zksync.io'],
  // },
}

const getChainMetadata = (chainId: number, rpcUrls?: string[]) => {
  const chain = CHAINS[chainId]
  if (!chain) throw Error('Unknown chainId')
  if (rpcUrls) return { ...chain, rpcUrls }
  return chain
}

export { NATIVE_CURRENCIES, CHAINS, getChainMetadata }
