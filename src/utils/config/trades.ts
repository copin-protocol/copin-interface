// TODO: Check when add new protocol
import { JsonRpcProvider } from '@ethersproject/providers'

import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import {
  ARBITRUM_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  CHAINS,
  OPTIMISM_GOERLI,
  OPTIMISM_MAINNET,
  OPTIMISM_SEPOLIA,
  POLYGON_MAINNET,
} from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

import { TOKEN_COLLATERAL_APOLLOX_BNB, TOKEN_TRADE_APOLLOX_BNB } from './tokenTradeApolloX'
import { TOKEN_TRADE_BLOOM_BLAST } from './tokenTradeBloom'
import { TOKEN_TRADE_EQUATION_ARB } from './tokenTradeEquation'
import { TOKEN_TRADE_GMX } from './tokenTradeGmx'
import { TOKEN_TRADE_GMX_V2 } from './tokenTradeGmxV2'
import { TOKEN_TRADE_GNS } from './tokenTradeGns'
import { TOKEN_TRADE_GNS_POLY } from './tokenTradeGnsPoly'
import { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB } from './tokenTradeLevel'
import { TOKEN_COLLATERAL_MUX_ARB, TOKEN_TRADE_MUX_ARB } from './tokenTradeMux'
import { TOKEN_TRADE_SYNTHETIX } from './tokenTradeSynthetix'

type ProtocolProvider = { [key: string]: { chainId: number; provider: JsonRpcProvider; explorerUrl: string } }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.LEVEL_ARB]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LEVEL_BNB]: {
    chainId: BNB_MAINNET,
    provider: rpcProvider(BNB_MAINNET),
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MUX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS_POLY]: {
    chainId: POLYGON_MAINNET,
    provider: rpcProvider(POLYGON_MAINNET),
    explorerUrl: CHAINS[POLYGON_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX_V2]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    provider: rpcProvider(OPTIMISM_MAINNET),
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    chainId: OPTIMISM_MAINNET,
    provider: rpcProvider(OPTIMISM_MAINNET),
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    chainId: BLAST_MAINNET,
    provider: rpcProvider(BLAST_MAINNET),
    explorerUrl: CHAINS[BLAST_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    chainId: BNB_MAINNET,
    provider: rpcProvider(BNB_MAINNET),
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
}

export interface TokenTrade {
  address: string
  name: string
  symbol: string
  decimals: number
  priceFeedId: string
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

type TokenSupport = { [key: string]: { [key: string]: TokenTrade } }
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
}
export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.OTHERS]: [],
  [CopyTradePlatformEnum.GMX]: [],
  [CopyTradePlatformEnum.BINGX]: ['YFI', 'RPL', 'ZEC', 'RPL', 'UMA', 'BAL', 'XTZ', 'AR'],
  [CopyTradePlatformEnum.BITGET]: [],
  [CopyTradePlatformEnum.BINANCE]: [],
  [CopyTradePlatformEnum.SYNTHETIX]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V2]: [],
}

export const TOKEN_COLLATERAL_SUPPORT: TokenSupport = {
  [ProtocolEnum.APOLLOX_BNB]: {
    ...TOKEN_COLLATERAL_APOLLOX_BNB,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    '0x4300000000000000000000000000000000000003': {
      address: '0x4300000000000000000000000000000000000003',
      name: 'USDB',
      symbol: 'USDB',
      decimals: 18,
      priceFeedId: '',
      // icon: IconDAI,
    },
  },
  [ProtocolEnum.EQUATION_ARB]: {},
  [ProtocolEnum.LEVEL_BNB]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.LEVEL_BNB],
  },
  [ProtocolEnum.LEVEL_ARB]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.LEVEL_ARB],
  },
  [ProtocolEnum.LEVEL_ARB]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.LEVEL_ARB],
  },
  [ProtocolEnum.LEVEL_BNB]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.LEVEL_BNB],
  },
  [ProtocolEnum.MUX_ARB]: {
    ...TOKEN_COLLATERAL_MUX_ARB,
  },
  [ProtocolEnum.GNS]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.GNS_POLY]: {},
  [ProtocolEnum.GMX]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.GMX]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.GMX_V2]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.KWENTA]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      priceFeedId: '',
      // icon: IconDAI,
    },
  },
  [ProtocolEnum.POLYNOMIAL]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      priceFeedId: '',
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
  return Object.keys(tokensSupport).map((key) => ({
    id: key,
    label: tokensSupport[key]?.symbol ?? '',
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
  const tokens = TOKEN_TRADE_SUPPORT[protocol]
  return !!tokens ? tokens : {}
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
