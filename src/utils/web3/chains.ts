import { NETWORK } from 'utils/config/constants'
import { Chain, NativeCurrency } from 'utils/web3/types'

export const ETHEREUM_MAINNET = 1
export const GOERLI = 5
export const SEPOLIA = 11155111
export const OPTIMISM_MAINNET = 10
export const OPTIMISM_GOERLI = 420
export const OPTIMISM_SEPOLIA = 11155420
export const BLAST_SEPOLIA = 168587773
export const BLAST_MAINNET = 81457
export const ARBITRUM_MAINNET = 42161
export const ARBITRUM_GOERLI = 421613
export const ZKSYNC_ERA_MAINNET = 324
export const BNB_MAINNET = 56
export const AVALANCHE_MAINNET = 43114
export const BASE_MAINNET = 8453
export const POLYGON_MAINNET = 137
export const MANTA_MAINNET = 169
export const MANTLE_MAINNET = 5000
export const LINEA_MAINNET = 59144
export const FANTOM_MAINNET = 250
export const MODE_MAINNET = 34443
export const DEFAULT_CHAIN_ID = NETWORK === 'devnet' ? OPTIMISM_SEPOLIA : OPTIMISM_MAINNET
export const SUBSCRIPTION_CHAIN_ID = NETWORK === 'devnet' ? OPTIMISM_SEPOLIA : OPTIMISM_MAINNET

export const SUPPORTED_CHAIN_IDS: number[] = [
  GOERLI,
  SEPOLIA,
  OPTIMISM_GOERLI,
  OPTIMISM_SEPOLIA,
  BLAST_SEPOLIA,
  ARBITRUM_GOERLI,
  ETHEREUM_MAINNET,
  ARBITRUM_MAINNET,
  OPTIMISM_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  AVALANCHE_MAINNET,
  BASE_MAINNET,
  POLYGON_MAINNET,
  FANTOM_MAINNET,
  LINEA_MAINNET,
  MODE_MAINNET,
  // ZKSYNC_ERA_MAINNET,
  // MANTA_MAINNET,
  // MANTLE_MAINNET,
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
  AVAX: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  MATIC: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  MNT: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  FTM: {
    name: 'FTM',
    symbol: 'FTM',
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
  [OPTIMISM_SEPOLIA]: [
    {
      address: '0xD7D674d80e79CF3A3b67D6a510AC1B0493dF47cF',
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
  [SEPOLIA]: {
    id: `0x${SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Sepolia',
    icon: 'ETH',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[SEPOLIA],
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
  [OPTIMISM_SEPOLIA]: {
    id: `0x${OPTIMISM_SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Optimism Sepolia',
    icon: 'OP',
    rpcUrl: 'https://optimism-sepolia.publicnode.com',
    blockExplorerUrl: 'https://sepolia-optimism.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[OPTIMISM_SEPOLIA],
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
  [BNB_MAINNET]: {
    id: `0x${BNB_MAINNET.toString(16)}`,
    label: 'BNB Chain',
    icon: 'BNB',
    token: NATIVE_CURRENCIES.BNB.symbol,
    rpcUrl: 'https://bsc-rpc.publicnode.com',
    blockExplorerUrl: 'https://bscsan.com',
    secondaryTokens: SECONDARY_TOKENS[BNB_MAINNET],
  },
  [BNB_MAINNET]: {
    id: `0x${BNB_MAINNET.toString(16)}`,
    label: 'BNB Chain',
    icon: 'BNB',
    token: NATIVE_CURRENCIES.BNB.symbol,
    rpcUrl: 'https://bsc-rpc.publicnode.com',
    blockExplorerUrl: 'https://bscsan.com',
    secondaryTokens: SECONDARY_TOKENS[BNB_MAINNET],
  },
  [BLAST_MAINNET]: {
    id: `0x${BLAST_MAINNET.toString(16)}`,
    label: 'Blast',
    icon: 'BLAST',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://rpc.blast.io',
    blockExplorerUrl: 'https://blastscan.io',
    secondaryTokens: SECONDARY_TOKENS[BLAST_MAINNET],
  },
  [BLAST_SEPOLIA]: {
    id: `0x${BLAST_SEPOLIA.toString(16)}`,
    label: 'Blast Sepolia',
    icon: 'BLAST',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://sepolia.blast.io',
    blockExplorerUrl: 'https://testnet.blastscan.io',
    secondaryTokens: SECONDARY_TOKENS[BLAST_SEPOLIA],
  },
  [AVALANCHE_MAINNET]: {
    id: `0x${AVALANCHE_MAINNET.toString(16)}`,
    label: 'Avalanche',
    icon: 'AVAX',
    token: NATIVE_CURRENCIES.AVAX.symbol,
    rpcUrl: 'https://avalanche.public-rpc.com',
    blockExplorerUrl: 'https://nets.avax.netwosubrk/dexalot',
    secondaryTokens: SECONDARY_TOKENS[AVALANCHE_MAINNET],
  },
  [FANTOM_MAINNET]: {
    id: `0x${FANTOM_MAINNET.toString(16)}`,
    label: 'Fantom',
    icon: 'FTM',
    token: NATIVE_CURRENCIES.FTM.symbol,
    rpcUrl: 'https://fantom-rpc.publicnode.com',
    blockExplorerUrl: 'https://ftmscan.com',
    secondaryTokens: SECONDARY_TOKENS[FANTOM_MAINNET],
  },
  [BASE_MAINNET]: {
    id: `0x${BASE_MAINNET.toString(16)}`,
    label: 'Base',
    icon: 'BASE',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://base-rpc.publicnode.com',
    blockExplorerUrl: 'https://basescan.org',
    secondaryTokens: SECONDARY_TOKENS[BASE_MAINNET],
  },
  [POLYGON_MAINNET]: {
    id: `0x${POLYGON_MAINNET.toString(16)}`,
    label: 'Polygon',
    icon: 'MATIC',
    token: NATIVE_CURRENCIES.MATIC.symbol,
    rpcUrl: 'https://polygon-bor-rpc.publicnode.com',
    blockExplorerUrl: 'https://polygonscan.com',
    secondaryTokens: SECONDARY_TOKENS[POLYGON_MAINNET],
  },
  [LINEA_MAINNET]: {
    id: `0x${LINEA_MAINNET.toString(16)}`,
    label: 'Linea',
    icon: 'LINEA',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://rpc.linea.build',
    blockExplorerUrl: 'https://lineascan.build',
    secondaryTokens: SECONDARY_TOKENS[LINEA_MAINNET],
  },
  [MODE_MAINNET]: {
    id: `0x${MODE_MAINNET.toString(16)}`,
    label: 'Mode',
    icon: 'MODE',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://mainnet.mode.network',
    blockExplorerUrl: 'https://modescan.io',
    secondaryTokens: SECONDARY_TOKENS[MODE_MAINNET],
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
