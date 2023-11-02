import { CopyTradePlatformEnum, CurrencyEnum } from './enums'

export const CURRENCY_PLATFORMS: Record<CopyTradePlatformEnum, CurrencyEnum> = {
  [CopyTradePlatformEnum.GMX]: CurrencyEnum.USDC,
  [CopyTradePlatformEnum.SYNTHETIX]: CurrencyEnum.SUSD,
  [CopyTradePlatformEnum.BINGX]: CurrencyEnum.USD,
}
