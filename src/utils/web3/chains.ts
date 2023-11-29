import { NETWORK } from 'utils/config/constants'
import { Chain, NativeCurrency } from 'utils/web3/types'

export const ETHEREUM_MAINNET = 1
export const GOERLI = 5
export const OPTIMISM_MAINNET = 10
export const OPTIMISM_GOERLI = 420
export const ARBITRUM_MAINNET = 42161
export const ARBITRUM_GOERLI = 421613
export const ZKSYNC_ERA_MAINNET = 324
export const DEFAULT_CHAIN_ID = NETWORK === 'devnet' ? OPTIMISM_GOERLI : OPTIMISM_MAINNET
export const SUBSCRIPTION_CHAIN_ID = NETWORK === 'devnet' ? GOERLI : OPTIMISM_MAINNET

export const SUPPORTED_CHAIN_IDS: number[] =
  NETWORK === 'devnet'
    ? [GOERLI, OPTIMISM_GOERLI, ARBITRUM_GOERLI]
    : [ETHEREUM_MAINNET, ARBITRUM_MAINNET, OPTIMISM_MAINNET]

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
}

const SECONDARY_TOKENS: {
  [key: number]: {
    address: string
    icon?: string
  }[]
} = {
  [OPTIMISM_GOERLI]: [
    {
      address: '0xeBaEAAD9236615542844adC5c149F86C36aD1136',
    },
  ],
}

const CHAINS: { [key: number]: Chain } = {
  [ETHEREUM_MAINNET]: {
    id: `0x${ETHEREUM_MAINNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Ethereum',
    icon: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/72fn_owjChR9dmCH-kREoY8pVeXW_GEM',
    blockExplorerUrl: 'https://etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[ETHEREUM_MAINNET],
  },
  [OPTIMISM_MAINNET]: {
    id: `0x${OPTIMISM_MAINNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Optimism',
    icon: 'OP',
    rpcUrl: 'https://optimism.publicnode.com',
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[OPTIMISM_MAINNET],
  },
  [ARBITRUM_MAINNET]: {
    id: `0x${ARBITRUM_MAINNET.toString(16)}`,
    label: 'Arbitrum',
    icon: 'ARB',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://arbitrum-one.publicnode.com',
    blockExplorerUrl: 'https://arbiscan.io',
    secondaryTokens: SECONDARY_TOKENS[ARBITRUM_MAINNET],
  },
  [GOERLI]: {
    id: `0x${GOERLI.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Goerli',
    icon: 'ETH',
    rpcUrl: 'https://ethereum-goerli.publicnode.com',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[GOERLI],
  },
  [OPTIMISM_GOERLI]: {
    id: `0x${OPTIMISM_GOERLI.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Optimism Goerli',
    icon: 'OP',
    rpcUrl: 'https://optimism-goerli.publicnode.com',
    blockExplorerUrl: 'https://goerli-optimism.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[OPTIMISM_GOERLI],
  },
  [ARBITRUM_GOERLI]: {
    id: `0x${ARBITRUM_GOERLI.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Arbitrum Goerli',
    icon: 'ARB',
    rpcUrl: 'https://arbitrum-goerli.publicnode.com',
    blockExplorerUrl: 'https://testnet.arbiscan.io',
    secondaryTokens: SECONDARY_TOKENS[ARBITRUM_GOERLI],
  },
}

const chains = SUPPORTED_CHAIN_IDS.map((id) => CHAINS[id])

const getChainMetadata = (chainId: number, rpcUrls?: string[]) => {
  const chain = CHAINS[chainId]
  if (!chain) throw Error('Unknown chainId')
  if (rpcUrls) return { ...chain, rpcUrls }
  return chain
}

export { NATIVE_CURRENCIES, CHAINS, chains, getChainMetadata }
