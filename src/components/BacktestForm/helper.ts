import dayjs from 'dayjs'

import { RequestBackTestData } from 'entities/backTest'
import { SLTPTypeEnum } from 'utils/config/enums'

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
    lookBackOrders: requestData.lookBackOrders ?? 10,
    stopLossAmount: requestData.enableStopLoss ? requestData.stopLossAmount : undefined,
    stopLossType: requestData.stopLossType ?? SLTPTypeEnum.PERCENT,
    takeProfitAmount: requestData.enableTakeProfit ? requestData.takeProfitAmount : undefined,
    takeProfitType: requestData.takeProfitType ?? SLTPTypeEnum.PERCENT,
    copyAll: !!requestData?.copyAll,
    maxMarginPerPosition:
      requestData.maxVolMultiplier && requestData.maxVolMultiplier > 0
        ? requestData.maxVolMultiplier * requestData.orderVolume
        : null,
    reverseCopy: requestData.reverseCopy ?? false,
  }
  return result
}
