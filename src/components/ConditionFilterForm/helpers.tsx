import { ReactNode } from 'react'

import { ConditionFormValues, FieldOption, FilterValues, RowValues } from './types'

export function getDefaultFormValues<T>(
  defaultFields: (keyof T)[],
  fieldOptions: FieldOption<T>[]
): ConditionFormValues<T> {
  return defaultFields.map((key) => ({
    key,
    ...(fieldOptions.find((item) => item.value === key)?.default ?? {
      conditionType: 'gte',
    }),
  }))
}

export function getFiltersFromFormValues<T>(data: ConditionFormValues<T>) {
  return Object.values(data).reduce<FilterValues[]>((result, values) => {
    if (typeof values?.gte !== 'number' && typeof values?.lte !== 'number') return result
    const currFilter = {} as FilterValues
    if (values?.key) currFilter['fieldName'] = values.key as string
    if (typeof values?.gte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'gte'))
      currFilter['gte'] = values.gte
    if (typeof values?.lte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'lte'))
      currFilter['lte'] = values.lte
    result.push(currFilter)
    return result
  }, [])
}

export function getFormValuesFromFilters<T>(data: FilterValues[], factory: (data: FilterValues) => RowValues<T>) {
  return data.map((e) => factory(e)) as ConditionFormValues<T>
}

export function getFieldOptions<T>(settings: { id: any; text?: any; filter?: any; unit?: any }[]) {
  const fieldOptions: FieldOption<T>[] = settings
    .filter((item) => item.filter != null)
    .map((item) => ({
      value: item.id,
      label: <div>{item.text}</div>,
      default: item.filter,
      unit: item.unit,
    }))
  return fieldOptions
}

export function getFieldOptionLabels<T>(fieldOptions: FieldOption<T>[]) {
  const fieldOptionLabels = fieldOptions.reduce((prev, cur) => {
    prev[cur.value] = cur.label
    return prev
  }, {} as { [key in keyof T]: ReactNode })
  return fieldOptionLabels
}