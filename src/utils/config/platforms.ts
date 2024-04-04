import { CopyTradePlatformEnum, CurrencyEnum } from './enums'

export const CURRENCY_PLATFORMS: Record<CopyTradePlatformEnum, CurrencyEnum> = {
  [CopyTradePlatformEnum.OTHERS]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.GMX]: CurrencyEnum.USDC,
  [CopyTradePlatformEnum.SYNTHETIX]: CurrencyEnum.SUSD,
  [CopyTradePlatformEnum.SYNTHETIX_V2]: CurrencyEnum.SUSD,
  [CopyTradePlatformEnum.BINGX]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.BITGET]: CurrencyEnum.USD,
  [CopyTradePlatformEnum.BINANCE]: CurrencyEnum.USD,
}
