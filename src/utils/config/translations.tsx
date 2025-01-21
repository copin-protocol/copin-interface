// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ReactNode } from 'react'

import {
  AlertTypeEnum,
  ChainStatsEnum,
  ChangeFieldEnum,
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum, CopyTradeSideEnum,
  CopyTradeStatusEnum,
  DataTypeEnum,
  EpochStatusEnum,
  MarginModeEnum,
  OrderTypeEnum,
  PositionStatusEnum,
  SLTPTypeEnum,
  TelegramTypeEnum,
  TimeFilterByEnum,
  UserActionEnum
} from './enums'

type ObjectTrans = {
  [key: string]: ReactNode
}

export const POSITION_STATUS_TRANS: ObjectTrans = {
  [PositionStatusEnum.OPEN]: <Trans>Open</Trans>,
  [PositionStatusEnum.CLOSE]: <Trans>Closed</Trans>,
  [PositionStatusEnum.LIQUIDATE]: <Trans>Liquidated</Trans>,
}

export const ORDER_TYPE_TRANS: ObjectTrans = {
  [OrderTypeEnum.OPEN]: <Trans>Open</Trans>,
  [OrderTypeEnum.CLOSE]: <Trans>Close</Trans>,
  [OrderTypeEnum.INCREASE]: <Trans>Increase</Trans>,
  [OrderTypeEnum.DECREASE]: <Trans>Decrease</Trans>,
  [OrderTypeEnum.LIQUIDATE]: <Trans>Liquidation</Trans>,
  [OrderTypeEnum.STOP_LOSS]: <Trans>Stop Loss</Trans>,
  [OrderTypeEnum.TAKE_PROFIT]: <Trans>Take Profit</Trans>,
  [OrderTypeEnum.MARGIN_TRANSFERRED]: <Trans>Margin Transferred</Trans>,
}

export const COPY_POSITION_CLOSE_TYPE_TRANS: ObjectTrans = {
  [CopyPositionCloseTypeEnum.MANUAL]: <Trans>Manual</Trans>,
  [CopyPositionCloseTypeEnum.COPY_TRADE]: <Trans>Follow Trader</Trans>,
  [CopyPositionCloseTypeEnum.LIQUIDATE]: <Trans>Liquidation</Trans>,
  [CopyPositionCloseTypeEnum.STOP_LOSS]: <Trans>Stop Loss</Trans>,
  [CopyPositionCloseTypeEnum.TAKE_PROFIT]: <Trans>Take Profit</Trans>,
  [CopyPositionCloseTypeEnum.STOP_COPY_TRADE]: <Trans>Stop Copy</Trans>,
  [CopyPositionCloseTypeEnum.FORCE_CLOSE]: <Trans>Force Close</Trans>,
  [CopyPositionCloseTypeEnum.OVERWRITE]: <Trans>Overwrite</Trans>,
}

export const PLATFORM_TRANS: ObjectTrans = {
  [CopyTradePlatformEnum.OTHERS]: <Trans>Others</Trans>,
  [CopyTradePlatformEnum.BINGX]: <Trans>BingX</Trans>,
  [CopyTradePlatformEnum.BITGET]: <Trans>Bitget</Trans>,
  [CopyTradePlatformEnum.BINANCE]: <Trans>Binance</Trans>,
  [CopyTradePlatformEnum.OKX]: <Trans>OKX</Trans>,
  [CopyTradePlatformEnum.GATE]: <Trans>Gate</Trans>,
  [CopyTradePlatformEnum.HYPERLIQUID]: <Trans>Hyperliquid</Trans>,
  [CopyTradePlatformEnum.GMX]: <Trans>GMX</Trans>,
  [CopyTradePlatformEnum.SYNTHETIX_V2]: <Trans>Synthetix v2</Trans>,
  [CopyTradePlatformEnum.SYNTHETIX_V3]: <Trans>Synthetix v3</Trans>,
  [CopyTradePlatformEnum.GNS_V8]: <Trans>gTrade</Trans>,
}

export const PLATFORM_TEXT_TRANS: { [key: string]: string } = {
  [CopyTradePlatformEnum.OTHERS]: 'Others',
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.BITGET]: 'Bitget',
  [CopyTradePlatformEnum.BINANCE]: 'Binance',
  [CopyTradePlatformEnum.BYBIT]: 'Bybit',
  [CopyTradePlatformEnum.OKX]: 'OKX',
  [CopyTradePlatformEnum.GATE]: 'Gate',
  [CopyTradePlatformEnum.HYPERLIQUID]: 'Hyperliquid',
  [CopyTradePlatformEnum.GMX]: 'GMX',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'Synthetix v2',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: 'Synthetix v3',
  [CopyTradePlatformEnum.GNS_V8]: 'gTrade',
}

export const COPY_WALLET_TRANS: ObjectTrans = {
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.BITGET]: 'Bitget',
  [CopyTradePlatformEnum.BINANCE]: 'Binance',
  [CopyTradePlatformEnum.BYBIT]: 'Bybit',
  [CopyTradePlatformEnum.OKX]: 'OKX',
  [CopyTradePlatformEnum.GATE]: 'Gate',
  [CopyTradePlatformEnum.HYPERLIQUID]: 'Hyperliquid',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'SNX v2',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: 'SNX v3',
  [CopyTradePlatformEnum.GNS_V8]: 'gTrade',
}

export const COPY_TRADE_STATUS_TRANS: ObjectTrans = {
  [CopyTradeStatusEnum.RUNNING]: <Trans>RUNNING</Trans>,
  [CopyTradeStatusEnum.STOPPED]: <Trans>STOPPED</Trans>,
}

export const USER_ACTION_TRANS: ObjectTrans = {
  [UserActionEnum.CREATE]: <Trans>created</Trans>,
  [UserActionEnum.UPDATE]: <Trans>changed</Trans>,
  [UserActionEnum.CHANGE]: <Trans>changed</Trans>,
  [UserActionEnum.DELETE]: <Trans>deleted</Trans>,
}

export const DATA_TYPE_TRANS: ObjectTrans = {
  [DataTypeEnum.COPY_TRADE]: <Trans>copy-trade</Trans>,
  [DataTypeEnum.COPY_POSITION]: <Trans>copy position</Trans>,
  [DataTypeEnum.COPY_WALLET]: <Trans>copy wallet</Trans>,
}

export const SLTP_TYPE_TRANS: ObjectTrans = {
  [SLTPTypeEnum.USD]: 'USD',
  [SLTPTypeEnum.PERCENT]: '% ROI',
}

export const COPY_SIDE_TRANS: ObjectTrans = {
  [CopyTradeSideEnum.BOTH]: 'All',
  [CopyTradeSideEnum.ONLY_LONG]: 'Only Long',
  [CopyTradeSideEnum.ONLY_SHORT]: 'Only Short',
}

export const CHANGE_FIELD_TRANS: ObjectTrans = {
  [ChangeFieldEnum.VOLUME]: <Trans>Margin</Trans>,
  [ChangeFieldEnum.LEVERAGE]: <Trans>Leverage</Trans>,
  [ChangeFieldEnum.TOKEN_ADDRESSES]: <Trans>Trading Pairs</Trans>,
  [ChangeFieldEnum.COPY_ALL]: <Trans>Follow The Trader</Trans>,
  [ChangeFieldEnum.ENABLE_STOP_LOSS]: <Trans>Stop Loss</Trans>,
  [ChangeFieldEnum.STOP_LOSS_TYPE]: <Trans>Stop Loss Type</Trans>,
  [ChangeFieldEnum.STOP_LOSS_AMOUNT]: <Trans>Stop Loss Amount</Trans>,
  [ChangeFieldEnum.ENABLE_TAKE_PROFIT]: <Trans>Take Profit</Trans>,
  [ChangeFieldEnum.TAKE_PROFIT_TYPE]: <Trans>Take Profit Type</Trans>,
  [ChangeFieldEnum.TAKE_PROFIT_AMOUNT]: <Trans>Take Profit Amount</Trans>,
  [ChangeFieldEnum.MAX_VOL_MULTIPLIER]: <Trans>Max Margin Per Position</Trans>,
  [ChangeFieldEnum.VOLUME_PROTECTION]: <Trans>Margin Protection</Trans>,
  [ChangeFieldEnum.LOOK_BACK_ORDERS]: <Trans>Orders Lookback</Trans>,
  [ChangeFieldEnum.SKIP_LOW_LEVERAGE]: <Trans>Skip Lower Leverage Position</Trans>,
  [ChangeFieldEnum.SKIP_LOW_COLLATERAL]: <Trans>Skip Lower Collateral Position</Trans>,
  [ChangeFieldEnum.SKIP_LOW_SIZE]: <Trans>Skip Lower Size Position</Trans>,
  [ChangeFieldEnum.REVERSE_COPY]: <Trans>Reverse Copy</Trans>,
  [ChangeFieldEnum.TITLE]: <Trans>Label</Trans>,
  [ChangeFieldEnum.STATUS]: <Trans>Status</Trans>,
  [ChangeFieldEnum.ENTRY_PRICE]: <Trans>Entry Price</Trans>,
  [ChangeFieldEnum.PNL]: <Trans>PnL</Trans>,
  [ChangeFieldEnum.CLOSE_TYPE]: <Trans>Closed Type</Trans>,
  [ChangeFieldEnum.SIZE_DELTA]: <Trans>Size Token</Trans>,
  [ChangeFieldEnum.TOTAL_SIZE_DELTA]: <Trans>Total Size Token</Trans>,
  [ChangeFieldEnum.SOURCE_SIZE_DELTA]: <Trans>Source Size Token</Trans>,
  [ChangeFieldEnum.STOP_LOSS_DETAIL]: <Trans>Stop Loss Details</Trans>,
  [ChangeFieldEnum.TAKE_PROFIT_DETAIL]: <Trans>Take Profit Details</Trans>,
  [ChangeFieldEnum.QUANTITY]: <Trans>Quantity</Trans>,
  [ChangeFieldEnum.STOP_PRICE]: <Trans>Est. Stop Price</Trans>,
  [ChangeFieldEnum.TAKE_PROFIT_PRICE]: <Trans>Est. Take Profit Price</Trans>,
  [ChangeFieldEnum.SIDE]: <Trans>Side</Trans>,
  [ChangeFieldEnum.POSITION_SIDE]: <Trans>Position Side</Trans>,
  [ChangeFieldEnum.BALANCE]: <Trans>Balance</Trans>,
  [ChangeFieldEnum.AVAILABLE_BALANCE]: <Trans>Available Balance</Trans>,
  [ChangeFieldEnum.NAME]: <Trans>Name</Trans>,
  [ChangeFieldEnum.EXCHANGE]: <Trans>Exchange</Trans>,
  [ChangeFieldEnum.BINGX]: <Trans>BingX API Key</Trans>,
  [ChangeFieldEnum.SMART_WALLET_ADDRESS]: <Trans>Smart Wallet</Trans>,
  [ChangeFieldEnum.COPY_VOLUME]: <Trans>Copy Volume</Trans>,
  [ChangeFieldEnum.ACTIVE_COPY]: <Trans>Active Copy</Trans>,
  [ChangeFieldEnum.TYPE]: <Trans>Type</Trans>,
  [ChangeFieldEnum.LATEST_TAKE_PROFIT_ID]: <Trans>Latest Take Profit ID</Trans>,
  [ChangeFieldEnum.LATEST_STOP_LOSS_ID]: <Trans>Latest Stop Loss ID</Trans>,
  [ChangeFieldEnum.MULTIPLE_COPY]: <Trans>Multiple Copy</Trans>,
  [ChangeFieldEnum.ACCOUNTS]: <Trans>Accounts</Trans>,
  [ChangeFieldEnum.ACCOUNT]: <Trans>Account</Trans>,
}

export const CHAIN_STATS_TRANS: ObjectTrans = {
  [ChainStatsEnum.ABITRUM]: 'Arbitrum',
  [ChainStatsEnum.OPTIMISM]: 'Optimism',
  [ChainStatsEnum.POLYGON]: 'Polygon',
  [ChainStatsEnum.BNB_CHAIN]: 'BNB Chain',
}
export const MIRROR_TRANS: ObjectTrans = {
  mirrorSignalSnx: 'Mirror Synthetix',
  mirrorSignalGns: 'Mirror gTrade',
  mirrorSignalLevel: 'Mirror Level',
}

export const MARGIN_MODE_TRANS: ObjectTrans = {
  [MarginModeEnum.CROSS]: 'Cross',
  [MarginModeEnum.ISOLATED]: 'Isolated',
}

export const FEE_REBATE_EPOCH_STATUS_TRANS: ObjectTrans = {
  [EpochStatusEnum.NOT_HAPPEN]: <Trans>Upcoming</Trans>,
  [EpochStatusEnum.ONGOING]: <Trans>Ongoing</Trans>,
  [EpochStatusEnum.ENDED]: <Trans>Ended</Trans>,
  [EpochStatusEnum.AWARDED]: <Trans>Ended</Trans>,
}

export const ALERT_TYPE_TRANS: ObjectTrans = {
  [AlertTypeEnum.COPY_TRADE]: <Trans>System</Trans>,
  [AlertTypeEnum.TRADERS]: <Trans>System</Trans>,
  [AlertTypeEnum.CUSTOM]: <Trans>Custom</Trans>,
}

export const TELEGRAM_TYPE_TRANS: ObjectTrans = {
  [TelegramTypeEnum.DIRECT]: <Trans>Direct Alert</Trans>,
  [TelegramTypeEnum.GROUP]: <Trans>Group Alert</Trans>,
}

export const ERRORS: ObjectTrans = {
  Forbidden: t`You are not authorized to perform this action`,
  UNKNOWN_ERROR: t`The server is not responding, please try again later!`,
  NETWORK_ERROR: t`The server is not responding, please try again later!`,
  limit_rate: t`Please wait a few minutes before you try again`,
}

export const TIME_TRANSLATION: Record<string, ReactNode> = {
  [TimeFilterByEnum.ALL_TIME]: <Trans>All</Trans>,
  [TimeFilterByEnum.S7_DAY]: <Trans>7D</Trans>,
  [TimeFilterByEnum.S14_DAY]: <Trans>14D</Trans>,
  [TimeFilterByEnum.S30_DAY]: <Trans>30D</Trans>,
  [TimeFilterByEnum.S60_DAY]: <Trans>60D</Trans>,
}

export const TIME_TRANSLATION_FULL: Record<string, ReactNode> = {
  [TimeFilterByEnum.ALL_TIME]: <Trans>All</Trans>,
  [TimeFilterByEnum.S7_DAY]: <Trans>7 Days</Trans>,
  [TimeFilterByEnum.S14_DAY]: <Trans>14 Days</Trans>,
  [TimeFilterByEnum.S30_DAY]: <Trans>30 Days</Trans>,
  [TimeFilterByEnum.S60_DAY]: <Trans>60 Days</Trans>,
}
