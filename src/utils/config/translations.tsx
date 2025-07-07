// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ReactNode } from 'react'

import {
  AlertCategoryEnum,
  AlertCustomType,
  AlertTypeEnum,
  ChangeFieldEnum,
  ChannelStatusEnum,
  ChannelTypeEnum,
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum,
  CopyTradeSideEnum,
  CopyTradeStatusEnum,
  DIRECTIONAL_BIAS_LABEL_KEY,
  DURATION_LABEL_KEY,
  DataTypeEnum,
  EpochStatusEnum,
  MarginModeEnum,
  OrderTypeEnum,
  PERFORMANCE_LABEL_KEY,
  PNL_TIER_KEY,
  PositionStatusEnum,
  ProtocolCopyTradeStatusEnum,
  RISK_LABEL_KEY,
  SLTPTypeEnum,
  SubscriptionPlanEnum,
  SystemStatusTypeEnum,
  TRADER_LABEL_KEY,
  TimeFilterByEnum,
  UserActionEnum,
  VOLUME_TIER_KEY,
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
  [CopyTradePlatformEnum.APEX]: 'ApeX',
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
  [CopyTradePlatformEnum.APEX]: 'ApeX',
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.BITGET]: 'Bitget',
  [CopyTradePlatformEnum.BINANCE]: 'Binance',
  [CopyTradePlatformEnum.BYBIT]: 'Bybit',
  [CopyTradePlatformEnum.OKX]: 'OKX',
  [CopyTradePlatformEnum.GATE]: 'Gate',
  [CopyTradePlatformEnum.HYPERLIQUID]: 'Hyperliquid',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'Synthetix v2',
  [CopyTradePlatformEnum.SYNTHETIX_V3]: 'Synthetix v3',
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
  [AlertTypeEnum.TRADERS]: <Trans>Watchlist Traders</Trans>,
  [AlertTypeEnum.COPY_TRADE]: <Trans>Copied Traders</Trans>,
  [AlertTypeEnum.CUSTOM]: <Trans>Custom Alert</Trans>,
}

export const ALERT_CUSTOM_TYPE_TRANS: ObjectTrans = {
  [AlertCustomType.TRADER_FILTER]: <Trans>Trader Filter</Trans>,
  [AlertCustomType.TRADER_GROUP]: <Trans>Trader Group</Trans>,
  [AlertCustomType.TRADER_POSITION]: <Trans>Position</Trans>,
}

export const ALERT_CATEGORY_TRANS: ObjectTrans = {
  [AlertCategoryEnum.SYSTEM]: <Trans>System</Trans>,
  [AlertCategoryEnum.CUSTOM]: <Trans>Custom</Trans>,
}

export const CHANNEL_TYPE_TRANS: ObjectTrans = {
  [ChannelTypeEnum.TELEGRAM]: <Trans>Telegram</Trans>,
  [ChannelTypeEnum.WEBHOOK]: <Trans>Webhook</Trans>,
}

export const CHANNEL_STATUS_TRANS: ObjectTrans = {
  [ChannelStatusEnum.OPERATIONAL]: <Trans>Operational</Trans>,
  [ChannelStatusEnum.SUSPENDED]: <Trans>Suspended</Trans>,
}

export const ERRORS: ObjectTrans = {
  Forbidden: t`You are not authorized to perform this action`,
  UNKNOWN_ERROR: t`The server is not responding, please try again later!`,
  NETWORK_ERROR: t`The server is not responding, please try again later!`,
  limit_rate: t`Please wait a few minutes before you try again`,
}

export const TIME_TRANSLATION: Record<string, ReactNode> = {
  [TimeFilterByEnum.ALL_TIME]: <Trans>All</Trans>,
  [TimeFilterByEnum.LAST_24H]: <Trans>24H</Trans>,
  [TimeFilterByEnum.S1_DAY]: <Trans>1D</Trans>,
  [TimeFilterByEnum.S7_DAY]: <Trans>7D</Trans>,
  [TimeFilterByEnum.S14_DAY]: <Trans>14D</Trans>,
  [TimeFilterByEnum.S30_DAY]: <Trans>30D</Trans>,
  [TimeFilterByEnum.S60_DAY]: <Trans>60D</Trans>,
}

export const TIME_TRANSLATION_FULL: Record<string, ReactNode> = {
  [TimeFilterByEnum.ALL_TIME]: <Trans>All</Trans>,
  [TimeFilterByEnum.LAST_24H]: <Trans>Last 24H</Trans>,
  [TimeFilterByEnum.S1_DAY]: <Trans>Yesterday</Trans>,
  [TimeFilterByEnum.S7_DAY]: <Trans>7 Days</Trans>,
  [TimeFilterByEnum.S14_DAY]: <Trans>14 Days</Trans>,
  [TimeFilterByEnum.S30_DAY]: <Trans>30 Days</Trans>,
  [TimeFilterByEnum.S60_DAY]: <Trans>60 Days</Trans>,
}

export const SYSTEM_STATUS_TYPE_TRANSLATION: Record<string, ReactNode> = {
  [SystemStatusTypeEnum.CLOSED]: <Trans>Closed</Trans>,
  [SystemStatusTypeEnum.STABLE]: <Trans>Stable</Trans>,
  [SystemStatusTypeEnum.UNSTABLE]: <Trans>Unstable</Trans>,
}

export const PROTOCOL_COPY_TRADE_STATUS_TRANSLATION: Record<string, ReactNode> = {
  [ProtocolCopyTradeStatusEnum.COPYABLE]: <Trans>Copyable</Trans>,
  [ProtocolCopyTradeStatusEnum.UNCOPYABLE]: <Trans>Uncopyable</Trans>,
}

export const SUBSCRIPTION_PLAN_TRANSLATION: Record<string, ReactNode> = {
  [SubscriptionPlanEnum.NON_LOGIN]: <Trans>Non Login</Trans>,
  [SubscriptionPlanEnum.FREE]: <Trans>Free</Trans>,
  [SubscriptionPlanEnum.STARTER]: <Trans>Starter</Trans>,
  [SubscriptionPlanEnum.PRO]: <Trans>Pro</Trans>,
  [SubscriptionPlanEnum.ELITE]: <Trans>Elite</Trans>,
}

export const LABEL_TRANSLATION: Record<string, string> = {
  [VOLUME_TIER_KEY.VOLUME_TIER1]: 'Shrimp', // Shrimp: < $1K
  [VOLUME_TIER_KEY.VOLUME_TIER2]: 'Fish', // Fish: $1K - $10K
  [VOLUME_TIER_KEY.VOLUME_TIER3]: 'Dolphin', // Dolphin: $10K - $100K
  [VOLUME_TIER_KEY.VOLUME_TIER4]: 'Shark', // Shark: $100K - $1M
  [VOLUME_TIER_KEY.VOLUME_TIER5]: 'Whale', // Whale: $1M - $10M
  [VOLUME_TIER_KEY.VOLUME_TIER6]: 'Super Whale', // Super Whale: $10M - $100M
  [VOLUME_TIER_KEY.VOLUME_TIER7]: 'Mega Whale', // Mega Whale: $100M+
  [PNL_TIER_KEY.PNL_TIER1]: 'Giga Rekt', // Giga-Rekt: -$1M+
  [PNL_TIER_KEY.PNL_TIER2]: 'Big Rekt', // Big Rekt: -$100K - $1M
  [PNL_TIER_KEY.PNL_TIER3]: 'Semi Rekt', // Semi-Rekt: -$10K - $100K
  [PNL_TIER_KEY.PNL_TIER4]: 'Small Rekt', // Small Rekt: $0 -> -$10K
  [PNL_TIER_KEY.PNL_TIER5]: 'Small Gainer', // Small Gainer: $0 -> $10K
  [PNL_TIER_KEY.PNL_TIER6]: 'Semi Gainer', // Semi Gainer: $10K -> $100K
  [PNL_TIER_KEY.PNL_TIER7]: 'Big Gainer', // Big Gainer: $100K -> $1M
  [PNL_TIER_KEY.PNL_TIER8]: 'Giga Gainer', // Giga Gainer: $1M+
  [DURATION_LABEL_KEY.SCALPER]: '⌁ Scalper',
  [DURATION_LABEL_KEY.DAY_TRADER]: '⛭ Day Trader',
  [DURATION_LABEL_KEY.SWING_TRADER]: '⎈ Swing Trader',
  [DURATION_LABEL_KEY.POSITION_TRADER]: '∞ Position Trader',
  [RISK_LABEL_KEY.LOW_RISK]: '▿ Low Risk',
  [RISK_LABEL_KEY.HIGH_RISK]: '▵ High Risk',
  [DIRECTIONAL_BIAS_LABEL_KEY.BULLISH]: '℧ Bullish',
  [DIRECTIONAL_BIAS_LABEL_KEY.BEARISH]: 'Ω Bearish',
  [PERFORMANCE_LABEL_KEY.CONSISTENT_WINNER]: '⁂ Consistent Winner',
  [PERFORMANCE_LABEL_KEY.ONE_HIT_WONDER]: '✷ One Hit Wonder',
  [PERFORMANCE_LABEL_KEY.HEAVY_LOSER]: '⛒ Loss-Heavy Past',
  [PERFORMANCE_LABEL_KEY.RISING_STAR]: '✧ Rising Star',
  [PERFORMANCE_LABEL_KEY.WINNING_STREAK]: '❀ Winning Streak',
  [PERFORMANCE_LABEL_KEY.LOSING_STREAK]: '⌀ Losing Streak',
}

export const LABEL_CATEGORY_TRANSLATION: Record<string, ReactNode> = {
  [TRADER_LABEL_KEY.VOLUME]: <Trans>VOLUME</Trans>,
  [TRADER_LABEL_KEY.PNL]: <Trans>PNL</Trans>,
  [TRADER_LABEL_KEY.DURATION]: <Trans>DURATION</Trans>,
  [TRADER_LABEL_KEY.RISK]: <Trans>RISK</Trans>,
  [TRADER_LABEL_KEY.DIRECTIONAL_BIAS]: <Trans>DIRECTIONAL BIAS</Trans>,
  [TRADER_LABEL_KEY.PERFORMANCE]: <Trans>PERFORMANCE (ALL)</Trans>,
}

export const LABEL_TOOLTIP_TRANSLATION: Record<string, ReactNode> = {
  [DURATION_LABEL_KEY.SCALPER]: <Trans>Average duration less than 1 hour</Trans>,
  [DURATION_LABEL_KEY.DAY_TRADER]: <Trans>Average duration between 1 hour and 1 day</Trans>,
  [DURATION_LABEL_KEY.SWING_TRADER]: <Trans>Average duration between 1 day and 1 week</Trans>,
  [DURATION_LABEL_KEY.POSITION_TRADER]: <Trans>Average duration greater than 1 week</Trans>,
  [RISK_LABEL_KEY.LOW_RISK]: <Trans>Low leverage and low draw down</Trans>,
  [RISK_LABEL_KEY.HIGH_RISK]: <Trans>High leverage and high draw down</Trans>,
  [DIRECTIONAL_BIAS_LABEL_KEY.BULLISH]: <Trans>Mostly position is long</Trans>,
  [DIRECTIONAL_BIAS_LABEL_KEY.BEARISH]: <Trans>Mostly position is short</Trans>,
  [PERFORMANCE_LABEL_KEY.CONSISTENT_WINNER]: <Trans>Winner in multiple periods of the market</Trans>,
  [PERFORMANCE_LABEL_KEY.ONE_HIT_WONDER]: <Trans>Big profit in a few positions but low win rate</Trans>,
  [PERFORMANCE_LABEL_KEY.HEAVY_LOSER]: <Trans>Mostly loses and has many liquidated positions in the past</Trans>,
  [PERFORMANCE_LABEL_KEY.RISING_STAR]: <Trans>New trader with good performance</Trans>,
  [PERFORMANCE_LABEL_KEY.WINNING_STREAK]: <Trans>On a streak of winning trades</Trans>,
  [PERFORMANCE_LABEL_KEY.LOSING_STREAK]: <Trans>On a streak of losing trades</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER1]: <Trans>Average volume less than $1K</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER2]: <Trans>Average volume between $1K and $10K</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER3]: <Trans>Average volume between $10K and $100K</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER4]: <Trans>Average volume between $100K and $1M</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER5]: <Trans>Average volume between $1M and $10M</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER6]: <Trans>Average volume between $10M and $100M</Trans>,
  [VOLUME_TIER_KEY.VOLUME_TIER7]: <Trans>Average volume over $100M</Trans>,
  [PNL_TIER_KEY.PNL_TIER1]: <Trans>PnL less than -$1M</Trans>,
  [PNL_TIER_KEY.PNL_TIER2]: <Trans>PnL between -$1M and -$100K</Trans>,
  [PNL_TIER_KEY.PNL_TIER3]: <Trans>PnL between -$100K and -$10K</Trans>,
  [PNL_TIER_KEY.PNL_TIER4]: <Trans>PnL between -$10K and $0</Trans>,
  [PNL_TIER_KEY.PNL_TIER5]: <Trans>PnL between $0 and $10K</Trans>,
  [PNL_TIER_KEY.PNL_TIER6]: <Trans>PnL between $10K and $100K</Trans>,
  [PNL_TIER_KEY.PNL_TIER7]: <Trans>PnL between $100K and $1M</Trans>,
  [PNL_TIER_KEY.PNL_TIER8]: <Trans>PnL over $1M</Trans>,
}

export const STATISTIC_TYPE_TRANSLATIONS: {
  [key in TimeFilterByEnum]?: { index: number; key: string; text: ReactNode }
} = {
  [TimeFilterByEnum.ALL_TIME]: {
    index: 0,
    key: 'ALL',
    text: <Trans>All time</Trans>,
  },
  [TimeFilterByEnum.S60_DAY]: {
    index: 1,
    key: '60D',
    text: <Trans>60 days</Trans>,
  },
  [TimeFilterByEnum.S30_DAY]: {
    index: 2,
    key: '30D',
    text: <Trans>30 days</Trans>,
  },
  [TimeFilterByEnum.S14_DAY]: {
    index: 3,
    key: '14D',
    text: <Trans>14 days</Trans>,
  },
  [TimeFilterByEnum.S7_DAY]: {
    index: 4,
    key: '7D',
    text: <Trans>7 days</Trans>,
  },
  [TimeFilterByEnum.S1_DAY]: {
    index: 5,
    key: '1D',
    text: <Trans>Yesterday</Trans>,
  },
  [TimeFilterByEnum.LAST_24H]: {
    index: 6,
    key: 'L24H',
    text: <Trans>Last 24H</Trans>,
  },
}
