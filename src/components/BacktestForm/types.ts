import { SLTPTypeEnum } from 'utils/config/enums'

export interface BackTestFormValues {
  balance: number
  orderVolume: number
  leverage: number
  tokenAddresses: string[]
  // tradingMethod: boolean
  startTime: Date
  endTime: Date
  lookBackOrders: number | null
  stopLossType: SLTPTypeEnum
  stopLossAmount: number | undefined
  takeProfitType: SLTPTypeEnum
  takeProfitAmount: number | undefined
  maxMarginPerPosition: number | null
  reverseCopy: boolean
  copyAll: boolean
}
