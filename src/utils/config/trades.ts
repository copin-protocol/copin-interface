// TODO: Check when add new protocol
import { JsonRpcProvider } from '@ethersproject/providers'

import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { ARBITRUM_MAINNET, CHAINS, OPTIMISM_GOERLI, OPTIMISM_MAINNET, OPTIMISM_SEPOLIA } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

import { TOKEN_TRADE_GMX } from './tokenTradeGmx'
import { TOKEN_TRADE_GMX_V2 } from './tokenTradeGmxV2'
import { TOKEN_TRADE_GNS } from './tokenTradeGns'
import { TOKEN_TRADE_SYNTHETIX } from './tokenTradeSynthetix'

type ProtocolProvider = { [key: string]: { chainId: number; provider: JsonRpcProvider; explorerUrl: string } }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.GNS]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
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
  [ProtocolEnum.GMX]: TOKEN_TRADE_GMX,
  [ProtocolEnum.GMX_V2]: TOKEN_TRADE_GMX_V2,
  [ProtocolEnum.KWENTA]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_TRADE_SYNTHETIX,
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
  [ProtocolEnum.GNS]: {
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
  [ProtocolEnum.GNS]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
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
}

export const SYNTHETIX_MARKETS = {
  [OPTIMISM_MAINNET]: Object.keys(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  [OPTIMISM_GOERLI]: ['0x111BAbcdd66b1B60A20152a2D3D06d36F8B5703c'],
  [OPTIMISM_SEPOLIA]: ['0x111BAbcdd66b1B60A20152a2D3D06d36F8B5703c'],
}

export const getDefaultTokenTrade = (protocol: ProtocolEnum) =>
  TOKEN_TRADE_SUPPORT[protocol][Object.keys(TOKEN_TRADE_SUPPORT[protocol])[0]]

export const getTokenTradeList = (protocol: ProtocolEnum) => Object.values(TOKEN_TRADE_SUPPORT[protocol])

export const getDefaultTokenOptions = (protocol: ProtocolEnum) =>
  Object.keys(TOKEN_TRADE_SUPPORT[protocol]).map((key) => ({
    id: key,
    label: TOKEN_TRADE_SUPPORT[protocol][key]?.symbol,
    value: key,
  }))
export const getTokenOptions = ({
  protocol,
  ignoredAll,
}: {
  protocol: ProtocolEnum
  ignoredAll?: boolean
}): TokenOptionProps[] =>
  ignoredAll ? getDefaultTokenOptions(protocol) : [ALL_OPTION, ...getDefaultTokenOptions(protocol)]

export const TIMEFRAME_NAMES = {
  // Minutes
  5: 'M5',
  15: 'M15',
  30: 'M30',
  60: 'H1',
  240: 'H4',
  1440: 'D1',
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
