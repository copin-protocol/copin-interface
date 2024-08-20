import dayjs from 'dayjs'

import { FilterValues, RowValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'

export function suggestionFactory(data: FilterValues) {
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
  } as RowValues<TraderData>
}
