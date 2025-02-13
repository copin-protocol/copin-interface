import { UsdPrices } from 'hooks/store/useUsdPrices'

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

export type WorkerMessage = {
  type: 'pyth_price'
  data: UsdPrices
}

export type NewUserCheckerData = { [userId: string]: '1' }

export type ValueOf<T> = T[keyof T]

export type PositionTimeType = 'relative' | 'absolute'
