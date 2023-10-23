export enum ProtocolEnum {
  GMX = 'GMX',
  KWENTA = 'KWENTA',
}

export enum UserRoleEnum {
  GUEST = 'guest',
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export enum TimeFrameEnum {
  A_WEEK = 'D7',
  TWO_WEEK = 'D15',
  A_MONTH = 'D30',
  TWO_MONTH = 'D60',
}

export enum TimeFilterByEnum {
  S7_DAY = TimeFrameEnum.A_WEEK,
  S14_DAY = TimeFrameEnum.TWO_WEEK,
  S30_DAY = TimeFrameEnum.A_MONTH,
  S60_DAY = TimeFrameEnum.TWO_MONTH,
}

export enum TopCollectionSortByEnum {
  S1_DAY = 'collectionVolumeStat.s1day',
  S7_DAY = 'collectionVolumeStat.s7day',
  S30_DAY = 'collectionVolumeStat.s30day',
  ALL = 'collectionVolumeStat.sAllDay',
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
  D1 = '1D',
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
