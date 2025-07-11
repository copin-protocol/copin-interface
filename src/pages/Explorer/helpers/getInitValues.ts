import { ParsedQs } from 'qs'

import { TraderListSortProps } from 'components/@trader/TraderExplorerTableView/types'
import { getDefaultFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { SortTypeEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
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
  const paramsStr = searchParams[paramKey] as string
  const filtersFromParams = parseParams(paramsStr)
  if (Object.keys(filtersFromParams).length !== 0) {
    return filtersFromParams
  }

  if (filterTab === FilterTabEnum.DEFAULT) {
    const defaultFilters = localStorage.getItem(STORAGE_KEYS.DEFAULT_FILTERS)
    if (defaultFilters) {
      return JSON.parse(defaultFilters) as ConditionFormValues<TraderData>
    }
  }

  if (filterTab === FilterTabEnum.RANKING) {
    const rankingFilters = localStorage.getItem(STORAGE_KEYS.RANKING_FILTERS)
    if (rankingFilters) {
      return JSON.parse(rankingFilters) as ConditionFormValues<TraderData>
    }
  }
  const fieldOptions = filterTab === FilterTabEnum.DEFAULT ? defaultFieldOptions : rankingFieldOptions
  const defaultFilters = accounts ? [] : getDefaultFormValues([], fieldOptions)
  return defaultFilters
}

export const getInitLabelsFilters = ({
  searchParams,
}: {
  searchParams: ParsedQs
  accounts: string[] | undefined
}): string[] => {
  const paramsStr = searchParams[URL_PARAM_KEYS.LABELS_FILTERS] as string
  const filtersFromParams = paramsStr?.split('__')
  if (filtersFromParams?.length > 0) {
    return filtersFromParams
  }

  const labelsFilters = localStorage.getItem(STORAGE_KEYS.LABELS_FILTERS)
  if (labelsFilters) {
    return JSON.parse(labelsFilters) as string[]
  }
  return []
}

export const getInitIFLabelsFilters = ({ searchParams }: { searchParams: ParsedQs }): string[] => {
  const paramsStr = searchParams[URL_PARAM_KEYS.IF_LABELS_FILTERS] as string
  const filtersFromParams = paramsStr?.split('__')
  if (filtersFromParams?.length > 0) {
    return filtersFromParams
  }

  const ifLabelsFilters = localStorage.getItem(STORAGE_KEYS.IF_LABELS_FILTERS)
  if (ifLabelsFilters) {
    return JSON.parse(ifLabelsFilters) as string[]
  }
  return []
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
