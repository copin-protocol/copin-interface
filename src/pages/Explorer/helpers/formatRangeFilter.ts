import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'

export function formatRangeFilter({
  filters,
  maxFilterFields,
  fieldsAllowed,
}: {
  filters: ConditionFormValues<TraderData>
  maxFilterFields: number
  fieldsAllowed: string[]
}) {
  return filters.filter((v) => !!fieldsAllowed.includes(v.key)).slice(0, maxFilterFields)
}
