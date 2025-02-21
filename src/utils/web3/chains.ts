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
export const ARBITRUM_SEPOLIA = 421614
export const BASE_MAINNET = 8453
export const BASE_SEPOLIA = 84532
export const ZKSYNC_ERA_MAINNET = 324
export const BNB_MAINNET = 56
export const OPBNB_MAINNET = 204
export const AVALANCHE_MAINNET = 43114
export const POLYGON_MAINNET = 137
export const MANTA_MAINNET = 169
export const MANTLE_MAINNET = 5000
export const LINEA_MAINNET = 59144
export const FANTOM_MAINNET = 250
export const MODE_MAINNET = 34443
export const SCROLL_MAINNET = 534352
export const METIS_MAINNET = 1088
export const APE_MAINNET = 33139
export const CRONOS_MAINNET = 25
export const BERA_MAINNET = 80094

export const HYPERLIQUID_TESTNET = 998

export const DYDX_MAINNET = 'dydx-mainnet-1'

export const XCHAIN_MAINNET = 94524
export const POLYNOMIAL_L2_MAINNET = 8008
export const DERIVE_MAINNET = 957

export const SOLANA_MAINNET = 101

export const DEFAULT_CHAIN_ID = NETWORK === 'devnet' ? OPTIMISM_SEPOLIA : OPTIMISM_MAINNET
export const BASE_CHAIN = NETWORK === 'devnet' ? BASE_SEPOLIA : BASE_MAINNET
export const OPTIMISM_CHAIN = NETWORK === 'devnet' ? OPTIMISM_SEPOLIA : OPTIMISM_MAINNET
export const ARBITRUM_CHAIN = NETWORK === 'devnet' ? ARBITRUM_SEPOLIA : ARBITRUM_MAINNET
export const SUBSCRIPTION_CHAIN_ID = NETWORK === 'devnet' ? OPTIMISM_SEPOLIA : OPTIMISM_MAINNET

export const SUPPORTED_CHAIN_IDS: number[] = [
  GOERLI,
  SEPOLIA,
  OPTIMISM_GOERLI,
  OPTIMISM_SEPOLIA,
  BLAST_SEPOLIA,
  ARBITRUM_GOERLI,
  ARBITRUM_SEPOLIA,
  ETHEREUM_MAINNET,
  ARBITRUM_MAINNET,
  OPTIMISM_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  OPBNB_MAINNET,
  AVALANCHE_MAINNET,
  BASE_MAINNET,
  POLYGON_MAINNET,
  FANTOM_MAINNET,
  LINEA_MAINNET,
  MODE_MAINNET,
  MANTLE_MAINNET,
  ZKSYNC_ERA_MAINNET,
  MANTA_MAINNET,
  SCROLL_MAINNET,
  METIS_MAINNET,
  APE_MAINNET,
  DERIVE_MAINNET,
  CRONOS_MAINNET,
  BERA_MAINNET,
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
  METIS: {
    name: 'METIS',
    symbol: 'METIS',
    decimals: 18,
  },
  APE: {
    name: 'APE',
    symbol: 'APE',
    decimals: 18,
  },
  DRV: {
    name: 'DRV',
    symbol: 'DRV',
    decimals: 18,
  },
  CRO: {
    name: 'CRO',
    symbol: 'CRO',
    decimals: 18,
  },
  SOL: {
    name: 'SOL',
    symbol: 'SOL',
    decimals: 18,
  },
  BERA: {
    name: 'BERA',
    symbol: 'BERA',
    decimals: 18,
  },
}

export const USD_ASSET = {
  [OPTIMISM_MAINNET]: {
    symbol: 'sUSD',
    address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
    decimals: 18,
  },
  [OPTIMISM_SEPOLIA]: {
    symbol: 'sUSD',
    address: '0xD7D674d80e79CF3A3b67D6a510AC1B0493dF47cF',
    decimals: 18,
  },
  [ARBITRUM_MAINNET]: {
    symbol: 'USDC',
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
  },
  [ARBITRUM_SEPOLIA]: {
    symbol: 'GNS_USDC',
    address: '0x4cC7EbEeD5EA3adf3978F19833d2E1f3e8980cD6',
    decimals: 6,
  },
  [BASE_MAINNET]: {
    symbol: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    decimals: 6,
  },
  [BASE_SEPOLIA]: {
    symbol: 'fUSDC',
    address: '0x4967d1987930b2CD183dAB4B6C40B8745DD2eba1',
    decimals: 18,
  },
}

const SECONDARY_TOKENS: {
  [key: number]: {
    address: string
    icon?: string
  }[]
} = {
  [OPTIMISM_MAINNET]: [
    {
      address: USD_ASSET[OPTIMISM_MAINNET].address,
    },
  ],
  [OPTIMISM_SEPOLIA]: [
    {
      address: USD_ASSET[OPTIMISM_SEPOLIA].address,
    },
  ],
  [ARBITRUM_MAINNET]: [
    {
      address: USD_ASSET[ARBITRUM_MAINNET].address,
    },
  ],
  [ARBITRUM_SEPOLIA]: [
    {
      address: USD_ASSET[ARBITRUM_SEPOLIA].address,
    },
  ],
}

const CHAINS: { [key: number | string]: Chain } = {
  [ETHEREUM_MAINNET]: {
    id: `0x${ETHEREUM_MAINNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Ethereum',
    icon: 'ETH',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
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
    rpcUrl: 'https://arbitrum.copin.io',
    blockExplorerUrl: 'https://arbiscan.io',
    secondaryTokens: SECONDARY_TOKENS[ARBITRUM_MAINNET],
  },
  [BASE_MAINNET]: {
    id: `0x${BASE_MAINNET.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Base',
    icon: 'BASE',
    rpcUrl: 'https://base.publicnode.com',
    blockExplorerUrl: 'https://basescan.org',
    secondaryTokens: SECONDARY_TOKENS[BASE_MAINNET],
  },
  [SEPOLIA]: {
    id: `0x${SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Sepolia',
    icon: 'ETH',
    rpcUrl: 'https://ethereum-sepolia.publicnode.com',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    secondaryTokens: SECONDARY_TOKENS[SEPOLIA],
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
    label: 'Optimism Sepolia',
    icon: 'OP',
    rpcUrl: 'https://optimism-sepolia-rpc.publicnode.com',
    blockExplorerUrl: 'https://sepolia-optimism.etherscan.io',
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
  [ARBITRUM_SEPOLIA]: {
    id: `0x${ARBITRUM_SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Arbitrum Sepolia',
    icon: 'ARB',
    rpcUrl: 'https://arbitrum-sepolia.publicnode.com',
    blockExplorerUrl: 'https://sepolia.arbiscan.io',
    secondaryTokens: SECONDARY_TOKENS[ARBITRUM_SEPOLIA],
  },
  [BASE_SEPOLIA]: {
    id: `0x${BASE_SEPOLIA.toString(16)}`,
    token: NATIVE_CURRENCIES.ETH.symbol,
    label: 'Base Sepolia',
    icon: 'BASE',
    rpcUrl: 'https://base-sepolia-rpc.publicnode.com',
    blockExplorerUrl: 'https://sepolia.basescan.org',
    secondaryTokens: SECONDARY_TOKENS[BASE_SEPOLIA],
  },
  [BNB_MAINNET]: {
    id: `0x${BNB_MAINNET.toString(16)}`,
    label: 'BNB Chain',
    icon: 'BNB',
    token: NATIVE_CURRENCIES.BNB.symbol,
    rpcUrl: 'https://bsc-rpc.publicnode.com',
    blockExplorerUrl: 'https://bscscan.com',
    secondaryTokens: SECONDARY_TOKENS[BNB_MAINNET],
  },
  [OPBNB_MAINNET]: {
    id: `0x${OPBNB_MAINNET.toString(16)}`,
    label: 'opBNB',
    icon: 'OPBNB',
    token: NATIVE_CURRENCIES.BNB.symbol,
    rpcUrl: 'https://opbnb-rpc.publicnode.com',
    blockExplorerUrl: 'https://opbnbscan.com',
    secondaryTokens: SECONDARY_TOKENS[OPBNB_MAINNET],
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
    blockExplorerUrl: 'https://snowtrace.io',
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
  [MANTLE_MAINNET]: {
    id: `0x${MANTLE_MAINNET.toString(16)}`,
    label: 'Mantle',
    icon: 'MNT',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://mantle-rpc.publicnode.com',
    blockExplorerUrl: 'https://explorer.mantle.xyz',
    secondaryTokens: SECONDARY_TOKENS[MANTLE_MAINNET],
  },
  [ZKSYNC_ERA_MAINNET]: {
    id: `0x${ZKSYNC_ERA_MAINNET.toString(16)}`,
    label: 'zkSync Era',
    icon: 'ZK',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://1rpc.io/zksync2-era',
    blockExplorerUrl: 'https://explorer.zksync.io',
    secondaryTokens: SECONDARY_TOKENS[ZKSYNC_ERA_MAINNET],
  },
  [MANTA_MAINNET]: {
    id: `0x${MANTA_MAINNET.toString(16)}`,
    label: 'Manta',
    icon: 'MANTA',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://manta-pacific.drpc.org',
    blockExplorerUrl: 'https://pacific-explorer.manta.network',
    secondaryTokens: SECONDARY_TOKENS[MANTA_MAINNET],
  },
  [SCROLL_MAINNET]: {
    id: `0x${SCROLL_MAINNET.toString(16)}`,
    label: 'Scroll',
    icon: 'SCROLL',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://scroll.drpc.org',
    blockExplorerUrl: 'https://scrollscan.com',
    secondaryTokens: SECONDARY_TOKENS[SCROLL_MAINNET],
  },
  [HYPERLIQUID_TESTNET]: {
    id: '',
    label: 'Hyperliquid',
    icon: 'HYPERLIQUID',
    token: '',
    rpcUrl: '',
    blockExplorerUrl: 'https://app.hyperliquid.xyz/explorer',
  },
  [DYDX_MAINNET]: {
    id: '',
    label: 'dYdX',
    icon: 'DYDX',
    token: '',
    rpcUrl: 'https://dydx-rpc.publicnode.com:443',
    blockExplorerUrl: 'https://www.mintscan.io/dydx',
  },
  [XCHAIN_MAINNET]: {
    id: `0x${XCHAIN_MAINNET.toString(16)}`,
    label: 'XCHAIN',
    icon: 'XCHAIN',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://xchain-rpc.idex.io',
    blockExplorerUrl: 'https://xchain-explorer.idex.io',
  },
  [POLYNOMIAL_L2_MAINNET]: {
    id: `0x${POLYNOMIAL_L2_MAINNET.toString(16)}`,
    label: 'Polynomial L2',
    icon: 'POLYNOMIAL',
    token: NATIVE_CURRENCIES.ETH.symbol,
    rpcUrl: 'https://rpc.polynomial.fi',
    blockExplorerUrl: 'https://polynomialscan.io',
  },
  [METIS_MAINNET]: {
    id: `0x${METIS_MAINNET.toString(16)}`,
    label: 'Metis',
    icon: 'METIS',
    token: NATIVE_CURRENCIES.METIS.symbol,
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    blockExplorerUrl: 'https://explorer.metis.io',
  },
  [APE_MAINNET]: {
    id: `0x${APE_MAINNET.toString(16)}`,
    label: 'Ape Chain',
    icon: 'APE',
    token: NATIVE_CURRENCIES.APE.symbol,
    rpcUrl: 'https://rpc.apechain.com',
    blockExplorerUrl: 'https://apescan.io',
  },
  [DERIVE_MAINNET]: {
    id: `0x${DERIVE_MAINNET.toString(16)}`,
    label: 'Derive',
    icon: 'DRV',
    token: NATIVE_CURRENCIES.DRV.symbol,
    rpcUrl: 'https://rpc.lyra.finance',
    blockExplorerUrl: 'https://explorer.lyra.finance',
  },
  [CRONOS_MAINNET]: {
    id: `0x${CRONOS_MAINNET.toString(16)}`,
    label: 'Cronos',
    icon: 'CRO',
    token: NATIVE_CURRENCIES.CRO.symbol,
    rpcUrl: 'https://evm.cronos.org',
    blockExplorerUrl: 'https://cronoscan.com',
  },
  [SOLANA_MAINNET]: {
    id: `0x${SOLANA_MAINNET.toString(16)}`,
    label: 'Solana',
    icon: 'SOL',
    token: '',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorerUrl: 'https://solscan.io',
  },
  [BERA_MAINNET]: {
    id: `0x${BERA_MAINNET.toString(16)}`,
    label: 'Berachain',
    icon: 'BERA',
    token: NATIVE_CURRENCIES.BERA.symbol,
    rpcUrl: 'https://berachain-rpc.publicnode.com',
    blockExplorerUrl: 'https://berascan.com',
  },
}

const chains = SUPPORTED_CHAIN_IDS.map((id) => CHAINS[id])

const getChainMetadata = (chainId: number | string, rpcUrls?: string[]) => {
  const chain = CHAINS[chainId]
  if (!chain)
    return {
      id: `0x${chainId.toString(16)}`,
      label: 'Unknown',
      icon: 'Unknown',
      token: NATIVE_CURRENCIES.ETH.symbol,
      rpcUrl: rpcUrls ? rpcUrls[0] : '',
      blockExplorerUrl: '',
    }
  if (rpcUrls) return { ...chain, rpcUrls }
  return chain
}

export { NATIVE_CURRENCIES, CHAINS, chains, getChainMetadata }
