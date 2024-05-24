// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ReactNode } from 'react'

import {
  ChainStatsEnum,
  ChangeFieldEnum,
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum,
  CopyTradeStatusEnum,
  DataTypeEnum,
  MarginModeEnum,
  OrderTypeEnum,
  PositionStatusEnum,
  SLTPTypeEnum,
  UserActionEnum,
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
  [CopyTradePlatformEnum.GMX]: <Trans>GMX</Trans>,
  [CopyTradePlatformEnum.SYNTHETIX]: <Trans>Synthetix</Trans>,
  [CopyTradePlatformEnum.SYNTHETIX_V2]: <Trans>Synthetix V2</Trans>,
}

export const PLATFORM_TEXT_TRANS: { [key: string]: string } = {
  [CopyTradePlatformEnum.OTHERS]: 'Others',
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.BITGET]: 'Bitget',
  [CopyTradePlatformEnum.BINANCE]: 'Binance',
  [CopyTradePlatformEnum.GMX]: 'GMX',
  [CopyTradePlatformEnum.SYNTHETIX]: 'Synthetix V3',
  [CopyTradePlatformEnum.SYNTHETIX_V2]: 'Synthetix V2',
}

export const COPY_WALLET_TRANS: ObjectTrans = {
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.BITGET]: 'Bitget',
  [CopyTradePlatformEnum.BINANCE]: 'Binance',
  [CopyTradePlatformEnum.SYNTHETIX]: 'SW',
}

export const COPY_TRADE_STATUS_TRANS: ObjectTrans = {
  [CopyTradeStatusEnum.RUNNING]: <Trans>Running</Trans>,
  [CopyTradeStatusEnum.STOPPED]: <Trans>Stopped</Trans>,
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
  [ChangeFieldEnum.exchange]: <Trans>Exchange</Trans>,
  [ChangeFieldEnum.bingX]: <Trans>BingX API Key</Trans>,
  [ChangeFieldEnum.smartWalletAddress]: <Trans>Smart Wallet</Trans>,
  [ChangeFieldEnum.copyVolume]: <Trans>Copy Volume</Trans>,
  [ChangeFieldEnum.activeCopy]: <Trans>Active Copy</Trans>,
}

export const CHAIN_STATS_TRANS: ObjectTrans = {
  [ChainStatsEnum.ABITRUM]: 'Arbitrum',
  [ChainStatsEnum.OPTIMISM]: 'Optimism',
  [ChainStatsEnum.POLYGON]: 'Polygon',
  [ChainStatsEnum.BNB_CHAIN]: 'BNB Chain',
}

export const MARGIN_MODE_TRANS: ObjectTrans = {
  [MarginModeEnum.CROSS]: 'Cross',
  [MarginModeEnum.ISOLATED]: 'Isolated',
}

export const ERRORS: ObjectTrans = {
  Forbidden: t`You are not authorized to perform this action`,
  UNKNOWN_ERROR: t`The server is not responding, please try again later!`,
  NETWORK_ERROR: t`The server is not responding, please try again later!`,
  limit_rate: t`Please wait a few minutes before you try again`,
}
