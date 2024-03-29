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
