export interface BackTestFormValues {
  balance: number
  orderVolume: number
  leverage: number
  tokenAddresses: string[]
  // tradingMethod: boolean
  startTime: Date
  endTime: Date
  volumeProtection: boolean
  lookBackOrders: number
  enableStopLoss: boolean
  stopLossAmount: number
  maxVolMultiplier?: number
  reverseCopy: boolean
}
