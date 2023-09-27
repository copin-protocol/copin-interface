export type TimeRange = {
  from?: Date
  to?: Date
}

export type ConditionType = 'gte' | 'lte' | 'between'

export type FilterCondition = {
  gte?: number | null
  lte?: number | null
  conditionType: ConditionType
}
