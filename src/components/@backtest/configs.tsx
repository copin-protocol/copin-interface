import { BackTestFormValues } from './types'

export const fieldName: { [key in keyof BackTestFormValues]: keyof BackTestFormValues } = {
  balance: 'balance',
  orderVolume: 'orderVolume',
  leverage: 'leverage',
  // tokenAddresses: 'tokenAddresses',
  pairs: 'pairs',
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

export const PARAM_MAPPING = {
  ACCOUNT: 'acc',
  BALANCE: 'bal',
  ORDER_VOLUME: 'vol',
  LEVERAGE: 'lev',
  FROM_TIME: 'from',
  TO_TIME: 'to',
  LOOK_BACK_ORDERS: 'look_back',
  STOP_LOSS_AMOUNT: 'sl',
  STOP_LOSS_TYPE: 'sl_type',
  TAKE_PROFIT_AMOUNT: 'tp',
  TAKE_PROFIT_TYPE: 'tp_type',
  MAX_VOL_MULTIPLIER: 'max_vol',
  REVERSE_COPY: 'reverse',
  TOKEN_ADDRESSES: 'tokens',
  COPY_ALL: 'copy_all',
}

export const RESET_BACKTEST_PARAMS = Object.values(PARAM_MAPPING).reduce((result, value) => {
  return { ...result, [value]: null }
}, {})

export const defaultMaxVolMultiplier = 5
