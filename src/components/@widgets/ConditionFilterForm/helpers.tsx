import { ReactNode } from 'react'

import { getPairFromSymbol } from 'utils/helpers/transform'

import { ConditionFormValues, FieldOption, FilterValues, RowValues } from './types'

export const IGNORED_FITLER_FORM_FIELDS = ['labels', 'indexTokens', 'ifLabels', 'ifGoodMarkets', 'ifBadMarkets']

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
    if (typeof values?.in === 'object' && values.conditionType === 'in') {
      if (values?.key === 'indexTokens') {
        return [
          ...result,
          { fieldName: 'pairs', in: values.in.map((symbol) => getPairFromSymbol(symbol)) } as FilterValues,
        ]
      }
      return [...result, { fieldName: values.key, in: values.in } as FilterValues]
    }
    if (typeof values?.gte !== 'number' && typeof values?.lte !== 'number') return result
    const currFilter = {} as FilterValues
    if (values?.key) currFilter['fieldName'] = values.key as string
    if (typeof values?.gte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'gte'))
      currFilter['gte'] = values.gte
    if (typeof values?.lte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'lte'))
      currFilter['lte'] = values.lte
    return [...result, currFilter]
  }, [])
}

export function getFormValuesFromFilters<T>(data: FilterValues[], factory: (data: FilterValues) => RowValues<T>) {
  return data.map((e) => factory(e)) as ConditionFormValues<T>
}

export function getFieldOptions<T>(settings: { id: any; text?: any; filter?: any; unit?: any; searchText?: string }[]) {
  const fieldOptions: FieldOption<T>[] = settings
    .filter((item) => item.filter != null)
    .map((item) => ({
      value: item.id,
      label: <div>{item.text}</div>,
      default: item.filter,
      unit: item.unit,
      searchText: item.searchText,
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

export function parseNumber(str: string | undefined) {
  const num = parseFloat(str ?? '')
  if (isNaN(num)) return 0
  return num
}
