import { ARBITRUM_MAINNET, CHAINS, DEFAULT_CHAIN_ID } from 'utils/web3/chains'

import { getExchangeKey, parseExchangeImage } from '../helpers/transform'
import { LINKS } from './constants'
import { CopyTradePlatformEnum, CurrencyEnum } from './enums'
import { PLATFORM_TEXT_TRANS } from './translations'

export const CURRENCY_PLATFORMS: Record<CopyTradePlatformEnum, CurrencyEnum> = {
  [CopyTradePlatformEnum.OTHERS]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.GMX]: CurrencyEnum.USDC,
  [CopyTradePlatformEnum.SYNTHETIX_V2]: CurrencyEnum.SUSD,
  [CopyTradePlatformEnum.SYNTHETIX_V3]: CurrencyEnum.USDC,
  [CopyTradePlatformEnum.GNS_V8]: CurrencyEnum.USDC,
  [CopyTradePlatformEnum.BINGX]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.BITGET]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.BINANCE]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.BYBIT]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.OKX]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.GATE]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.APEX]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.HYPERLIQUID]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.COPIN_HYPERLIQUID]: CurrencyEnum.USD,
}

export const WATCHER_PLATFORMS = {
  [CopyTradePlatformEnum.BINGX]: '',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'https://watcher.synthetix.io',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: '',
  [CopyTradePlatformEnum.GMX]: '',
  [CopyTradePlatformEnum.GNS_V8]: '',
}

export const EXPLORER_PLATFORMS = {
  [CopyTradePlatformEnum.APEX]: '',
  [CopyTradePlatformEnum.BINGX]: '',
  [CopyTradePlatformEnum.BITGET]: '',
  [CopyTradePlatformEnum.BINANCE]: '',
  [CopyTradePlatformEnum.BYBIT]: '',
  [CopyTradePlatformEnum.OKX]: '',
  [CopyTradePlatformEnum.GATE]: '',
  [CopyTradePlatformEnum.HYPERLIQUID]: '',
  [CopyTradePlatformEnum.COPIN_HYPERLIQUID]: '',
  [CopyTradePlatformEnum.OTHERS]: '',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: CHAINS[DEFAULT_CHAIN_ID].blockExplorerUrl,
  [CopyTradePlatformEnum.SYNTHETIX_V3]: CHAINS[DEFAULT_CHAIN_ID].blockExplorerUrl,
  [CopyTradePlatformEnum.GMX]: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  [CopyTradePlatformEnum.GNS_V8]: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
}

interface ExchangeInfo {
  linkRegister: string
  linkTutorial: string
  name: string
  key: string
  imageUrl: string
  referralCode: string
}
export const EXCHANGES_INFO: { [key: string]: ExchangeInfo } = {
  [CopyTradePlatformEnum.BINGX]: {
    linkRegister: LINKS.registerBingX,
    linkTutorial: LINKS.getBingXAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.BINGX],
    key: getExchangeKey(CopyTradePlatformEnum.BINGX),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.BINGX),
    referralCode: 'DY5QNN',
  },
  [CopyTradePlatformEnum.BITGET]: {
    linkRegister: LINKS.registerBitget,
    linkTutorial: LINKS.getBitgetAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.BITGET],
    key: getExchangeKey(CopyTradePlatformEnum.BITGET),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.BITGET),
    referralCode: '1qlg',
  },
  [CopyTradePlatformEnum.BINANCE]: {
    linkRegister: LINKS.registerBinance,
    linkTutorial: LINKS.getCEXAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.BINANCE],
    key: getExchangeKey(CopyTradePlatformEnum.BINANCE),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.BINANCE),
    referralCode: '19902233',
  },
  [CopyTradePlatformEnum.BYBIT]: {
    linkRegister: LINKS.registerBybit,
    linkTutorial: LINKS.getBybitAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.BYBIT],
    key: getExchangeKey(CopyTradePlatformEnum.BYBIT),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.BYBIT),
    referralCode: 'COPIN',
  },
  [CopyTradePlatformEnum.OKX]: {
    linkRegister: LINKS.registerOKX,
    linkTutorial: LINKS.getOKXAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.OKX],
    key: getExchangeKey(CopyTradePlatformEnum.OKX),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.OKX),
    referralCode: '75651458',
  },
  [CopyTradePlatformEnum.GATE]: {
    linkRegister: LINKS.registerGate,
    linkTutorial: LINKS.getGateAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.GATE],
    key: getExchangeKey(CopyTradePlatformEnum.GATE),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.GATE),
    referralCode: 'AgBFAApb',
  },
  [CopyTradePlatformEnum.HYPERLIQUID]: {
    linkRegister: LINKS.registerHyperliquid,
    linkTutorial: LINKS.getHyperliquidAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.HYPERLIQUID],
    key: getExchangeKey(CopyTradePlatformEnum.HYPERLIQUID),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.HYPERLIQUID),
    referralCode: 'COPIN',
  },
  [CopyTradePlatformEnum.GNS_V8]: {
    linkRegister: '',
    linkTutorial: '',
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.GNS_V8],
    key: getExchangeKey(CopyTradePlatformEnum.GNS_V8),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.GNS_V8),
    referralCode: '',
  },
  [CopyTradePlatformEnum.SYNTHETIX_V2]: {
    linkRegister: '',
    linkTutorial: '',
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.SYNTHETIX_V2],
    key: getExchangeKey(CopyTradePlatformEnum.SYNTHETIX_V2),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.SYNTHETIX_V2),
    referralCode: '',
  },
  [CopyTradePlatformEnum.SYNTHETIX_V3]: {
    linkRegister: '',
    linkTutorial: '',
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.SYNTHETIX_V3],
    key: getExchangeKey(CopyTradePlatformEnum.SYNTHETIX_V3),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.SYNTHETIX_V3),
    referralCode: '',
  },
  [CopyTradePlatformEnum.APEX]: {
    linkRegister: LINKS.registerApex,
    linkTutorial: LINKS.getApexAPIKey,
    name: PLATFORM_TEXT_TRANS[CopyTradePlatformEnum.APEX],
    key: getExchangeKey(CopyTradePlatformEnum.APEX),
    imageUrl: parseExchangeImage(CopyTradePlatformEnum.APEX),
    referralCode: '6966',
  },
}
