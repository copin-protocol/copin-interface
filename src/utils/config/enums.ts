export enum ProtocolEnum {
  GMX = 'GMX',
  KWENTA = 'KWENTA',
  POLYNOMIAL = 'POLYNOMIAL',
  GMX_V2 = 'GMX_V2',
}

export enum UserRoleEnum {
  GUEST = 'guest',
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export enum TimeFrameEnum {
  A_DAY = 'D1',
  A_WEEK = 'D7',
  TWO_WEEK = 'D15',
  A_MONTH = 'D30',
  TWO_MONTH = 'D60',
  ALL_TIME = 'FULL',
}

export enum TimeFilterByEnum {
  S1_DAY = TimeFrameEnum.A_DAY,
  S7_DAY = TimeFrameEnum.A_WEEK,
  S14_DAY = TimeFrameEnum.TWO_WEEK,
  S30_DAY = TimeFrameEnum.A_MONTH,
  S60_DAY = TimeFrameEnum.TWO_MONTH,
  ALL_TIME = TimeFrameEnum.ALL_TIME,
}

export enum TraderStatusEnum {
  COPYING = 'COPYING',
}

export enum CopyTradeStatusEnum {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export enum CopyTradeTypeEnum {
  FULL_ORDER = 'FULL_ORDER',
  NOT_FULL_ORDER = 'NOT_FULL_ORDER',
}
export enum CopyTradePlatformEnum {
  GMX = 'GMX',
  BINGX = 'BINGX',
  SYNTHETIX = 'SYNTHETIX',
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

export enum SLTPTypeEnum {
  USD = 'USD',
  PERCENT = 'PERCENT',
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

export enum SmartAccountCommand {
  ACCOUNT_MODIFY_MARGIN = 0,
  ACCOUNT_WITHDRAW_ETH = 1,
  PERP_CANCEL_ORDER = 2,
  PERP_WITHDRAW_ALL_MARGIN = 3,
  PERP_MODIFY_MARGIN = 4,
  PERP_SUBMIT_CREATE_ORDER = 5,
  PERP_SUBMIT_CLOSE_ORDER = 6,
  DELEGATE_DEPOSIT_MARGIN = 7,
  DELEGATE_RELEASE_FEE = 8,
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

export enum SubscriptionPlanEnum {
  BASIC = 0,
  PREMIUM = 1,
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

export enum ChangeFieldEnum {
  VOLUME = 'volume',
  LEVERAGE = 'leverage',
  TOKEN_ADDRESSES = 'tokenAddresses',
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
  exchange = 'exchange',
  bingX = 'bingX',
  smartWalletAddress = 'smartWalletAddress',
  copyVolume = 'copyVolume',
  activeCopy = 'activeCopy',
}
