export interface BackTestFormValues {
  balance: number
  orderVolume: number
  leverage: number
  tokenAddresses: string[]
  // tradingMethod: boolean
  startTime: Date
  endTime: Date
  lookBackOrders: number | null
  stopLossAmount?: number
  maxMarginPerPosition: number | null
  reverseCopy: boolean
}
