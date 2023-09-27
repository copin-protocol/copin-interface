import { ParsedQs } from 'qs'

import { TraderListSortProps } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'
import { SortTypeEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import { getDefaultFormValues } from '../ConditionFilter/helpers'
import { ConditionFormValues } from '../ConditionFilter/types'
import { parseParams } from './handleParams'

export const getInitValue = (searchParams: ParsedQs, key: string, defaultValue?: number) => {
  const value = searchParams[key] as string
  if (!value) return defaultValue ?? 0
  const parsedNumber = Number(value)
  if (isNaN(parsedNumber)) return defaultValue ?? 0
  return parsedNumber
}

export const getInitFilters = (searchParams: ParsedQs, accounts: string[] | undefined) => {
  const params = parseParams(searchParams[URL_PARAM_KEYS.CONDITIONAL_FILTERS] as string)
  if (Object.keys(params).length !== 0) {
    return params
  }
  const localFilterStr = localStorage.getItem(STORAGE_KEYS.CONDITIONAL_FILTER)
  const defaultValues = accounts ? [] : getDefaultFormValues()
  if (!!localFilterStr) {
    try {
      const localFilter = JSON.parse(localFilterStr) as ConditionFormValues
      return localFilter
    } catch (error) {}
  }
  return defaultValues
}

export const getInitSort = (searchParams: ParsedQs) => {
  const initSortBy = searchParams?.sort_by ?? 'profit'
  const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
  return { sortBy: initSortBy as TraderListSortProps<TraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
}
