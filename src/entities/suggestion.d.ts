import { FilterValues } from 'components/ConditionFilterForm/types'

export interface FilterSuggestionData {
  id: string
  title: string
  ranges: FilterValues[]
}
