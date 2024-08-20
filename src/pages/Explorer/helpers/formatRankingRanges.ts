import { FilterValues } from 'components/@widgets/ConditionFilterForm/types'

export function formatRankingRanges(ranges: FilterValues[]) {
  return ranges.map((values) => {
    const newValues = { ...values }
    newValues.fieldName = `ranking.${values.fieldName}`
    return newValues
  })
}
