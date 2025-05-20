import { ParsedQs } from 'qs'

import { TraderListSortProps } from 'components/@trader/TraderExplorerTableView/types'
import { getDefaultFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { TraderData } from 'entities/trader'
import { SortTypeEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { rankingFieldOptions } from 'utils/config/options'

import { FilterTabEnum, defaultFieldOptions } from '../ConditionFilter/configs'
import { parseParams } from './handleParams'

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
  const fieldOptions = filterTab === FilterTabEnum.DEFAULT ? defaultFieldOptions : rankingFieldOptions
  const paramsStr = searchParams[paramKey] as string
  const filtersFromParams = parseParams(paramsStr)
  if (Object.keys(filtersFromParams).length !== 0) {
    return filtersFromParams
  }

  const defaultFilters = accounts ? [] : getDefaultFormValues([], fieldOptions)
  return defaultFilters
}

export const getInitFilterTab = ({ searchParams }: { searchParams: ParsedQs }) => {
  const tab = (searchParams[URL_PARAM_KEYS.FILTER_TAB] as FilterTabEnum) || FilterTabEnum.DEFAULT
  return tab
}

export const DEFAULT_SORT_BY: keyof TraderData = 'pnl'
export const getInitSort = (searchParams: ParsedQs) => {
  const initSortBy = searchParams?.sort_by ?? DEFAULT_SORT_BY
  const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
  return { sortBy: initSortBy as TraderListSortProps<TraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
}
