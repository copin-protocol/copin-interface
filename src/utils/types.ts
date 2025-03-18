import { ProtocolEnum } from './config/enums'

export type TimeRange = {
  from?: Date
  to?: Date
}

export type ConditionType = 'gte' | 'lte' | 'between' | 'in'

export type FilterCondition = {
  gte?: number | null
  lte?: number | null
  in?: string[]
  conditionType: ConditionType
}

export interface TokenCollateral {
  address: string
  symbol: string
  decimals: number
  copyV3MarketId?: number
  isStableCoin?: boolean
}

export type TokenCollateralMapping = Record<string, TokenCollateral>

export type WorkerBalanceMessage = {
  address: string
  protocol: ProtocolEnum
  balances: {
    symbol: string
    tokenAmount: number
    isStableCoin: boolean
  }[]
}

export type WorkerMessage =
  | {
      type: 'pyth_price' | 'gains_price'
      data: UsdPrices
    }
  | {
      type: 'trader_balance'
      data: WorkerBalanceMessage
    }

export type WorkerSendMessage = { type: 'trader_balance'; data: { address: string; protocol: ProtocolEnum }[] }
export type NewUserCheckerData = { [userId: string]: '1' }

export type ValueOf<T> = T[keyof T]

export type PositionTimeType = 'relative' | 'absolute'

export interface UsdPrices {
  [key: string]: number | undefined
}
