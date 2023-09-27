import { FilterValues } from 'pages/Home/ConditionFilter/types'

export interface FilterSuggestionData {
  id: string
  title: string
  ranges: FilterValues[]
}
