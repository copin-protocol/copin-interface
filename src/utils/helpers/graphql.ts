import { ConditionFormValues, FilterValues } from 'components/@widgets/ConditionFilterForm/types'

import { getPairFromSymbol } from './transform'

export const transformGraphqlFilters = (filters: { fieldName?: string; [key: string]: any }[]) => {
  return filters.map(({ fieldName, ...rest }) => {
    // Convert all values in rest to strings
    const convertedRest = Object.fromEntries(
      Object.entries(rest)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          // check if value is an array, keep it as an array
          if (Array.isArray(value)) {
            return [key, value]
          }
          return [key, String(value)]
        })
    )

    // Return new object with 'field' instead of 'fieldName'
    return {
      field: fieldName,
      ...convertedRest,
    }
  })
}

export const extractFiltersFromFormValues = <T>(data: ConditionFormValues<T>) => {
  return Object.values(data).reduce<FilterValues[]>((result, values) => {
    if (values?.and) {
      return [...result, { and: values.and }]
    }
    if (typeof values?.in === 'object' && values.conditionType === 'in') {
      if (values?.key === 'indexTokens') {
        return [
          ...result,
          {
            fieldName: 'pairs',
            in: values.in.map((symbol) => getPairFromSymbol(symbol)),
          } as FilterValues,
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
