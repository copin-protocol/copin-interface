export enum ProtocolEnum {
  GMX = 'GMX',
  GMX_AVAX = 'GMX_AVAX',
  KWENTA = 'KWENTA',
  POLYNOMIAL = 'POLYNOMIAL',
  GMX_V2 = 'GMX_V2',
  GMX_V2_AVAX = 'GMX_V2_AVAX',
  GMX_SOL = 'GMX_SOL',
  GNS = 'GNS',
  GNS_POLY = 'GNS_POLY',
  GNS_BASE = 'GNS_BASE',
  GNS_APE = 'GNS_APE',
  LEVEL_BNB = 'LEVEL_BNB',
  LEVEL_ARB = 'LEVEL_ARB',
  MUX_ARB = 'MUX_ARB',
  EQUATION_ARB = 'EQUATION_ARB',
  APOLLOX_BNB = 'APOLLOX_BNB',
  APOLLOX_BASE = 'APOLLOX_BASE',
  AVANTIS_BASE = 'AVANTIS_BASE',
  TIGRIS_ARB = 'TIGRIS_ARB',
  LOGX_BLAST = 'LOGX_BLAST',
  LOGX_MODE = 'LOGX_MODE',
  MYX_ARB = 'MYX_ARB',
  MYX_OPBNB = 'MYX_OPBNB',
  MYX_LINEA = 'MYX_LINEA',
  HMX_ARB = 'HMX_ARB',
  DEXTORO = 'DEXTORO',
  VELA_ARB = 'VELA_ARB',
  SYNTHETIX_V3_ARB = 'SYNTHETIX_V3_ARB',
  SYNTHETIX_V3 = 'SYNTHETIX_V3',
  SYNTHETIX = 'SYNTHETIX',
  COPIN = 'COPIN',
  KTX_MANTLE = 'KTX_MANTLE',
  CYBERDEX = 'CYBERDEX',
  YFX_ARB = 'YFX_ARB',
  KILOEX_OPBNB = 'KILOEX_OPBNB',
  KILOEX_BNB = 'KILOEX_BNB',
  KILOEX_MANTA = 'KILOEX_MANTA',
  KILOEX_BASE = 'KILOEX_BASE',
  ROLLIE_SCROLL = 'ROLLIE_SCROLL',
  PERENNIAL_ARB = 'PERENNIAL_ARB',
  MUMMY_FANTOM = 'MUMMY_FANTOM',
  MORPHEX_FANTOM = 'MORPHEX_FANTOM',
  HYPERLIQUID = 'HYPERLIQUID',
  SYNFUTURE_BASE = 'SYNFUTURE_BASE',
  DYDX = 'DYDX',
  BSX_BASE = 'BSX_BASE',
  UNIDEX_ARB = 'UNIDEX_ARB',
  VERTEX_ARB = 'VERTEX_ARB',
  LINEHUB_LINEA = 'LINEHUB_LINEA',
  FOXIFY_ARB = 'FOXIFY_ARB',
  BMX_BASE = 'BMX_BASE',
  DEPERP_BASE = 'DEPERP_BASE',
  HORIZON_BNB = 'HORIZON_BNB',
  IDEX = 'IDEX',
  HOLDSTATION_ZKSYNC = 'HOLDSTATION_ZKSYNC',
  HOLDSTATION_BERA = 'HOLDSTATION_BERA',
  POLYNOMIAL_L2 = 'POLYNOMIAL_L2',
  ZENO_METIS = 'ZENO_METIS',
  SYMMIO_BASE = 'SYMMIO_BASE',
  INTENTX_BASE = 'INTENTX_BASE',
  BASED_BASE = 'BASED_BASE',
  DERIVE = 'DERIVE',
  FULCROM_CRONOS = 'FULCROM_CRONOS',
  JOJO_BASE = 'JOJO_BASE',
  ELFI_ARB = 'ELFI_ARB',
  JUPITER = 'JUPITER',
  PERPETUAL_OP = 'PERPETUAL_OP',
  PINGU_ARB = 'PINGU_ARB',
  OSTIUM_ARB = 'OSTIUM_ARB',
}

export enum ProtocolFilterEnum {
  ALL = 'all',
  ALL_COPYABLE = 'copyable',
}

export enum PairFilterEnum {
  ALL = 'all',
}

export enum UserRoleEnum {
  GUEST = 'guest',
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export enum TimeFrameEnum {
  LAST_24H = 'L24H',
  A_DAY = 'D1',
  A_WEEK = 'D7',
  TWO_WEEK = 'D15',
  A_MONTH = 'D30',
  TWO_MONTH = 'D60',
  THREE_MONTH = 'D90',
  A_YEAR = 'D365',
  ALL_TIME = 'FULL',
}

export enum TimeFilterByEnum {
  LAST_24H = TimeFrameEnum.LAST_24H,
  S1_DAY = TimeFrameEnum.A_DAY,
  S7_DAY = TimeFrameEnum.A_WEEK,
  S14_DAY = TimeFrameEnum.TWO_WEEK,
  S30_DAY = TimeFrameEnum.A_MONTH,
  S60_DAY = TimeFrameEnum.TWO_MONTH,
  S90_DAY = TimeFrameEnum.THREE_MONTH,
  S365_DAY = TimeFrameEnum.A_YEAR,
  ALL_TIME = TimeFrameEnum.ALL_TIME,
}

export enum TraderStatusEnum {
  COPYING = 'COPYING',
  VAULT_COPYING = 'VAULT_COPYING',
}

export enum CopyTradeStatusEnum {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export enum CopyTradeTypeEnum {
  COPY_TRADER = 'COPY_TRADER',
  SELF_BOT_CONFIG = 'SELF_BOT_CONFIG',
  COPIN_VAULT = 'COPIN_VAULT',
}

export enum CopyTradeOrderTypeEnum {
  FULL_ORDER = 'FULL_ORDER',
  NOT_FULL_ORDER = 'NOT_FULL_ORDER',
}

export enum CopyTradePlatformEnum {
  APEX = 'APEX',
  OTHERS = 'OTHERS',
  GMX = 'GMX',
  BINGX = 'BINGX',
  BITGET = 'BITGET',
  BINANCE = 'BINANCE',
  BYBIT = 'BYBIT',
  OKX = 'OKX',
  GATE = 'GATE',
  SYNTHETIX_V2 = 'SYNTHETIX_V2',
  SYNTHETIX_V3 = 'SYNTHETIX_V3',
  GNS_V8 = 'GNS_V8',
  HYPERLIQUID = 'HYPERLIQUID',
  COPIN_HYPERLIQUID = 'COPIN_HYPERLIQUID',
}

export enum CopyTradeConfigTypeEnum {
  API_KEY = 'API_KEY',
  COPY_WALLET = 'COPY_WALLET',
  GLOBAL = 'GLOBAL',
}

export enum CopyPositionCloseTypeEnum {
  MANUAL = 'MANUAL',
  COPY_TRADE = 'COPY_TRADE',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
  LIQUIDATE = 'LIQUIDATE',
  STOP_COPY_TRADE = 'STOP_COPY_TRADE',
  OVERWRITE = 'OVERWRITE',
  FORCE_CLOSE = 'FORCE_CLOSE',
}

export enum PositionStatusEnum {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  LIQUIDATE = 'LIQUIDATE',
}

export enum PositionSideEnum {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum MarginModeEnum {
  ISOLATED = 'ISOLATED',
  CROSS = 'CROSS',
}

export enum PositionModeEnum {
  HEDGE = 'HEDGE',
  ONE_WAY = 'ONE_WAY',
}

export enum PerpDEXTypeEnum {
  INDEX = 'INDEX',
  ORDERBOOK = 'ORDERBOOK',
}

export enum HlOrderTypeEnum {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  DECREASE = 'DECREASE',
  INCREASE = 'INCREASE',
  LIQUIDATE = 'LIQUIDATE',
  MARGIN_TRANSFERRED = 'MARGIN_TRANSFERRED',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
}

export enum HlDirectionEnum {
  OPEN_LONG = 'Open Long',
  OPEN_SHORT = 'Open Short',
  CLOSE_LONG = 'Close Long',
  CLOSE_SHORT = 'Close Short',
  LONG_SHORT = 'Long > Short',
  SHORT_LONG = 'Short > Long',
}

export enum OrderTypeEnum {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  DECREASE = 'DECREASE',
  INCREASE = 'INCREASE',
  LIQUIDATE = 'LIQUIDATE',
  MARGIN_TRANSFERRED = 'MARGIN_TRANSFERRED',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
}

export enum HlInfoType {
  ALL_MIDS = 'allMids',
  META = 'meta',
  OPEN_ORDERS = 'openOrders',
  FRONTEND_OPEN_ORDERS = 'frontendOpenOrders',
  USER_FILLS = 'userFills',
  USER_FILLS_BY_TIME = 'userFillsByTime',
  USER_RATE_LIMIT = 'userRateLimit',
  ORDER_STATUS = 'orderStatus',
  L2_BOOK = 'l2Book',
  CANDLE_SNAPSHOT = 'candleSnapshot',
  PERPS_META_AND_ASSET_CTXS = 'metaAndAssetCtxs',
  PERPS_CLEARINGHOUSE_STATE = 'clearinghouseState',
  USER_FUNDING = 'userFunding',
  USER_NON_FUNDING_LEDGER_UPDATES = 'userNonFundingLedgerUpdates',
  FUNDING_HISTORY = 'fundingHistory',
  SPOT_META = 'spotMeta',
  SPOT_CLEARINGHOUSE_STATE = 'spotClearinghouseState',
  SPOT_META_AND_ASSET_CTXS = 'spotMetaAndAssetCtxs',
}

export enum SLTPTypeEnum {
  USD = 'USD',
  PERCENT = 'PERCENT',
}

export enum CopyTradeSideEnum {
  BOTH = 'BOTH',
  ONLY_LONG = 'ONLY_LONG',
  ONLY_SHORT = 'ONLY_SHORT',
}

export enum SortTypeEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export enum IntervalInMsEnum {
  SEC = 1,
  M1 = 60,
  M5 = 300,
  M15 = 900,
  M30 = 1800,
  H1 = 3600,
  H2 = 7200,
  H4 = 14400,
  H8 = 28800,
  D1 = 86400,
  D7 = 604800,
}

export enum TimeframeEnum { // Minutes
  M5 = 5,
  M15 = 15,
  H1 = 60,
  H4 = 240,
  D1 = 1440,
}

export enum CheckAvailableStatus {
  NOT_AVAILABLE = 'not_available',
  RUNNING = 'running',
  FINISH = 'finish',
  STOPPED = 'stopped',
}

export enum KeyNameEnum {
  ESCAPE = 'Escape',
  ENTER = 'Enter',
}

export enum SmartWalletCommand {
  OWNER_MODIFY_FUND = 0,
  OWNER_WITHDRAW_ETH = 1,
  OWNER_WITHDRAW_TOKEN = 2,
  PERP_CREATE_ACCOUNT = 3,
  PERP_MODIFY_COLLATERAL = 4,
  PERP_PLACE_ORDER = 5,
  PERP_CLOSE_ORDER = 6,
  PERP_CANCEL_ORDER = 7,
  PERP_WITHDRAW_ALL_MARGIN = 8,
  GELATO_CREATE_TASK = 9,
  GELATO_UPDATE_TASK = 10,
  GELETO_CANCEL_TASK = 11,
}

export enum CurrencyEnum {
  USD = 'USD',
  SUSD = 'sUSD',
  USDC = 'USDC',
}

export enum LeaderboardTypeEnum {
  WEEKLY = 'WEEK',
  MONTHLY = 'MONTH',
}

export enum TimeIntervalEnum {
  DAILY = 'daily',
  WEEKLY = 'week',
  MONTHLY = 'month',
}

export enum SubscriptionPlanEnum {
  NON_LOGIN = 'NON_LOGIN',
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ELITE = 'ELITE',
  IF = 'IF',
}

export enum MaxCopyTradeQuotaEnum {
  BASIC = 3,
}

export enum UserActionEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  CHANGE = 'CHANGE',
  DELETE = 'DELETE',
}

export enum DataTypeEnum {
  COPY_TRADE = 'COPY_TRADE',
  COPY_WALLET = 'COPY_WALLET',
  COPY_POSITION = 'COPY_POSITION',
}

export enum AlertTypeEnum {
  COPY_TRADE = 'COPY_TRADE',
  TRADERS = 'TRADER',
  CUSTOM = 'CUSTOM',
}

export enum AlertCustomType {
  'TRADER_FILTER' = 'TRADER_FILTER',
  'TRADER_GROUP' = 'TRADER_GROUP',
  'TRADER_POSITION' = 'TRADER_POSITION',
}

export enum AlertCategoryEnum {
  SYSTEM = 'SYSTEM',
  CUSTOM = 'CUSTOM',
}

export enum AlertSettingsEnum {
  TRADERS = 'TRADERS',
  TRIGGER = 'TRIGGER',
  CHANNEL = 'CHANNEL',
}

export enum ChannelTypeEnum {
  TELEGRAM = 'TELEGRAM',
  WEBHOOK = 'WEBHOOK',
}

export enum ChannelStatusEnum {
  OPERATIONAL = 'OPERATIONAL',
  SUSPENDED = 'SUSPENDED',
}

export enum ChangeFieldEnum {
  ACCOUNT = 'account',
  ACCOUNTS = 'accounts',
  MULTIPLE_COPY = 'multipleCopy',
  VOLUME = 'volume',
  LEVERAGE = 'leverage',
  TOKEN_ADDRESSES = 'tokenAddresses',
  EXCLUDING_TOKEN_ADDRESSES = 'excludingTokenAddresses',
  ENABLE_STOP_LOSS = 'enableStopLoss',
  STOP_LOSS_TYPE = 'stopLossType',
  STOP_LOSS_AMOUNT = 'stopLossAmount',
  LATEST_STOP_LOSS_ID = 'latestStopLossId',
  ENABLE_TAKE_PROFIT = 'enableTakeProfit',
  TAKE_PROFIT_AMOUNT = 'takeProfitAmount',
  TAKE_PROFIT_TYPE = 'takeProfitType',
  LATEST_TAKE_PROFIT_ID = 'latestTakeProfitId',
  VOLUME_PROTECTION = 'volumeProtection',
  LOOK_BACK_ORDERS = 'lookBackOrders',
  COPY_ALL = 'copyAll',
  REVERSE_COPY = 'reverseCopy',
  MAX_VOL_MULTIPLIER = 'maxVolMultiplier',
  SKIP_LOW_LEVERAGE = 'skipLowLeverage',
  SKIP_LOW_COLLATERAL = 'skipLowCollateral',
  SKIP_LOW_SIZE = 'skipLowSize',
  TITLE = 'title',
  STATUS = 'status',
  CLOSE_TYPE = 'closeType',
  ENTRY_PRICE = 'entryPrice',
  PNL = 'pnl',
  SIZE_DELTA = 'sizeDelta',
  TOTAL_SIZE_DELTA = 'totalSizeDelta',
  SOURCE_SIZE_DELTA = 'sourceSizeDelta',
  STOP_LOSS_DETAIL = 'stopLossDetail',
  TAKE_PROFIT_DETAIL = 'takeProfitDetail',
  QUANTITY = 'quantity',
  STOP_PRICE = 'stopPrice',
  TAKE_PROFIT_PRICE = 'takeProfitPrice',
  SIDE = 'side',
  POSITION_SIDE = 'positionSide',
  BALANCE = 'balance',
  AVAILABLE_BALANCE = 'availableBalance',
  NAME = 'name',
  EXCHANGE = 'EXCHANGE',
  BINGX = 'BINGX',
  SMART_WALLET_ADDRESS = 'SMART_WALLET_ADDRESS',
  COPY_VOLUME = 'COPY_VOLUME',
  ACTIVE_COPY = 'ACTIVE_COPY',
  TYPE = 'type',
}

export enum RewardSymbolEnum {
  USD = 'USD',
  ARB = 'ARB',
}

export enum EventTypeEnum {
  CEX = 'CEX',
  GNS = 'GNS',
}

export enum EpochStatusEnum {
  NOT_HAPPEN = 0,
  ONGOING = 1,
  ENDED = 2,
  AWARDED = 3,
}

export enum FeeRateTraderStatus {
  CLAIMED,
  CLAIMABLE,
  WAITING,
}

export enum CopierLeaderBoardExchangeType {
  ALL_CEX = 'ALL_CEX',
  ALL_DEX = 'ALL_DEX',
  TOTAL = 'TOTAL',
}

export enum CopierLeaderboardTimeFilterEnum {
  DAILY = 'DAILY',
  YESTERDAY = 'YESTERDAY',
  D7 = 'D7',
  D30 = 'D30',
  D60 = 'D60',
  FULL = 'FULL',
}

export enum ProtocolSortByEnum {
  ALPHABET = 'ALPHABET',
  TRADERS = 'TRADERS',
  OI = 'OI',
}

export enum ReferralTierEnum {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
  TIER_4 = 'TIER_4',
  TIER_5 = 'TIER_5',
  TIER_6 = 'TIER_6',
}

export enum ReferralTypeEnum {
  F0 = 'F0',
  F1 = 'F1',
  F2 = 'F2',
}

export enum ReferralHistoryStatusEnum {
  PENDING = 'PENDING',
  CLAIMABLE = 'CLAIMABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  CLAIMED = 'CLAIMED',
}

export enum ClaimRewardStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  CLAIMED = 'CLAIMED',
  FAILURE = 'FAILURE',
}

export enum ReferralActivityTypeEnum {
  COMMISSION = 'COMMISSION',
  INVITE = 'INVITE',
}

export enum ActionTypeEnum {
  SET_SLTP = 'SET_SLTP',
}

export const ACTION_NAMES = {
  [ActionTypeEnum.SET_SLTP]: 'Set SL / TP',
}

export enum WaitlistTypeEnum {
  ANALYZE_WITH_AI = 'ANALYZE_WITH_AI',
}

export enum PerpChartTypeEnum {
  VOLUME = 'VOLUME',
  ACTIVE_USER = 'ACTIVE_USER',
  REVENUE = 'REVENUE',
  LIQUIDATIONS = 'LIQUIDATIONS',
  NET_PNL = 'NET_PNL',
  PROFIT_LOSS = 'PROFIT_LOSS',
  TOP_VOLUME_BY_PAIRS = 'TOP_VOLUME_BY_PAIRS',
  TOP_PROFIT_AND_LOSS_BY_PAIRS = 'TOP_PROFIT_AND_LOSS_BY_PAIRS',
  TOP_OI_BY_PAIRS = 'TOP_OI_BY_PAIRS',
  HOURLY_CHART = 'HOURLY_CHART',
}

export enum TraderLabelEnum {
  'SHORT_TERM' = 'SHORT_TERM',
  'MIDDLE_TERM' = 'MIDDLE_TERM',
  'LONG_TERM' = 'LONG_TERM',
  'TOP_PROFIT' = 'TOP_PROFIT',
  'SHARK_WHALE' = 'SHARK_WHALE',
  'HIGH_FREQUENCY' = 'HIGH_FREQUENCY',
  'WIN_STREAK' = 'WIN_STREAK',
  'TIER1_PAIRS' = 'TIER1_PAIRS',
  'ALTCOIN_PAIRS' = 'ALTCOIN_PAIRS',
  'MEME_PAIRS' = 'MEME_PAIRS',
}

export enum BulkUpdateActionEnum {
  'DELETE' = 'DELETE',
  'UPDATE' = 'UPDATE',
  'CLONE' = 'CLONE',
}

export enum SystemAlertTypeEnum {
  WARNING = 'warning',
  DANGER = 'danger',
  SUCCESS = 'success',
  INFO = 'info',
}
export enum SystemStatusSectionEnum {
  PROTOCOL_STATUS = 'PROTOCOL_STATUS',
  COPY_EXCHANGE_STATUS = 'COPY_EXCHANGE_STATUS',
  PAGE_STATUS = 'PAGE_STATUS',
}
export enum SystemStatusTypeEnum {
  STABLE = 'STABLE',
  UNSTABLE = 'UNSTABLE',
  CLOSED = 'CLOSED',
}
export enum ProtocolCopyTradeStatusEnum {
  COPYABLE = 'COPYABLE',
  UNCOPYABLE = 'UNCOPYABLE',
}
export enum SystemStatusPageEnum {
  OPEN_INTEREST = 'OPEN_INTEREST',
  LIVE_TRADES = 'LIVE_TRADES',
}

export enum SubscriptionPermission {
  // Data
  PROTOCOL = 'PROTOCOL',
  TRADER_EXPLORER = 'TRADER_EXPLORER',
  OPEN_INTEREST = 'OPEN_INTEREST',
  // MARKET_OVERVIEW = 'MARKET_OVERVIEW',
  // TRADER_BOARD = 'TRADER_BOARD',
  // COPIER_RANKING = 'COPIER_RANKING',
  // LATEST_ACTIVITIES = 'LATEST_ACTIVITIES',
  LIVE_TRADES = 'LIVE_TRADES',
  PERP_EXPLORER = 'PERP_EXPLORER',
  // TRADER_LABELED = 'TRADER_LABELED',
  // Trader detail
  TRADER_PROFILE = 'TRADER_PROFILE',
  // TRADER_OPENING_POSITION = 'TRADER_OPENING_POSITION',
  // TRADER_POSITION = 'TRADER_POSITION',
  // TRADER_STATISTIC = 'TRADER_STATISTIC', // Token statistic, ranking, position statistic
  // Trader action
  // BACK_TESTING = 'BACK_TESTING',
  TRADER_ALERT = 'TRADER_ALERT',
  // COMPARE_TRADER = 'COMPARE_TRADER',
  // COPY_TRADING = 'COPY_TRADING',
  USER = 'USER',
  // Copy wallet
  COPY_TRADING = 'COPY_TRADING',
  // Action
  // EXPORT_STATISTIC_DATA = 'EXPORT_STATISTIC_DATA',
}

export enum SubscriptionFeatureEnum {
  TRADER_EXPLORER = 'TRADER_EXPLORER',
  TRADER_FAVORITE = 'TRADER_FAVORITE',
  COPY_MANAGEMENT = 'COPY_MANAGEMENT',
  COPY_TRADE = 'COPY_TRADE',
  LIVE_TRADES = 'LIVE_TRADES',
  TRADER_PROFILE = 'TRADER_PROFILE',
  TRADER_ALERT = 'TRADER_ALERT',
  OPEN_INTEREST = 'OPEN_INTEREST',
  CEX_DEPTH = 'CEX_DEPTH',
  PERP_EXPLORER = 'PERP_EXPLORER',
}

export enum TRADER_LABEL_KEY {
  VOLUME = 'VOLUME',
  PNL = 'PNL',
  DURATION = 'DURATION',
  RISK = 'RISK',
  DIRECTIONAL_BIAS = 'DIRECTIONAL_BIAS',
  PERFORMANCE = 'PERFORMANCE',
}

export enum VOLUME_TIER_KEY {
  VOLUME_TIER1 = 'VOLUME_TIER1', // Shrimp: < $1K
  VOLUME_TIER2 = 'VOLUME_TIER2', // Fish: $1K - $10K
  VOLUME_TIER3 = 'VOLUME_TIER3', // Dolphin: $10K - $100K
  VOLUME_TIER4 = 'VOLUME_TIER4', // Shark: $100K - $1M
  VOLUME_TIER5 = 'VOLUME_TIER5', // Small Whale: $1M - $10M
  VOLUME_TIER6 = 'VOLUME_TIER6', // Whale: $10M - $100M
  VOLUME_TIER7 = 'VOLUME_TIER7', // Super Whale: $100M+
}
export enum PNL_TIER_KEY {
  PNL_TIER1 = 'PNL_TIER1', // Giga-Rekt: -$1M+
  PNL_TIER2 = 'PNL_TIER2', // Full Rekt: -$100K - $1M
  PNL_TIER3 = 'PNL_TIER3', // Semi-Rekt: -$10K - $100K
  PNL_TIER4 = 'PNL_TIER4', // Exit Liquidity: -$1K - $10K
  PNL_TIER5 = 'PNL_TIER5', // Humble Earner: -$100 - $1K
  PNL_TIER6 = 'PNL_TIER6', // Grinder: -$10 - $100
  PNL_TIER7 = 'PNL_TIER7', // Smart Money: $100K -> $1M
  PNL_TIER8 = 'PNL_TIER8', // Money Printer: $1M+
}

export enum DURATION_LABEL_KEY {
  SCALPER = 'SCALPER',
  DAY_TRADER = 'DAY_TRADER',
  SWING_TRADER = 'SWING_TRADER',
  POSITION_TRADER = 'POSITION_TRADER',
}
export enum RISK_LABEL_KEY {
  LOW_RISK = 'LOW_RISK',
  HIGH_RISK = 'HIGH_RISK',
}
export enum DIRECTIONAL_BIAS_LABEL_KEY {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
}
export enum PERFORMANCE_LABEL_KEY {
  CONSISTENT_WINNER = 'CONSISTENT_WINNER',
  ONE_HIT_WONDER = 'ONE_HIT_WONDER',
  HEAVY_LOSER = 'HEAVY_LOSER',
  RISING_STAR = 'RISING_STAR',
  WINNING_STREAK = 'WINNING_STREAK',
  LOSING_STREAK = 'LOSING_STREAK',
}

export const TRADER_LABELS: { key: TRADER_LABEL_KEY; labels: string[] }[] = [
  {
    key: TRADER_LABEL_KEY.VOLUME,
    labels: Object.values(VOLUME_TIER_KEY),
  },
  {
    key: TRADER_LABEL_KEY.PNL,
    labels: Object.values(PNL_TIER_KEY),
  },
  {
    key: TRADER_LABEL_KEY.DURATION,
    labels: Object.values(DURATION_LABEL_KEY),
  },
  {
    key: TRADER_LABEL_KEY.RISK,
    labels: Object.values(RISK_LABEL_KEY),
  },
  {
    key: TRADER_LABEL_KEY.DIRECTIONAL_BIAS,
    labels: Object.values(DIRECTIONAL_BIAS_LABEL_KEY),
  },
  {
    key: TRADER_LABEL_KEY.PERFORMANCE,
    labels: Object.values(PERFORMANCE_LABEL_KEY),
  },
]
