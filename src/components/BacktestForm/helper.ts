import dayjs from 'dayjs'

import { RequestBackTestData } from 'entities/backTest'

import { BackTestFormValues } from './types'

export function getFormValuesFromRequestData(requestData: RequestBackTestData | undefined | null) {
  if (requestData == null) return
  const result: BackTestFormValues = {
    balance: requestData.balance,
    orderVolume: requestData.orderVolume,
    leverage: requestData.leverage,
    tokenAddresses: requestData.tokenAddresses ?? [],
    startTime: dayjs(requestData.fromTime).utc().toDate(),
    endTime: dayjs(requestData.toTime).utc().toDate(),
    volumeProtection: requestData.volumeProtection ?? true,
    lookBackOrders: requestData.lookBackOrders ?? 10,
    enableStopLoss: requestData.enableStopLoss ?? false,
    stopLossAmount: requestData.stopLossAmount ?? 1,
    maxVolMultiplier: requestData.maxVolMultiplier,
    reverseCopy: requestData.reverseCopy ?? false,
  }
  return result
}
