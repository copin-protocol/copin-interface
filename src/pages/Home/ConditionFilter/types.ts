import { TraderDataKey } from 'entities/trader'
import { ConditionType } from 'utils/types'

export interface RowValues {
  key: TraderDataKey
  gte?: number | null
  lte?: number | null
  conditionType: ConditionType
}

export type ConditionFormValues = RowValues[]

export interface FilterValues {
  fieldName: string
  gte?: number
  lte?: number
}
export interface ConditionFilterProps {
  filters: ConditionFormValues
  onCancel?: () => void
  onClickTitle?: () => void
  changeFilters: (options: ConditionFormValues) => void
}
