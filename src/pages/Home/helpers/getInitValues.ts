import { ParsedQs } from 'qs'

import { getDefaultFormValues } from 'components/ConditionFilterForm/helpers'
import { ConditionFormValues } from 'components/ConditionFilterForm/types'
import { TraderListSortProps } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'
import { SortTypeEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { rankingFieldOptions } from 'utils/config/options'

import { FilterTabEnum, defaultFieldOptions } from '../ConditionFilter/configs'
import { parseParams } from './handleParams'

export const getInitValue = (searchParams: ParsedQs, key: string, defaultValue?: number) => {
  const value = searchParams[key] as string
  if (!value) return defaultValue ?? 0
  const parsedNumber = Number(value)
  if (isNaN(parsedNumber)) return defaultValue ?? 0
  return parsedNumber
}

export const getInitFilters = ({
  searchParams,
  accounts,
  filterTab,
}: {
  searchParams: ParsedQs
  accounts: string[] | undefined
  filterTab: FilterTabEnum
}) => {
  const paramKey = filterTab === FilterTabEnum.DEFAULT ? URL_PARAM_KEYS.DEFAULT_FILTERS : URL_PARAM_KEYS.RANKING_FILTERS
  const storageKey = filterTab === FilterTabEnum.DEFAULT ? STORAGE_KEYS.DEFAULT_FILTERS : STORAGE_KEYS.RANKING_FILTERS
  const fieldOptions = filterTab === FilterTabEnum.DEFAULT ? defaultFieldOptions : rankingFieldOptions
  const filtersFromParams = parseParams(searchParams[paramKey] as string)
  if (Object.keys(filtersFromParams).length !== 0) {
    return filtersFromParams
  }
  const localFilterStr = localStorage.getItem(storageKey)
  if (!!localFilterStr) {
    try {
      const filtersFromStorage = JSON.parse(localFilterStr) as ConditionFormValues<TraderData>
      return filtersFromStorage
    } catch (error) {}
  }
  const defaultFilters = accounts ? [] : getDefaultFormValues(['pnl', 'winRate'], fieldOptions)
  return defaultFilters
}

export const getInitFilterTab = ({ searchParams }: { searchParams: ParsedQs }) => {
  const tab = (searchParams[URL_PARAM_KEYS.FILTER_TAB] as FilterTabEnum) || FilterTabEnum.DEFAULT
  return tab
}

export const getInitSort = (searchParams: ParsedQs) => {
  const initSortBy = searchParams?.sort_by ?? 'pnl'
  const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
  return { sortBy: initSortBy as TraderListSortProps<TraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
}
