import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import { SLTPTypeEnum } from 'utils/config/enums'

export interface BackTestFormValues {
  balance: number
  orderVolume: number
  leverage: number
  // tokenAddresses: string[]
  pairs: string[]
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

export interface BacktestInstanceData {
  order: number
  status: 'setting' | 'testing' | 'tested'
  settings: RequestBackTestData | null
  result: BackTestResultData | null
}

export interface BacktestState {
  isFocusBacktest: boolean
  currentInstanceId: string | null
  instanceIds: string[]
  instancesMapping: Record<string, BacktestInstanceData>
}

export type BacktestActionType =
  | {
      type: 'setSetting'
      payload: BacktestInstanceData['settings']
    }
  | {
      type: 'setResult'
      payload: BacktestInstanceData['result']
    }
  | {
      type: 'setStatus'
      payload: BacktestInstanceData['status']
    }
  | {
      type: 'setCurrentInstance'
      payload: string
    }
  | {
      type: 'addNewInstance'
    }
  | {
      type: 'removeInstance'
      payload: string
    }
  | {
      type: 'toggleFocusBacktest'
      payload?: boolean
    }
