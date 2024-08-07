import { ARBITRUM_MAINNET, CHAINS, DEFAULT_CHAIN_ID } from 'utils/web3/chains'

import { CopyTradePlatformEnum, CurrencyEnum } from './enums'

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
}

export const WATCHER_PLATFORMS = {
  [CopyTradePlatformEnum.BINGX]: '',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'https://watcher.synthetix.io',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: '',
  [CopyTradePlatformEnum.GMX]: '',
  [CopyTradePlatformEnum.GNS_V8]: '',
}

export const EXPLORER_PLATFORMS = {
  [CopyTradePlatformEnum.BINGX]: '',
  [CopyTradePlatformEnum.BITGET]: '',
  [CopyTradePlatformEnum.BINANCE]: '',
  [CopyTradePlatformEnum.BYBIT]: '',
  [CopyTradePlatformEnum.OKX]: '',
  [CopyTradePlatformEnum.GATE]: '',
  [CopyTradePlatformEnum.OTHERS]: '',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: CHAINS[DEFAULT_CHAIN_ID].blockExplorerUrl,
  [CopyTradePlatformEnum.SYNTHETIX_V3]: CHAINS[DEFAULT_CHAIN_ID].blockExplorerUrl,
  [CopyTradePlatformEnum.GMX]: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  [CopyTradePlatformEnum.GNS_V8]: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
}
