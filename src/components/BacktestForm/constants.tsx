import dayjs from 'dayjs'

import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'

import { BackTestFormValues } from './types'

export const fieldName: { [key in keyof BackTestFormValues]: keyof BackTestFormValues } = {
  balance: 'balance',
  orderVolume: 'orderVolume',
  leverage: 'leverage',
  tokenAddresses: 'tokenAddresses',
  startTime: 'startTime',
  endTime: 'endTime',
  volumeProtection: 'volumeProtection',
  lookBackOrders: 'lookBackOrders',
  enableStopLoss: 'enableStopLoss',
  stopLossAmount: 'stopLossAmount',
  reverseCopy: 'reverseCopy',
  maxVolMultiplier: 'maxVolMultiplier',
}

// pairs can be from server response
// export const pairs: TokenTrade[] = Object.keys(TOKEN_TRADE_SUPPORT).map((key) => TOKEN_TRADE_SUPPORT[key])
export const getDefaultBackTestFormValues: (protcol: ProtocolEnum) => BackTestFormValues = (
  protocol: ProtocolEnum
) => ({
  balance: 1000,
  orderVolume: 100,
  leverage: 5,
  tokenAddresses: getTokenTradeList(protocol).map((token) => token.address),
  startTime: dayjs().subtract(30, 'days').toDate(),
  endTime: dayjs().subtract(1, 'days').toDate(),
  volumeProtection: true,
  lookBackOrders: 10,
  enableStopLoss: false,
  stopLossAmount: 10,
  reverseCopy: false,
})

export const defaultMaxVolMultiplier = 5
