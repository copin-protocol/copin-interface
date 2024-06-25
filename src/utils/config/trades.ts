// TODO: Check when add new protocol
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import {
  ARBITRUM_MAINNET,
  BASE_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  CHAINS,
  MANTLE_MAINNET,
  MODE_MAINNET,
  OPTIMISM_GOERLI,
  OPTIMISM_MAINNET,
  OPTIMISM_SEPOLIA,
  POLYGON_MAINNET,
} from 'utils/web3/chains'

import { TOKEN_COLLATERAL_APOLLOX_BNB, TOKEN_TRADE_APOLLOX_BNB } from './tokenTradeApolloX'
import { TOKEN_TRADE_AVANTIS_BASE } from './tokenTradeAvantis'
import { TOKEN_TRADE_BLOOM_BLAST } from './tokenTradeBloom'
import { TOKEN_TRADE_EQUATION_ARB } from './tokenTradeEquation'
import { TOKEN_TRADE_GMX } from './tokenTradeGmx'
import { TOKEN_TRADE_GMX_V2 } from './tokenTradeGmxV2'
import { TOKEN_TRADE_GNS } from './tokenTradeGns'
import { TOKEN_TRADE_GNS_POLY } from './tokenTradeGnsPoly'
import { TOKEN_TRADE_HMX_ARB } from './tokenTradeHmx'
import { TOKEN_COLLATERAL_KTX_MANTLE, TOKEN_TRADE_KTX_MANTLE } from './tokenTradeKtx'
import { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB } from './tokenTradeLevel'
import { TOKEN_TRADE_LOGX_BLAST, TOKEN_TRADE_LOGX_MODE } from './tokenTradeLogX'
import { TOKEN_COLLATERAL_MUX_ARB, TOKEN_TRADE_MUX_ARB } from './tokenTradeMux'
import { TOKEN_TRADE_MYX_ARB } from './tokenTradeMyx'
import { TOKEN_TRADE_SYNTHETIX } from './tokenTradeSynthetix'
import { TOKEN_TRADE_SYNTHETIX_V3 } from './tokenTradeSynthetixV3'
import { TOKEN_TRADE_TIGRIS_ARB } from './tokenTradeTigris'
import { TOKEN_TRADE_VELA_ARB } from './tokenTradeVela'

type ProtocolProvider = { [key: string]: { chainId: number; explorerUrl: string } }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.LEVEL_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LEVEL_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MUX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS_POLY]: {
    chainId: POLYGON_MAINNET,
    explorerUrl: CHAINS[POLYGON_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX_V2]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    chainId: BLAST_MAINNET,
    explorerUrl: CHAINS[BLAST_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LOGX_BLAST]: {
    chainId: BLAST_MAINNET,
    explorerUrl: CHAINS[BLAST_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LOGX_MODE]: {
    chainId: MODE_MAINNET,
    explorerUrl: CHAINS[MODE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MYX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HMX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.DEXTORO]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.VELA_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.COPIN]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KTX_MANTLE]: {
    chainId: MANTLE_MAINNET,
    explorerUrl: CHAINS[MANTLE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.CYBERDEX]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
}

export interface TokenTrade {
  address: string
  // name: string
  symbol: string
  // decimals: number
  // priceFeedId: string
  // icon: string
}
export type ProtocolTokenMapping = { [address: string]: { symbol: string } }
export interface TokenCollateral {
  address: string
  symbol: string
  decimals: number
}

export type TokenOptionProps = {
  id: string
  label: string
  value: string
}

export const ALL_TOKENS_ID = 'ALL'
export const ALL_OPTION: TokenOptionProps = {
  id: ALL_TOKENS_ID,
  label: 'ALL',
  value: ALL_TOKENS_ID,
}

type TokenSupport = { [protocol in ProtocolEnum]: ProtocolTokenMapping }
type TokenCollateralSupport = { [protocol in ProtocolEnum]: { [address: string]: TokenCollateral } }
type TokenIgnore = { [key in CopyTradePlatformEnum]: string[] }

export const TOKEN_TRADE_SUPPORT: TokenSupport = {
  [ProtocolEnum.GNS]: TOKEN_TRADE_GNS,
  [ProtocolEnum.GNS_POLY]: TOKEN_TRADE_GNS_POLY,
  [ProtocolEnum.GMX]: TOKEN_TRADE_GMX,
  [ProtocolEnum.GMX_V2]: TOKEN_TRADE_GMX_V2,
  [ProtocolEnum.KWENTA]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.LEVEL_BNB]: TOKEN_TRADE_LEVEL_BNB,
  [ProtocolEnum.LEVEL_ARB]: TOKEN_TRADE_LEVEL_ARB,
  [ProtocolEnum.MUX_ARB]: TOKEN_TRADE_MUX_ARB,
  [ProtocolEnum.EQUATION_ARB]: TOKEN_TRADE_EQUATION_ARB,
  [ProtocolEnum.BLOOM_BLAST]: TOKEN_TRADE_BLOOM_BLAST,
  [ProtocolEnum.APOLLOX_BNB]: TOKEN_TRADE_APOLLOX_BNB,
  [ProtocolEnum.AVANTIS_BASE]: TOKEN_TRADE_AVANTIS_BASE,
  [ProtocolEnum.TIGRIS_ARB]: TOKEN_TRADE_TIGRIS_ARB,
  [ProtocolEnum.LOGX_BLAST]: TOKEN_TRADE_LOGX_BLAST,
  [ProtocolEnum.LOGX_MODE]: TOKEN_TRADE_LOGX_MODE,
  [ProtocolEnum.MYX_ARB]: TOKEN_TRADE_MYX_ARB,
  [ProtocolEnum.HMX_ARB]: TOKEN_TRADE_HMX_ARB,
  [ProtocolEnum.DEXTORO]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.CYBERDEX]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.VELA_ARB]: TOKEN_TRADE_VELA_ARB,
  [ProtocolEnum.SYNTHETIX_V3]: TOKEN_TRADE_SYNTHETIX_V3,
  [ProtocolEnum.COPIN]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.KTX_MANTLE]: TOKEN_TRADE_KTX_MANTLE,
}
export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.OTHERS]: [],
  [CopyTradePlatformEnum.GMX]: [],
  [CopyTradePlatformEnum.BINGX]: ['YFI', 'RPL', 'ZEC', 'RPL', 'UMA', 'BAL', 'XTZ', 'AR'],
  [CopyTradePlatformEnum.BITGET]: [],
  [CopyTradePlatformEnum.BINANCE]: [],
  [CopyTradePlatformEnum.BYBIT]: [],
  [CopyTradePlatformEnum.OKX]: [],
  [CopyTradePlatformEnum.GATE]: [],
  [CopyTradePlatformEnum.SYNTHETIX]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V2]: [],
}

export const TOKEN_COLLATERAL_SUPPORT: TokenCollateralSupport = {
  [ProtocolEnum.KTX_MANTLE]: {
    ...TOKEN_COLLATERAL_KTX_MANTLE,
  },
  [ProtocolEnum.COPIN]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      // name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.VELA_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.DEXTORO]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      // name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.CYBERDEX]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      // name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.HMX_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.MYX_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.LOGX_MODE]: {
    '0xd988097fb8612cc24eeC14542bC03424c656005f': {
      address: '0xd988097fb8612cc24eeC14542bC03424c656005f',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
    '0xf0F161fDA2712DB8b566946122a5af183995e2eD': {
      address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
      // name: 'USDT',
      symbol: 'USDT',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.LOGX_BLAST]: {
    '0x4300000000000000000000000000000000000003': {
      address: '0x4300000000000000000000000000000000000003',
      // name: 'USDB',
      symbol: 'USDB',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      // name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      // priceFeedId: '',
    },
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      // name: 'USDT',
      symbol: 'USDT',
      decimals: 18,
      // priceFeedId: '',
    },
    '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd': {
      address: '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd',
      // name: 'tigUSD',
      symbol: 'tigUSD',
      decimals: 18,
      // priceFeedId: '',
    },
    '0x763E061856b3e74a6C768a859DC2543A56D299d5': {
      address: '0x763E061856b3e74a6C768a859DC2543A56D299d5',
      // name: 'tigETH',
      symbol: 'tigETH',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      // name: 'USDC',
      symbol: 'USDC',
      decimals: 18,
      // priceFeedId: '',
    },
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    ...TOKEN_COLLATERAL_APOLLOX_BNB,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    '0x4300000000000000000000000000000000000003': {
      address: '0x4300000000000000000000000000000000000003',
      // name: 'USDB',
      symbol: 'USDB',
      decimals: 18,
      // priceFeedId: '',
      // icon: IconDAI,
    },
  },
  [ProtocolEnum.EQUATION_ARB]: {},
  [ProtocolEnum.LEVEL_BNB]: {},
  [ProtocolEnum.LEVEL_ARB]: {},
  [ProtocolEnum.MUX_ARB]: {
    ...TOKEN_COLLATERAL_MUX_ARB,
  },
  [ProtocolEnum.GNS]: {},
  [ProtocolEnum.GNS_POLY]: {},
  [ProtocolEnum.GMX]: {},
  [ProtocolEnum.GMX_V2]: {},
  [ProtocolEnum.KWENTA]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      // name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // priceFeedId: '',
      // icon: IconDAI,
    },
  },
  [ProtocolEnum.POLYNOMIAL]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      // name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // priceFeedId: '',
      // icon: IconDAI,
    },
  },
}

export const TOKEN_ADDRESSES = {
  [ProtocolEnum.GMX_V2]: {
    BTC: '0x47c031236e19d024b42f8AE6780E44A573170703',
    ETH: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
  },
  [ProtocolEnum.GMX]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ProtocolEnum.KWENTA]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.POLYNOMIAL]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.LEVEL_BNB]: {
    BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  [ProtocolEnum.LEVEL_ARB]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ProtocolEnum.GNS]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  [ProtocolEnum.GNS_POLY]: {
    BTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    ETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  [ProtocolEnum.MUX_ARB]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  [ProtocolEnum.EQUATION_ARB]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    ETH: '0x4300000000000000000000000000000000000004',
    USDB: '0x4300000000000000000000000000000000000003',
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    USDC: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    BUSD: '0x55d398326f99059fF775485246999027B3197955',
    LUSD: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    ETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    tigUSD: '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd',
    tigETH: '0x763E061856b3e74a6C768a859DC2543A56D299d5',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ProtocolEnum.LOGX_BLAST]: {
    ETH: '0x4300000000000000000000000000000000000004',
    USDB: '0x4300000000000000000000000000000000000003',
  },
  [ProtocolEnum.LOGX_MODE]: {
    ETH: '0x4200000000000000000000000000000000000006',
    USDC: '0xd988097fb8612cc24eeC14542bC03424c656005f',
    USDT: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
  },
  [ProtocolEnum.MYX_ARB]: {
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  [ProtocolEnum.HMX_ARB]: {
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  [ProtocolEnum.DEXTORO]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.CYBERDEX]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.VELA_ARB]: {
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    ETH: '0x4200000000000000000000000000000000000006',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  [ProtocolEnum.COPIN]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.KTX_MANTLE]: {
    BTC: '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2',
    ETH: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',
  },
}

export const SYNTHETIX_MARKETS = {
  [OPTIMISM_MAINNET]: Object.keys(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  [OPTIMISM_GOERLI]: ['0x111BAbcdd66b1B60A20152a2D3D06d36F8B5703c'],
  [OPTIMISM_SEPOLIA]: ['0x111BAbcdd66b1B60A20152a2D3D06d36F8B5703c'],
}

export const getDefaultTokenTrade = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return Object.values(tokensSupport)[0]
}

export const getTokenTradeList = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return (tokensSupport ? Object.values(tokensSupport) : []) as TokenTrade[]
}

export const getDefaultTokenOptions = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return Array.from(
    new Set(
      Object.values(tokensSupport)
        .map((_v) => _v?.symbol || '')
        .filter((_v) => !!_v)
    )
  ).map((key) => ({
    id: key,
    label: key,
    value: key,
  }))
}
export const getTokenOptions = ({ protocol, ignoredAll }: { protocol: ProtocolEnum; ignoredAll?: boolean }) => {
  const tokenOptions = getDefaultTokenOptions(protocol)
  if (!tokenOptions) return [ALL_OPTION]

  return ignoredAll ? tokenOptions : [ALL_OPTION, ...tokenOptions]
}

export const TIMEFRAME_NAMES = {
  // Minutes
  5: 'M5',
  15: 'M15',
  30: 'M30',
  60: 'H1',
  240: 'H4',
  1440: 'D1',
}

export function getTokenTradeSupport(protocol: ProtocolEnum): {
  [key: string]: TokenTrade | undefined
} {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const result = Object.entries(tokens).reduce<Record<string, TokenTrade | undefined>>((_r, [key, value]) => {
    const tokenTrade: TokenTrade = { symbol: value.symbol, address: key }
    return { ..._r, [key]: tokenTrade }
  }, {})
  return result
}

export function getSymbolByTokenTrade(protocol: ProtocolEnum): Record<string, string> {
  const tokenTrades = getTokenTradeSupport(protocol)
  if (!tokenTrades) return {}
  return Object.values(tokenTrades).reduce<Record<string, string>>((result, tokenTrade) => {
    if (!tokenTrade) return result
    return { ...result, [tokenTrade.address]: tokenTrade.symbol }
  }, {})
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
