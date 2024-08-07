import dayjs from 'dayjs'

import { ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'

import { BackTestFormValues } from './types'

export const fieldName: { [key in keyof BackTestFormValues]: keyof BackTestFormValues } = {
  balance: 'balance',
  orderVolume: 'orderVolume',
  leverage: 'leverage',
  tokenAddresses: 'tokenAddresses',
  startTime: 'startTime',
  endTime: 'endTime',
  lookBackOrders: 'lookBackOrders',
  stopLossAmount: 'stopLossAmount',
  takeProfitAmount: 'takeProfitAmount',
  stopLossType: 'stopLossType',
  takeProfitType: 'takeProfitType',
  maxMarginPerPosition: 'maxMarginPerPosition',
  reverseCopy: 'reverseCopy',
  copyAll: 'copyAll',
}

// Todo: Check when add new protocol with cross margin
export const DISABLED_MARGIN_PROTECTION_PROTOCOLS = [ProtocolEnum.HMX_ARB, ProtocolEnum.SYNTHETIX_V3]

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
  lookBackOrders: DISABLED_MARGIN_PROTECTION_PROTOCOLS.includes(protocol) ? null : 10,
  stopLossAmount: undefined,
  stopLossType: SLTPTypeEnum.PERCENT,
  takeProfitAmount: undefined,
  takeProfitType: SLTPTypeEnum.PERCENT,
  maxMarginPerPosition: null,
  reverseCopy: false,
  copyAll: false,
})

export const defaultMaxVolMultiplier = 5
