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
  OPBNB_MAINNET,
  OPTIMISM_MAINNET,
  OPTIMISM_SEPOLIA,
  POLYGON_MAINNET,
  SCROLL_MAINNET,
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
import { TOKEN_COLLATERAL_KILOEX_OPBNB, TOKEN_TRADE_KILOEX_OPBNB } from './tokenTradeKiloEx'
import { TOKEN_COLLATERAL_KTX_MANTLE, TOKEN_TRADE_KTX_MANTLE } from './tokenTradeKtx'
import { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB } from './tokenTradeLevel'
import { TOKEN_TRADE_LOGX_BLAST, TOKEN_TRADE_LOGX_MODE } from './tokenTradeLogX'
import { TOKEN_COLLATERAL_MUX_ARB, TOKEN_TRADE_MUX_ARB } from './tokenTradeMux'
import { TOKEN_TRADE_MYX_ARB } from './tokenTradeMyx'
import { TOKEN_COLLATERAL_ROLLIE_SCROLL, TOKEN_TRADE_ROLLIE_SCROLL } from './tokenTradeRollie'
import { TOKEN_TRADE_SYNTHETIX } from './tokenTradeSynthetix'
import { TOKEN_TRADE_SYNTHETIX_V3 } from './tokenTradeSynthetixV3'
import { TOKEN_TRADE_TIGRIS_ARB } from './tokenTradeTigris'
import { TOKEN_TRADE_VELA_ARB } from './tokenTradeVela'
import { TOKEN_TRADE_YFX_ARB } from './tokenTradeYfx'

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
  [ProtocolEnum.YFX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KILOEX_OPBNB]: {
    chainId: OPBNB_MAINNET,
    explorerUrl: CHAINS[OPBNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.ROLLIE_SCROLL]: {
    chainId: SCROLL_MAINNET,
    explorerUrl: CHAINS[SCROLL_MAINNET].blockExplorerUrl,
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
  copyV3MarketId?: number
  // icon: string
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

export const SYNTHETIX_V3_MARKET_IDS = {
  BTC: 200,
  ETH: 100,
}
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
  [ProtocolEnum.YFX_ARB]: TOKEN_TRADE_YFX_ARB,
  [ProtocolEnum.KILOEX_OPBNB]: TOKEN_TRADE_KILOEX_OPBNB,
  [ProtocolEnum.ROLLIE_SCROLL]: TOKEN_TRADE_ROLLIE_SCROLL,
}
export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.OTHERS]: [],
  [CopyTradePlatformEnum.GMX]: [],
  [CopyTradePlatformEnum.BINGX]: ['YFI', 'PERP', 'RPL', 'ZEC', 'RPL', 'UMA', 'BAL', 'XTZ'],
  [CopyTradePlatformEnum.BITGET]: [],
  [CopyTradePlatformEnum.BINANCE]: [],
  [CopyTradePlatformEnum.BYBIT]: [],
  [CopyTradePlatformEnum.OKX]: [],
  [CopyTradePlatformEnum.GATE]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V2]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V3]: [],
  [CopyTradePlatformEnum.GNS_V8]: [],
}

export const TOKEN_COLLATERAL_SUPPORT: TokenCollateralSupport = {
  [ProtocolEnum.KTX_MANTLE]: {
    ...TOKEN_COLLATERAL_KTX_MANTLE,
  },
  [ProtocolEnum.COPIN]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      symbol: 'SUSD',
      decimals: 18,
    },
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.VELA_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.DEXTORO]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      symbol: 'SUSD',
      decimals: 18,
    },
  },
  [ProtocolEnum.CYBERDEX]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      symbol: 'SUSD',
      decimals: 18,
    },
  },
  [ProtocolEnum.HMX_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.MYX_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.LOGX_MODE]: {
    '0xd988097fb8612cc24eeC14542bC03424c656005f': {
      address: '0xd988097fb8612cc24eeC14542bC03424c656005f',
      symbol: 'USDC',
      decimals: 18,
    },
    '0xf0F161fDA2712DB8b566946122a5af183995e2eD': {
      address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
      symbol: 'USDT',
      decimals: 18,
    },
  },
  [ProtocolEnum.LOGX_BLAST]: {
    '0x4300000000000000000000000000000000000003': {
      address: '0x4300000000000000000000000000000000000003',
      symbol: 'USDB',
      decimals: 18,
    },
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      symbol: 'ETH',
      decimals: 18,
    },
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': {
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      symbol: 'USDT',
      decimals: 18,
    },
    '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd': {
      address: '0x7E491F53bF807f836E2dd6C4A4FBd193e1913EFd',
      symbol: 'tigUSD',
      decimals: 18,
    },
    '0x763E061856b3e74a6C768a859DC2543A56D299d5': {
      address: '0x763E061856b3e74a6C768a859DC2543A56D299d5',
      symbol: 'tigETH',
      decimals: 18,
    },
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    ...TOKEN_COLLATERAL_APOLLOX_BNB,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    '0x4300000000000000000000000000000000000003': {
      address: '0x4300000000000000000000000000000000000003',
      symbol: 'USDB',
      decimals: 18,
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
      symbol: 'SUSD',
      decimals: 18,
    },
  },
  [ProtocolEnum.POLYNOMIAL]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      symbol: 'SUSD',
      decimals: 18,
    },
  },
  [ProtocolEnum.YFX_ARB]: {
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': {
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      symbol: 'USDC',
      decimals: 18,
    },
  },
  [ProtocolEnum.KILOEX_OPBNB]: {
    ...TOKEN_COLLATERAL_KILOEX_OPBNB,
  },
  [ProtocolEnum.ROLLIE_SCROLL]: {
    ...TOKEN_COLLATERAL_ROLLIE_SCROLL,
  },
}

// Todo: Check when add new protocol
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
  [ProtocolEnum.YFX_ARB]: {
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  [ProtocolEnum.KILOEX_OPBNB]: {
    BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    ETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    USDT: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
  },
  [ProtocolEnum.ROLLIE_SCROLL]: {
    BTC: '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1',
    ETH: '0x5300000000000000000000000000000000000004',
    USDC: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
  },
}

export const SYNTHETIX_MARKETS: { [key: number]: string[] } = {
  [OPTIMISM_MAINNET]: Object.keys(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  [OPTIMISM_SEPOLIA]: [
    '0x5463B99CdB8e0392F1cf381079De910Ab2ED762D',
    '0xa89402D83DeD4C71639Cf0Ca1f5FCc25EE4eB1A8',
    '0x2805E91bdf139E68EFfC79117f39b4C34e71B0Bb',
    '0xf3D4f959edb11594a5fEB13Fc11a74F096603779',
    '0x00e793B4ad1eCf68e660BB798c16a2Ea438C0A29',
    '0xC1D3237719867905F42B492030b5CBc8E24c8dA1',
    '0x1821b0d66d72E4a0a85B5B2a2941E76f237552Ba',
    '0xbFC138dFf9Ae45F3e4ae9Bf3aCB47CA8223196E4',
    '0x10e79fe757eD1d18536B2E509AF61235BceD69e0',
    '0x2e11a3638F12A37263b1B4226b61412f6BBB277c',
    '0x91DfFf9A9E4fE4F3BBD2F83c60A7fE335bbc316a',
    '0x01F226F3FB083165401c9e50FDE718b6a2b266A9',
    '0x867D147fDe1e29C37B6cFbA35A266C7A758489Ee',
    '0x58ed75617f2701Ec1Be85709dAB27cEcab327C04',
    '0xcA3988389C58F9C46245abbD6e3549744d516531',
    '0xc50E64e2E980a67BbD85B68A3Ad96aCB1c037921',
    '0x0d407B6B9261558249c3B7e68f2E237bC2aA1F02',
    '0x1120e7DDB511493040F41Add9bBe3F9c53b967E0',
    '0x0E9628026e53f4c805073d85554A87dBd2011268',
    '0x9Ef3B803ed63A7E2f6cA1C46e313d8db642AA864',
    '0x5D6e4263a203A1677Da38f175d95759adA27e6F9',
    '0x4EA91e75335Fa05182a7c8BD9D54A1f1ff6Ed29E',
    '0x08808c5B37e731bCcCd0Ae59f5681d0040022Af3',
    '0xBF1B83321d97734D11399Eabb38684dB33d8B3D6',
    '0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830',
    '0xF60D392b73E4333ff7fb100235D235c0922cF9a4',
    '0xDDc8EcC1Fe191e5a156cb1e7cd00fE572bb272E5',
    '0xe14F12246A6965aB2E8ea52A1Be39B8f731bc4a4',
    '0x14fA3376E2ffa41708A0636009A35CAE8D8E2bc7',
    '0x18433f795e05E8FF387C0633aF4140e72cdd5A94',
    '0x6ee09cF4B660975D8Fdb041AE257BAc34f4aA589',
    '0xeA4662804B884EB6ed4DAe4323Ea20e04c07626d',
    '0x3a47Ec548435A4478B2042Cbdc56F94cB62c435F',
    '0xFFa9181926d4C6003213cAb599963D0614b0cA61',
    '0x041013BCB3637778B5056Bf5595318415EC21C0d',
    '0x5fc12B9E0284545b6d979b77436D3BaA3b0F612d',
    '0xE97AE65AB0108DDc4dF34b6Aff7B17D911C39931',
    '0x928B8C670D244ee09b8b57Cac7b6F042e6FC4306',
    '0xFf1AA6A6B8a8CDD82a7B275A65D9EF7fa5EcE2e6',
    '0x52a35CaED46a6c20B5c43a0D6BEDc4990800E492',
    '0x227F3d73Cf5618640fe3a0eF8404929aa99532c8',
    '0x3A2F7083C1617e4371bA723Bc27dED8A1Bd6AD90',
    '0x524c0B136F54941529b8c11214A05f958a89A6A6',
    '0x8262BaDdD5644b02f317eA1AD4E5cBC52B9bfd0b',
    '0x9763510E1E0057bE624Ded90e1916130cBe920df',
    '0x9c898362025AF668067947fA55500081B13fdC7e',
    '0x4398715c8742732F9A4e21664249D120b5436725',
    '0xa35575182f5985d6caA1E4e435e7EaF986232ef8',
    '0xD0dedf5199616297063C9Ad820F65ecB9d36851E',
    '0x06775cce8ec277b54aD2a85A74Dc4273330dd445',
    '0x537E59ddb03a95cD127870Ef95d87446f0E76A92',
    '0x345b046a097C937162116716e6a8449d0D1EFA88',
    '0x99CC961612B627C535a82819Ea291800D9E69783',
    '0xA5a6887a19c99D6Cf087B1c8e71539a519b7bFe6',
    '0xC49A8F98B4D7E033bF99008387D2C3fE0Ccc532c',
    '0x16665311Ea294747F10380a91f25193D8A9612A4',
    '0xaaEe25Fef392266cC85Ef110Aa098a1A3238E5A5',
    '0x01d6792DD0456b5bE831c4BD1F107eF524f89495',
    '0x393650685eE7f9b7aeB01E1b6881540af0d71ffF',
    '0x09be72F8DC6E5D327A116087A2b33e0DeC49CDC6',
    '0x3707CF43F93fDDE90aC0A06e6c7C052a8e8F335A',
    '0x0A0e4917e67054CdD06d07d12D4a8f623D2d7269',
    '0xc3beea442B907465C3632Fa7F3C9ee9E2b997994',
    '0x96ffa60CA169e648b098aFADCCEec4b8eE455ec4',
    '0x92BcE39eC30453b9b1f3FF14207653230e74cDC2',
    '0x0d9Ec064105A1B0A95F4C75c56E617CCa6b1931b',
    '0x01683A14CC451e46dBDf02050B96735C5FBcf9d3',
    '0xBbB5b6C8BaDd8b3B70B6816C65D94e4277614741',
    '0xff72A63fAb428545Ee7a6a7bd30323cc1Cc0b30c',
    '0xd3870Aa7A0950Fa181Ad7b8c244Db390C7c37F1B',
    '0xcE6f7404668089A1d61788BA3d4Bec6480f66aF4',
    '0xa98AA8febE4B61038Df2bc843C7F902faA7Faf8B',
    '0x846195Ecd35B602F82429670b7C251C142E8F148',
    '0x33073dCE3717383c157191E3dC3A881C5c51b12d',
  ],
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
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const result = Object.entries(tokens).reduce<Record<string, string>>((_r, [key, value]) => {
    return { ..._r, [key]: value.symbol }
  }, {})
  return result
}

export function getSymbolsFromIndexTokens(protocol: ProtocolEnum, indexTokens: string[]): string[] {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const symbolByIndexToken = Object.entries(tokens).reduce<Record<string, string>>((_r, [key, value]) => {
    return { ..._r, [key]: value.symbol }
  }, {})
  const symbols = Array.from(new Set(indexTokens.map((indexToken) => symbolByIndexToken[indexToken]))).filter(
    (v) => !!v
  )
  return symbols
}

export function getIndexTokensFromSymbols(protocol: ProtocolEnum, symbols: string[]): string[] {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const indexTokensBySymbol = Object.entries(tokens).reduce<Record<string, string[]>>(
    (_r, [indexToken, { symbol }]) => {
      return { ..._r, [symbol]: [...(_r[symbol] ?? []), indexToken] }
    },
    {}
  )
  const indexTokens = symbols
    .map((symbol) => indexTokensBySymbol[symbol])
    .flat()
    .filter((v) => !!v)
  return indexTokens
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
