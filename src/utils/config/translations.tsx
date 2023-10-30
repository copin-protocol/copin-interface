// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ReactNode } from 'react'

import { CopyTradePlatformEnum, CopyTradeStatusEnum, OrderTypeEnum, PositionStatusEnum } from './enums'

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
}

export const PLATFORM_TRANS: ObjectTrans = {
  [CopyTradePlatformEnum.BINGX]: <Trans>BingX</Trans>,
  [CopyTradePlatformEnum.GMX]: <Trans>GMX</Trans>,
  [CopyTradePlatformEnum.SYNTHETIX]: <Trans>Synthetix</Trans>,
}

export const COPY_WALLET_TRANS: ObjectTrans = {
  [CopyTradePlatformEnum.BINGX]: 'BingX',
  [CopyTradePlatformEnum.SYNTHETIX]: 'Smart Wallet',
}

export const COPY_TRADE_STATUS_TRANS: ObjectTrans = {
  [CopyTradeStatusEnum.RUNNING]: <Trans>Running</Trans>,
  [CopyTradeStatusEnum.STOPPED]: <Trans>Stopped</Trans>,
}

export const ERRORS: ObjectTrans = {
  Forbidden: t`You are not authorized to perform this action`,
  UNKNOWN_ERROR: t`The server is not responding, please try again later!`,
  NETWORK_ERROR: t`The server is not responding, please try again later!`,
  limit_rate: t`Please wait a few minutes before you try again`,
}
