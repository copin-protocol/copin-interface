import { RequestBackTestData } from 'entities/backTest.d'
import { CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'

export function stringifyRequestData(
  data: RequestBackTestData & { testingType: CopyTradeTypeEnum },
  protocol: ProtocolEnum
) {
  const tokenStringifyMapping: Record<string, string> = getTokenTradeList(protocol).reduce((result, token, index) => {
    return { ...result, [token.address]: index }
  }, {})

  return `${data.accounts[0]}__${data.balance}__${data.orderVolume}__${data.leverage}__${data.fromTime}__${
    data.toTime
  }__${data.testingType}__${data.lookBackOrders ? data.lookBackOrders : '0'}__${
    data.stopLossAmount ? data.stopLossAmount : '0'
  }__${data.maxVolMultiplier}__${data.reverseCopy ? '1' : '0'}${
    data.tokenAddresses?.length
      ? `__${data.tokenAddresses.map((address) => tokenStringifyMapping[address]).join('_')}`
      : ''
  }`
}
export function parseRequestData(params: string | undefined, protocol: ProtocolEnum) {
  if (!params) return {} as RequestBackTestData & { testingType: CopyTradeTypeEnum }
  const tokenParseMapping: Record<string, string> = getTokenTradeList(protocol).reduce((result, token, index) => {
    return { ...result, [index]: token.address }
  }, {})

  const listData = params.split('__')

  const account = listData[0]
  const balance = Number(listData[1])
  const orderVolume = Number(listData[2])
  const leverage = Number(listData[3])
  const fromTime = Number(listData[4])
  const toTime = Number(listData[5])
  const testingType = listData[6] as CopyTradeTypeEnum
  const lookBackOrders = Number(listData[7])
  const stopLossAmount = Number(listData[8])
  const maxVolMultiplier = Number(listData[9])
  const reverseCopy = listData[10]
  const tokenAddresses = listData[11] ? listData[11].split('_').map((index: string) => tokenParseMapping[index]) : []

  const parseData = [account, balance, orderVolume, leverage, fromTime, toTime]

  if (parseData.some((data) => !data || isNaN(data as number)) || !tokenAddresses?.length)
    return {} as RequestBackTestData & { testingType: CopyTradeTypeEnum }

  const result: RequestBackTestData & { testingType: CopyTradeTypeEnum } = {
    accounts: [account],
    balance,
    orderVolume,
    leverage,
    fromTime,
    toTime,
    testingType,
    tokenAddresses,
  }
  if (!isNaN(lookBackOrders) && lookBackOrders > 0) {
    result.volumeProtection = true
    result.lookBackOrders = lookBackOrders
  }
  if (!isNaN(stopLossAmount) && stopLossAmount > 0) {
    result.enableStopLoss = true
    result.stopLossAmount = stopLossAmount
  }
  if (!isNaN(maxVolMultiplier)) {
    result.maxVolMultiplier = maxVolMultiplier
  }
  if (reverseCopy === '1') result.reverseCopy = true
  return result
}

export const MIN_BACKTEST_VALUE = 10
