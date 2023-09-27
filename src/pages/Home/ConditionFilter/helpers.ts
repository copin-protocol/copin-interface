import dayjs from 'dayjs'

import { tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderDataKey } from 'entities/trader'

import { ConditionFormValues, FilterValues, RowValues } from './types'

export function getDefaultFormValues(): ConditionFormValues {
  return ['profit', 'winRate'].map((key: string) => ({
    key: key as TraderDataKey,
    ...(tableSettings.find((item) => item.id === key)?.filter ?? {
      conditionType: 'gte',
    }),
  }))
}

export function getFiltersFromFormValues(data: ConditionFormValues) {
  return Object.values(data).reduce<FilterValues[]>((result, values) => {
    if (typeof values?.gte !== 'number' && typeof values?.lte !== 'number') return result
    const currFilter = {} as FilterValues
    if (values?.key) currFilter['fieldName'] = values.key
    if (typeof values?.gte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'gte'))
      currFilter['gte'] = values.gte
    if (typeof values?.lte === 'number' && (values.conditionType === 'between' || values?.conditionType === 'lte'))
      currFilter['lte'] = values.lte
    result.push(currFilter)
    return result
  }, [])
}

export function getFormValuesFromFilters(data: FilterValues[]) {
  return data.map((e) => normalizedData(e)) as ConditionFormValues
}

function normalizedData(data: FilterValues) {
  const range = { ...data }
  switch (range.fieldName) {
    case 'avgDuration':
    case 'maxDuration':
    case 'minDuration':
      if (range.gte) {
        range.gte = range.gte / 3600
      }
      if (range.lte) {
        range.lte = range.lte / 3600
      }
      break
    case 'lastTradeAtTs':
      let lte, gte
      if (range.gte) {
        lte = dayjs().utc().diff(dayjs(range.gte).utc(), 'day')
      }
      if (range.lte) {
        gte = dayjs().utc().diff(dayjs(range.lte).utc(), 'day')
      }
      range.gte = gte
      range.lte = lte
      break
  }

  return {
    key: range.fieldName,
    gte: range.gte,
    lte: range.lte,
    conditionType: range.gte && range.lte ? 'between' : range.gte ? 'gte' : 'lte',
  } as RowValues
}
