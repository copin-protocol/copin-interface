import { isMobile } from 'hooks/helpers/useIsMobile'

import {
  CopyTradePlatformEnum,
  HlOrderStatusEnum,
  PerpChartTypeEnum,
  ProtocolEnum,
  SubscriptionPlanEnum,
} from './enums'

export const SUPPORTED_LOCALES = ['en']
export const DEFAULT_LOCALE = 'en'

export const API_URL = import.meta.env.VITE_API
export const NETWORK = import.meta.env.VITE_NETWORK_ENV
export const BUILD_MODE = import.meta.env.VITE_BUILD_MODE
export const APP_URL = import.meta.env.VITE_URL
export const SOCKET_API_KEY = import.meta.env.VITE_SOCKET_API_KEY
export const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID!

export const TELEGRAM_BOT_ALERT = import.meta.env.VITE_TELEGRAM_BOT_ALERT
export const SYMBOL_ALLOWED_ALL = '*'

export const PROFILE_BREAKPOINT_XL = 1785

export const LINKS = {
  website: 'https://copin.io',
  blog: 'https://blog.copin.io',
  webapp: 'https://app.copin.io',
  arbitrumExplorer: 'https://arbiscan.io',
  gmxHouse: 'https://www.gmx.house/arbitrum',
  tradeGMX: 'https://gmx.io/#/?ref=copin',
  tradeGMXv2: 'https://gmx.io/#/?ref=copin',
  tradeGMXSol: 'https://gmxsolana.io/trade?ref=copin',
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
  // telegramAI: 'https://t.me/+al7aD8DB8pNjYjM1',
  telegramAI: 'https://t.me/copin_ai',
  telegram: 'https://t.me/Copin_io',
  baseTelegram: 'https://t.me',
  docs: 'https://docs.copin.io/',
  policy: 'https://docs.copin.io/another/privacy-policy',
  termOfUse: 'https://docs.copin.io/another/terms-of-service',
  riskDisclaimer: 'https://docs.copin.io/another/risk-disclaimer',
  upgradePremium: 'https://docs.copin.io/upgrade-to-premium',
  referralProgram: 'https://docs.copin.io/features/referral-program',
  registerBingX: 'https://bingx.com/en-us/invite/DY5QNN',
  registerBitget: 'https://partner.bitget.online/bg/HPM3BN',
  registerBinance: 'https://accounts.binance.com/register?ref=19902233',
  registerBybit: 'https://partner.bybitglobal.com/b/COPIN',
  registerOKX: 'https://www.okx.com/join/75651458',
  registerGate: 'https://www.gate.io/signup/AgBFAApb?ref_type=103',
  registerHyperliquid: 'https://app.hyperliquid.xyz/join/COPIN',
  registerApex: 'https://deeplink.omni.apex.exchange/AFF-6966',
  getCEXAPIKey: 'https://docs.copin.io/features/centralized-copy-trading-ccp',
  getBingXAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bingx-api',
  getBitgetAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bitget-api',
  getBybitAPIKey: 'https://docs.copin.io/features/copy-trading/connect-bybit-api',
  getOKXAPIKey: 'https://docs.copin.io/features/copy-trading/connect-okx-api',
  getGateAPIKey: 'https://docs.copin.io/features/copy-trading/connect-gate-api',
  getHyperliquidAPIKey: 'https://docs.copin.io/features/decentralized-copy-trading-dcp/connect-hyperliquid-api',
  getApexAPIKey: 'https://docs.copin.io/features/decentralized-copy-trading-dcp/connect-apex',
  feeStructureDocs: 'https://docs.copin.io/features/decentralized-copy-trading-dcp/fees-structure',
  notice: 'https://copin.substack.com/p/copin-profile-login-updates-road',
  bingXGuarantee:
    'https://support.bingx.com/hc/en-001/articles/21313115553945-Perpetual-Futures-Exclusive-Guaranteed-Price-Launched-to-Prevent-Slippage-Losses',
  agreement: 'https://docs.copin.io/another/agreement',
  subscriptionDocument: 'https://docs.copin.io/subscription-plan',
  copinEliteClub: 'https://docs.copin.io/welcome/copin-elite-club',
  support: 'https://t.me/leecopin',
  feedback: 'https://copin.canny.io',
  duneUrl: 'https://dune.com/copin',
  vaultTerms: 'https://docs.copin.io/another/terms-of-vault',
  vaultQA: 'https://docs.copin.io/another/q-and-a-of-vault',
  fungiesSubscriptionManagement: 'https://pay.copin.io/portal/subscriptions',
  arkhamAddress: 'https://intel.arkm.com/explorer/address',
  debankAddress: 'https://debank.com/profile',
  hyperformance: 'https://hyperformance.xyz/trade?',
}

export const NAVBAR_HEIGHT = 56
export const PAGE_TITLE_HEIGHT = 48
export const TAB_HEIGHT = 40
export const FOOTER_HEIGHT = 40
export const LITE_TABLE_HEIGHT = 312
export const BASE_LINE_HEIGHT = 20

export const FONT_FAMILY = 'ABC Social Mono'
export const DATE_FORMAT = 'YYYY/MM/DD'
export const DATE_TEXT_FORMAT = 'DD MMM, YYYY'
export const TIME_FORMAT = 'HH:mm:ss'
export const DAYJS_FULL_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss'
export const DAYJS_FULL_DATE_MS_FORMAT = 'YYYY/MM/DD HH:mm:ss:SSS'
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
export const DYDX_TX_HASH_REGEX = /^([a-fA-F0-9]{64})$/
export const SOLANA_TX_HASH_REGEX = /^[1-9A-HJ-NP-Za-km-z]{88}$/
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
export const SPECIAL_SYMBOLS_REGEX = /[!@#$%^&*()+\-=\[\]{};:'",.<>?/\\|`~]/g

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
export const MIN_REFERRAL_CODE_LENGTH = 6
export const MAX_REFERRAL_CODE_LENGTH = 20

export const WALLET_NAME_MAX_LENGTH = 32

export const RISK_LEVERAGE = 20

export const MAX_PAGE_LIMIT = 500
export const MAX_LIST_DATA_LIMIT = 10_000

export const MAX_LIMIT = 500
export const MAX_PERPDEX_ISSUE_DESCRIPTION = 800

export const HYPERLIQUID_BUILDER_CODE = '0x055ba87dbff972e23bcf26ea4728c31e05240e66'
export const HYPERLIQUID_BUILDER_MAX_FEES = '0.1%'

export const DISABLED_FIELDS: Partial<Record<ProtocolEnum, string[]>> = {
  [ProtocolEnum.HYPERLIQUID]: ['pnl', 'roi', 'avgRoi', 'maxRoi'],
}

export const BOOKMARK_NO_GROUP_KEY = 'others'
export const BOOKMARK_GROUP_NAME_MAX_LENGTH = 20

export const SUBSCRIPTION_COLLECTION_URL =
  NETWORK === 'devnet'
    ? 'https://testnets.opensea.io/collection/copin-subscription-3'
    : 'https://opensea.io/collection/copin-subscription'

export const MAX_TRADER_ALERT_BASIC = 20
export const MAX_TRADER_ALERT_PREMIUM = 50
export const MAX_TRADER_ALERT_VIP = 100

export const VOLUME_LIMIT = 20000

export const EXCHANGE_STATS = [
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.HYPERLIQUID,
  CopyTradePlatformEnum.GNS_V8,
  CopyTradePlatformEnum.APEX,
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
  [CopyTradePlatformEnum.HYPERLIQUID]: '#86DCC8',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: '#9573F7',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: '#9573F7',
  [CopyTradePlatformEnum.GNS_V8]: '#4AF994',
  [CopyTradePlatformEnum.GMX]: '#E978F3',
  [CopyTradePlatformEnum.APEX]: '#FADFA9',
}

export const CEX_EXCHANGES = [
  CopyTradePlatformEnum.BINANCE,
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.HYPERLIQUID,
  CopyTradePlatformEnum.APEX,
]

export const DCP_EXCHANGES: CopyTradePlatformEnum[] = [
  CopyTradePlatformEnum.GNS_V8,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.SYNTHETIX_V3,
]

export const WAITLIST_EXCHANGES: CopyTradePlatformEnum[] = [CopyTradePlatformEnum.BINANCE]

export const DEPRECATED_EXCHANGES = [CopyTradePlatformEnum.SYNTHETIX_V2, CopyTradePlatformEnum.SYNTHETIX_V3]

export const UNLIMITED_COPY_SIZE_EXCHANGES: CopyTradePlatformEnum[] = [
  CopyTradePlatformEnum.GNS_V8,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.SYNTHETIX_V3,
  CopyTradePlatformEnum.HYPERLIQUID,
]

export const GAINS_TRADE_PROTOCOLS = [
  ProtocolEnum.GNS,
  ProtocolEnum.GNS_POLY,
  ProtocolEnum.GNS_BASE,
  ProtocolEnum.GNS_APE,
]
export const GMX_V1_PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.GMX_AVAX]

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

export const DEFAULT_PROTOCOL = ProtocolEnum.GMX

// TODO: Check when add new protocol
export const RELEASED_PROTOCOLS =
  BUILD_MODE === 'production'
    ? [
        ProtocolEnum.GMX,
        ProtocolEnum.KWENTA,
        ProtocolEnum.POLYNOMIAL,
        ProtocolEnum.POLYNOMIAL_L2,
        ProtocolEnum.GMX_V2_AVAX,
        ProtocolEnum.GMX_V2,
        ProtocolEnum.GMX_SOL,
        ProtocolEnum.GNS,
        ProtocolEnum.GNS_POLY,
        ProtocolEnum.GNS_BASE,
        ProtocolEnum.GNS_APE,
        ProtocolEnum.LEVEL_BNB,
        ProtocolEnum.LEVEL_ARB,
        ProtocolEnum.MUX_ARB,
        ProtocolEnum.APOLLOX_BNB,
        ProtocolEnum.AVANTIS_BASE,
        ProtocolEnum.EQUATION_ARB,
        ProtocolEnum.LOGX_BLAST,
        ProtocolEnum.LOGX_MODE,
        ProtocolEnum.MYX_ARB,
        ProtocolEnum.MYX_LINEA,
        ProtocolEnum.MYX_OPBNB,
        ProtocolEnum.DEXTORO,
        ProtocolEnum.VELA_ARB,
        ProtocolEnum.HMX_ARB,
        ProtocolEnum.SYNTHETIX_V3,
        ProtocolEnum.SYNTHETIX_V3_ARB,
        ProtocolEnum.KTX_MANTLE,
        ProtocolEnum.CYBERDEX,
        ProtocolEnum.YFX_ARB,
        ProtocolEnum.KILOEX_OPBNB,
        ProtocolEnum.KILOEX_BNB,
        ProtocolEnum.KILOEX_MANTA,
        ProtocolEnum.KILOEX_BASE,
        ProtocolEnum.ROLLIE_SCROLL,
        ProtocolEnum.MUMMY_FANTOM,
        ProtocolEnum.HYPERLIQUID,
        ProtocolEnum.SYNFUTURE_BASE,
        ProtocolEnum.MORPHEX_FANTOM,
        ProtocolEnum.PERENNIAL_ARB,
        ProtocolEnum.BSX_BASE,
        ProtocolEnum.DYDX,
        ProtocolEnum.UNIDEX_ARB,
        ProtocolEnum.VERTEX_ARB,
        ProtocolEnum.HORIZON_BNB,
        ProtocolEnum.HOLDSTATION_ZKSYNC,
        ProtocolEnum.HOLDSTATION_BERA,
        ProtocolEnum.ZENO_METIS,
        ProtocolEnum.LINEHUB_LINEA,
        ProtocolEnum.BMX_BASE,
        ProtocolEnum.FOXIFY_ARB,
        ProtocolEnum.APOLLOX_BASE,
        ProtocolEnum.GMX_AVAX,
        ProtocolEnum.SYNTHETIX,
        ProtocolEnum.DEPERP_BASE,
        ProtocolEnum.ELFI_ARB,
        ProtocolEnum.PINGU_ARB,
        ProtocolEnum.JUPITER,
        ProtocolEnum.OSTIUM_ARB,
      ]
    : Object.values(ProtocolEnum)

// TODO: Check when add new protocol copy-trade
export const ALLOWED_COPYTRADE_PROTOCOLS = [
  ProtocolEnum.GMX_AVAX,
  ProtocolEnum.GMX,
  ProtocolEnum.GMX_V2_AVAX,
  ProtocolEnum.GMX_V2,
  ProtocolEnum.KWENTA,
  ProtocolEnum.POLYNOMIAL,
  ProtocolEnum.POLYNOMIAL_L2,
  ProtocolEnum.GNS,
  ProtocolEnum.GNS_POLY,
  ProtocolEnum.GNS_BASE,
  ProtocolEnum.GNS_APE,
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
  ProtocolEnum.APOLLOX_BASE,
  ProtocolEnum.KILOEX_OPBNB,
  ProtocolEnum.KILOEX_BASE,
  ProtocolEnum.ROLLIE_SCROLL,
  ProtocolEnum.MUMMY_FANTOM,
  ProtocolEnum.MORPHEX_FANTOM,
  ProtocolEnum.FOXIFY_ARB,
  ProtocolEnum.BMX_BASE,
  ProtocolEnum.HOLDSTATION_ZKSYNC,
  ProtocolEnum.UNIDEX_ARB,
]
export const NO_TX_HASH_PROTOCOLS = [ProtocolEnum.HYPERLIQUID]
export const FEE_WITH_FUNDING_PROTOCOLS = [
  ProtocolEnum.HYPERLIQUID,
  ProtocolEnum.BSX_BASE,
  ProtocolEnum.DYDX,
  ProtocolEnum.VERTEX_ARB,
  ProtocolEnum.IDEX,
  ProtocolEnum.POLYNOMIAL_L2,
  ProtocolEnum.JOJO_BASE,
]
export const COLLATERAL_TOKEN_PROTOCOLS: ProtocolEnum[] = []

export const LIST_PERP_DEX_BASIC_CHARTS = [
  PerpChartTypeEnum.VOLUME,
  PerpChartTypeEnum.ACTIVE_USER,
  PerpChartTypeEnum.REVENUE,
  PerpChartTypeEnum.LIQUIDATIONS,
  PerpChartTypeEnum.NET_PNL,
  PerpChartTypeEnum.PROFIT_LOSS,
]

export const SUBSCRIPTION_PLAN_ORDER = [
  SubscriptionPlanEnum.ELITE,
  SubscriptionPlanEnum.PRO,
  SubscriptionPlanEnum.STARTER,
  SubscriptionPlanEnum.FREE,
  SubscriptionPlanEnum.NON_LOGIN,
]

export const IGNORE_SUBSCRIPTION_ICON = [SubscriptionPlanEnum.NON_LOGIN, SubscriptionPlanEnum.FREE]

export const IGNORED_REASON_HL_ORDER_STATUS = [
  HlOrderStatusEnum.OPEN,
  HlOrderStatusEnum.FILLED,
  HlOrderStatusEnum.TRIGGERED,
  HlOrderStatusEnum.CANCELED,
  HlOrderStatusEnum.REJECTED,
]
