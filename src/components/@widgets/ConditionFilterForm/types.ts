import { Dispatch, ReactNode, SetStateAction } from 'react'

import { ConditionType, FilterCondition } from 'utils/types'

export interface RowValues<T> {
  key: keyof T
  gte?: number | null
  lte?: number | null
  in?: string[]
  conditionType: ConditionType
}

export type ConditionFormValues<T> = RowValues<T>[]

export interface FilterValues {
  fieldName: string
  gte?: number
  lte?: number
  in?: string[]
}
export interface FieldOption<T> {
  value: keyof T
  label: ReactNode
  default?: FilterCondition
  unit?: string
  searchText?: string
}
export interface RankingFieldOption<T> extends FieldOption<T> {
  statLabel?: string
  shortStatLabel?: string
  tooltipContent?: string
  statUnit?: string
  format?: (value: any) => ReactNode
  statFormat?: (value: any) => ReactNode
}

export interface ConditionOption {
  value: ConditionType
  label: string
}

export type ConditionFilterFormProps<T> = {
  formValues: ConditionFormValues<T>
  fieldOptions: FieldOption<T>[]
  setFormValues: Dispatch<SetStateAction<ConditionFormValues<T>>>
  onValuesChange?: (values: ConditionFormValues<T>) => void
  type?: 'ranking' | 'default'
}
