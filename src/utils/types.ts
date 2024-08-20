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
