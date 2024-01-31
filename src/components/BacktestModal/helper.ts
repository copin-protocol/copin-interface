import { RequestBackTestData } from 'entities/backTest.d'
import { CopyTradeTypeEnum, ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'

const PARAM_MAPPING = {
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

export function stringifyRequestData(
  data: RequestBackTestData & { testingType: CopyTradeTypeEnum },
  protocol: ProtocolEnum
): Record<string, string | undefined> {
  try {
    const tokenList = getTokenTradeList(protocol).map((value) => value.address)
    const tokenStringifyMapping: Record<string, string> = tokenList.sort().reduce((result, tokenAddress, index) => {
      return { ...result, [tokenAddress]: index }
    }, {})

    return {
      [PARAM_MAPPING.ACCOUNT]: data.accounts?.[0],
      [PARAM_MAPPING.BALANCE]: data.balance?.toString(),
      [PARAM_MAPPING.ORDER_VOLUME]: data.orderVolume?.toString(),
      [PARAM_MAPPING.LEVERAGE]: data.leverage?.toString(),
      [PARAM_MAPPING.FROM_TIME]: data.fromTime?.toString(),
      [PARAM_MAPPING.TO_TIME]: data.toTime?.toString(),
      [PARAM_MAPPING.LOOK_BACK_ORDERS]: data.lookBackOrders?.toString(),
      [PARAM_MAPPING.STOP_LOSS_AMOUNT]: data.stopLossAmount?.toString(),
      [PARAM_MAPPING.STOP_LOSS_TYPE]: data.stopLossType?.toString(),
      [PARAM_MAPPING.TAKE_PROFIT_AMOUNT]: data.takeProfitAmount?.toString(),
      [PARAM_MAPPING.TAKE_PROFIT_TYPE]: data.takeProfitType?.toString(),
      [PARAM_MAPPING.MAX_VOL_MULTIPLIER]: data.maxVolMultiplier?.toString(),
      [PARAM_MAPPING.REVERSE_COPY]: data.reverseCopy ? '1' : undefined,
      [PARAM_MAPPING.COPY_ALL]: data.copyAll ? '1' : undefined,
      [PARAM_MAPPING.TOKEN_ADDRESSES]: data.copyAll
        ? undefined
        : data.tokenAddresses?.map?.((address) => tokenStringifyMapping[address]).join('_'),
    }
  } catch {
    return {}
  }
}
export function parseRequestData(params: Record<string, any> | undefined, protocol: ProtocolEnum) {
  let result = {} as RequestBackTestData & { testingType: CopyTradeTypeEnum }
  if (!params) return result
  const tokenList = getTokenTradeList(protocol).map((value) => value.address)
  const tokenParseMapping: Record<string, string> = tokenList.sort().reduce((result, tokenAddress, index) => {
    return { ...result, [index]: tokenAddress }
  }, {})

  try {
    const account = params[PARAM_MAPPING.ACCOUNT] ?? ''
    const balance = Number(params[PARAM_MAPPING.BALANCE] ?? 0)
    const orderVolume = Number(params[PARAM_MAPPING.ORDER_VOLUME] ?? 0)
    const leverage = Number(params[PARAM_MAPPING.LEVERAGE] ?? 0)
    const fromTime = Number(params[PARAM_MAPPING.FROM_TIME] ?? 0)
    const toTime = Number(params[PARAM_MAPPING.TO_TIME] ?? 0)
    const lookBackOrders = Number(params[PARAM_MAPPING.LOOK_BACK_ORDERS] ?? 0)
    const stopLossAmount = Number(params[PARAM_MAPPING.STOP_LOSS_AMOUNT] ?? 0)
    const stopLossType = params[PARAM_MAPPING.STOP_LOSS_TYPE] ?? SLTPTypeEnum.USD
    const takeProfitAmount = Number(params[PARAM_MAPPING.TAKE_PROFIT_AMOUNT] ?? 0)
    const takeProfitType = params[PARAM_MAPPING.TAKE_PROFIT_TYPE] ?? SLTPTypeEnum.USD
    const maxVolMultiplier = Number(params[PARAM_MAPPING.MAX_VOL_MULTIPLIER] ?? 0)
    const reverseCopy = params[PARAM_MAPPING.REVERSE_COPY] === '1' ? true : false
    const copyAll = params[PARAM_MAPPING.COPY_ALL] === '1' ? true : false
    const tokenAddresses = copyAll
      ? tokenList
      : params[PARAM_MAPPING.TOKEN_ADDRESSES]
      ? params[PARAM_MAPPING.TOKEN_ADDRESSES].split('_').map((index: string) => tokenParseMapping[index])
      : []

    const requiredData = [account, balance, orderVolume, leverage, fromTime, toTime]

    if (requiredData.some((data) => !data || isNaN(data as number)) || (!copyAll && !tokenAddresses?.length))
      return result

    result = {
      accounts: [account],
      balance,
      orderVolume,
      leverage,
      fromTime,
      toTime,
      testingType: CopyTradeTypeEnum.FULL_ORDER,
      tokenAddresses,
      reverseCopy,
      copyAll,
    }
    if (!isNaN(lookBackOrders) && lookBackOrders > 0) {
      result.volumeProtection = true
      result.lookBackOrders = lookBackOrders
    }
    if (!isNaN(stopLossAmount) && stopLossAmount > 0) {
      result.enableStopLoss = true
      result.stopLossAmount = stopLossAmount
      result.stopLossType = stopLossType
    }
    if (!isNaN(takeProfitAmount) && takeProfitAmount > 0) {
      result.enableTakeProfit = true
      result.takeProfitAmount = takeProfitAmount
      result.takeProfitType = takeProfitType
    }
    if (!isNaN(maxVolMultiplier)) {
      result.maxVolMultiplier = maxVolMultiplier
    }
  } catch {}
  return result
}

export const MIN_BACKTEST_VALUE = 10
