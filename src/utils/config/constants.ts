import { isMobile } from 'hooks/helpers/useIsMobile'

import { CopyTradePlatformEnum, ProtocolEnum } from './enums'

export const SUPPORTED_LOCALES = ['en']
export const DEFAULT_LOCALE = 'en'

export const NETWORK = import.meta.env.VITE_NETWORK_ENV
export const BUILD_MODE = import.meta.env.VITE_BUILD_MODE
export const APP_URL = import.meta.env.VITE_URL
export const SOCKET_API_KEY = import.meta.env.VITE_SOCKET_API_KEY

export const TELEGRAM_BOT_ALERT = import.meta.env.VITE_TELEGRAM_BOT_ALERT

export const LINKS = {
  website: 'https://copin.io',
  blog: 'https://blog.copin.io',
  webapp: 'https://app.copin.io',
  arbitrumExplorer: 'https://arbiscan.io',
  gmxHouse: 'https://www.gmx.house/arbitrum',
  tradeGMX: 'https://gmx.io/#/?ref=copin',
  tradeGMXv2: 'https://gmx.io/#/?ref=copin',
  tradeKwenta: 'https://kwenta.eth.limo/?ref=copin',
  tradeGains: 'https://gains.trade/trading',
  tradePolynomial: 'https://trade.polynomial.fi',
  tradeLevel: 'https://app.level.finance/',
  tradeBloom: 'https://bloom.trading/trade',
  tradeApolloX: 'https://apollox.finance',
  tradeAvantis: 'https://avantisfi.com/trade',
  tradeTigris: 'https://app.tigris.trade',
  tradeLogX: 'https://logx.trade',
  tradeMyx: 'https://app.myx.finance',
  tradeHmx: 'https://hmx.org/arbitrum/trade',
  tradeDexToro: 'https://trade.dextoro.com/market',
  tradeCyberDEX: 'https://www.cyberdex.xyz/trade',
  tradeYfx: 'https://app.yfx.com/#/en/trade/?chain=arbitrumOne',
  tradeKiloEx: 'https://app.kiloex.io/trade',
  tradeSynfutures: 'https://oyster.synfutures.com/#/market',
  github: 'https://github.com/copin-protocol',
  twitter: 'https://twitter.com/intent/follow?region=follow_link&screen_name=copin_io',
  discord: 'https://discord.gg/jaJu8USARd',
  telegram: 'https://t.me/Copin_io',
  baseTelegram: 'https://t.me',
  docs: 'https://docs.copin.io/',
  policy: 'https://docs.copin.io/another/privacy-policy',
  termOfUse: 'https://docs.copin.io/another/terms-of-service',
  upgradePremium: 'https://docs.copin.io/upgrade-to-premium',
  referralProgram: 'https://docs.copin.io/features/referral-program',
  registerBingX: 'https://bingx.com/en-us/invite/DY5QNN',
  registerBitget: 'https://partner.bitget.online/bg/HPM3BN',
  registerBinance: 'https://accounts.binance.com/register?ref=19902233',
  registerBybit: 'https://partner.bybitglobal.com/b/COPIN',
  registerOKX: 'https://www.okx.com/join/75651458',
  registerGate: 'https://www.gate.io/signup/AgBFAApb?ref_type=103',
  getBingXAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bingx-api',
  getBitgetAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bitget-api',
  getBybitAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bybit-api',
  getOKXAPIKey: 'https://docs.copin.io/features/copy-trading/connect-okx-api',
  getGateAPIKey: 'https://docs.copin.io/features/copy-trading/connect-gate-api',
  notice: 'https://copin.substack.com/p/copin-profile-login-updates-road',
  bingXGuarantee:
    'https://support.bingx.com/hc/en-001/articles/21313115553945-Perpetual-Futures-Exclusive-Guaranteed-Price-Launched-to-Prevent-Slippage-Losses',
  agreement: 'https://docs.copin.io/another/agreement',
  subscriptionDocument: 'https://docs.copin.io/subscription-plan',
  copinEliteClub: 'https://docs.copin.io/welcome/copin-elite-club',
  support: 'https://t.me/leecopin',
  feedback: 'https://copin.canny.io',
  duneUrl: 'https://dune.com/copin',
}

export const NAVBAR_HEIGHT = 64
export const FOOTER_HEIGHT = 40

export const FONT_FAMILY = 'Anuphan'
export const DATE_FORMAT = 'YYYY/MM/DD'
export const DATE_TEXT_FORMAT = 'DD MMM, YYYY'
export const TIME_FORMAT = 'HH:mm:ss'
export const DAYJS_FULL_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss'
export const DEFAULT_LIMIT = 20
export const DEFAULT_LIMIT_VALUES = [20, 50, 100]
export const SEARCH_DEFAULT_LIMIT = 30

export const MIN_PARSE_ETHER = 0.00000001
export const MIN_AMOUNT = 0.01
export const SEARCH_DEBOUNCE_TIME = 200 //ms

export const COUNTDOWN_TIME = 60 // s
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export const EVM_TX_HASH_REGEX = /^0x?([a-fA-F0-9]{64})$/

export const CHART_DAYS_DURATION = 30
export const CHART_DATE_FORMAT = 'DD.MM'
export const CHART_MIN_HEIGHT = 320
export const YAXIS_WIDTH = isMobile ? 50 : 85
export const MIN_TICK_GAP = 30

export const DELAY_SYNC = 3 * 1000 //milliseconds

export const RELOAD_TOP_OPENING_POSITIONS = 5 * 60 * 1000 //milliseconds

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 //mb

export const DEFAULT_COVER_IMAGE_URL = '/images/cover.png'

export const REFERRAL_CODE_LENGTH = 6

export const WALLET_NAME_MAX_LENGTH = 32

export const RISK_LEVERAGE = 20

export const SUBSCRIPTION_COLLECTION_URL =
  NETWORK === 'devnet'
    ? 'https://testnets.opensea.io/collection/copin-subscription-3'
    : 'https://opensea.io/collection/copin-subscription'

export const MAX_TRADER_ALERT_BASIC = 10
export const MAX_TRADER_ALERT_PREMIUM = 50

export const VOLUME_LIMIT = 20000

export const EXCHANGE_STATS = [
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.GNS_V8,
  // CopyTradePlatformEnum.OTHERS,
  // CopyTradePlatformEnum.BINANCE,
  // CopyTradePlatformEnum.SYNTHETIX,
  // CopyTradePlatformEnum.SYNTHETIX_V2,
  // CopyTradePlatformEnum.GMX,
]
export const EXCHANGE_COLOR: { [key: string]: string } = {
  [CopyTradePlatformEnum.OTHERS]: '#FCEFD1',
  [CopyTradePlatformEnum.BINGX]: '#4277FD',
  [CopyTradePlatformEnum.BITGET]: '#00F0FF',
  [CopyTradePlatformEnum.BINANCE]: '#FDBA0D',
  [CopyTradePlatformEnum.BYBIT]: '#FADFA0',
  [CopyTradePlatformEnum.OKX]: '#FFFFFF',
  [CopyTradePlatformEnum.GATE]: '#5DABEE',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: '#9573F7',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: '#9573F7',
  [CopyTradePlatformEnum.GNS_V8]: '#4AF994',
  [CopyTradePlatformEnum.GMX]: '#E978F3',
}

export const CEX_EXCHANGES = [
  CopyTradePlatformEnum.BINANCE,
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
]

export const DCP_EXCHANGES: CopyTradePlatformEnum[] = [
  CopyTradePlatformEnum.GNS_V8,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.SYNTHETIX_V3,
]

export const GAINS_TRADE_PROTOCOLS = [ProtocolEnum.GNS, ProtocolEnum.GNS_POLY]

export const DCP_SUPPORTED_PROTOCOLS = [
  ProtocolEnum.GMX_V2,
  ProtocolEnum.KWENTA,
  ProtocolEnum.GNS,
  ProtocolEnum.GNS_POLY,
  ProtocolEnum.AVANTIS_BASE,
  ProtocolEnum.EQUATION_ARB,
  ProtocolEnum.POLYNOMIAL,
  ProtocolEnum.DEXTORO,
  ProtocolEnum.CYBERDEX,
  ProtocolEnum.APOLLOX_BNB,
  ProtocolEnum.KILOEX_OPBNB,
  ProtocolEnum.HMX_ARB,
  ProtocolEnum.VELA_ARB,
  ProtocolEnum.ROLLIE_SCROLL,
  ProtocolEnum.MUMMY_FANTOM,
]

export const DEFAULT_PROTOCOL = ProtocolEnum.GNS

// TODO: Check when add new protocol
export const RELEASED_PROTOCOLS =
  BUILD_MODE === 'production'
    ? [
        ProtocolEnum.GMX,
        ProtocolEnum.KWENTA,
        ProtocolEnum.POLYNOMIAL,
        ProtocolEnum.GMX_V2,
        ProtocolEnum.GNS,
        ProtocolEnum.GNS_POLY,
        ProtocolEnum.LEVEL_BNB,
        ProtocolEnum.LEVEL_ARB,
        ProtocolEnum.MUX_ARB,
        ProtocolEnum.APOLLOX_BNB,
        ProtocolEnum.AVANTIS_BASE,
        ProtocolEnum.EQUATION_ARB,
        ProtocolEnum.LOGX_BLAST,
        ProtocolEnum.LOGX_MODE,
        ProtocolEnum.MYX_ARB,
        ProtocolEnum.DEXTORO,
        ProtocolEnum.VELA_ARB,
        ProtocolEnum.HMX_ARB,
        ProtocolEnum.SYNTHETIX_V3,
        ProtocolEnum.KTX_MANTLE,
        ProtocolEnum.CYBERDEX,
        ProtocolEnum.YFX_ARB,
        ProtocolEnum.KILOEX_OPBNB,
        ProtocolEnum.ROLLIE_SCROLL,
        ProtocolEnum.MUMMY_FANTOM,
        ProtocolEnum.HYPERLIQUID,
        ProtocolEnum.SYNFUTURE_BASE,
      ]
    : Object.values(ProtocolEnum)

// TODO: Check when add new protocol copy-trade
export const ALLOWED_COPYTRADE_PROTOCOLS = [
  ProtocolEnum.GMX,
  ProtocolEnum.GMX_V2,
  ProtocolEnum.KWENTA,
  ProtocolEnum.POLYNOMIAL,
  ProtocolEnum.GNS,
  ProtocolEnum.GNS_POLY,
  ProtocolEnum.MUX_ARB,
  ProtocolEnum.AVANTIS_BASE,
  ProtocolEnum.CYBERDEX,
  ProtocolEnum.DEXTORO,
  ProtocolEnum.VELA_ARB,
  ProtocolEnum.EQUATION_ARB,
  ProtocolEnum.HMX_ARB,
  ProtocolEnum.LEVEL_ARB,
  ProtocolEnum.LEVEL_BNB,
  ProtocolEnum.APOLLOX_BNB,
  ProtocolEnum.KILOEX_OPBNB,
  ProtocolEnum.ROLLIE_SCROLL,
  ProtocolEnum.MUMMY_FANTOM,
]
export const NO_TX_HASH_PROTOCOLS = [ProtocolEnum.HYPERLIQUID]
