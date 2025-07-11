import dayjs from 'dayjs'
import { ReactNode, createContext, useContext, useState } from 'react'

import { TraderListSortProps } from 'components/@trader/TraderExplorerTableView/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader.d'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useIsProAndAction } from 'hooks/features/subscription/useSubscriptionRestrict'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { RANKING_FIELD_NAMES } from 'hooks/store/useUserCustomize'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { TimeFilterByEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { TimeRange } from 'utils/types'

import { FilterTabEnum } from './ConditionFilter/configs'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import {
  DEFAULT_SORT_BY,
  getInitFilterTab,
  getInitFilters,
  getInitIFLabelsFilters,
  getInitLabelsFilters,
  getInitSort,
} from './helpers/getInitValues'
import { stringifyParams } from './helpers/handleParams'

export interface TradersContextData {
  tab: TabKeyEnum
  accounts?: string[]
  isRangeSelection: boolean
  from: Date | undefined
  to: Date | undefined
  timeRange: TimeRange
  changeTimeRange: (range: TimeRange) => void
  timeOption: TimeFilterProps
  changeTimeOption: (timeOption: TimeFilterProps) => void
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  currentSuggestion: string | undefined
  setCurrentSuggestion: (data?: string) => void
  filters: ConditionFormValues<TraderData>
  changeFilters: (props: { filters: ConditionFormValues<TraderData>; filterTab: FilterTabEnum }) => void
  changeLabels: (labels: string[]) => void
  changeIFLabels: (labels: string[]) => void
  ifLabelsFilters: string[]
  rankingFilters: ConditionFormValues<TraderData>
  labelsFilters: string[]

  currentSort: TraderListSortProps<TraderData> | undefined
  changeCurrentSort: (sort: TraderListSortProps<TraderData> | undefined) => void
  filterTab: FilterTabEnum
  resetFilter: () => void
}

const TradersContext = createContext<TradersContextData>({} as TradersContextData)

export function FilterTradersProvider({
  accounts,
  tab,
  children,
}: {
  accounts?: string[]
  tab: TabKeyEnum
  children: ReactNode
}) {
  const { myProfile } = useMyProfile()
  const { searchParams, setSearchParams, setSearchParamsOnly } = useSearchParams()

  const [currentSuggestion, setCurrentSuggestion] = useState<string | undefined>()

  const logEventFilter = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.FILTER,
      action,
    })
  }

  const timeFilterKey =
    tab === TabKeyEnum.Explorer ? URL_PARAM_KEYS.EXPLORER_TIME_FILTER : URL_PARAM_KEYS.FAVORITE_TIME_FILTER
  const rangeFilterKey =
    tab === TabKeyEnum.Explorer ? URL_PARAM_KEYS.EXPLORER_TIME_RANGE_FILTER : URL_PARAM_KEYS.FAVORITE_TIME_RANGE_FILTER

  // START TIME FILTER
  const { isProUser } = useIsProAndAction()
  const [isRangeSelection, setRangeSelection] = useState(() => {
    if (!isProUser) return false
    if (searchParams[rangeFilterKey]) return true
    return false
  })

  const { timeFilterOptions } = useGetTimeFilterOptions()
  const { currentOption: timeOption, setCurrentOption: setTimeOption } = useOptionChange({
    optionName: timeFilterKey,
    options: timeFilterOptions,
    defaultOption: TimeFilterByEnum.S30_DAY.toString(),
  })
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    if (!isRangeSelection) return {}
    const timeRangeStr = searchParams[rangeFilterKey] as string | undefined
    if (!timeRangeStr) return {}
    const timeRangeArr = timeRangeStr.split('_')
    const from = Number(timeRangeArr[0])
    const to = Number(timeRangeArr[1])
    if (isNaN(from) || isNaN(to)) return {}
    return { from: dayjs(from).toDate(), to: dayjs(to).toDate() } as TimeRange
  })

  const handleSetTimeRange = (range: TimeRange) => {
    if (!range || Object.keys(range).length < 2) {
      setTimeRange({})
      setSearchParams({ [rangeFilterKey]: null })
      return
    }
    const rangeSearch = `${dayjs(range.from).utc().valueOf()}_${dayjs(range.to).utc().valueOf()}`
    setSearchParams({ [rangeFilterKey]: rangeSearch, [timeFilterKey]: null, [URL_PARAM_KEYS.PAGE]: '1' })
    setTimeRange(range)
    setRangeSelection(true)

    logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].CUSTOM_RANGE)
  }

  const handleSetTimeOption = (timeOption: TimeFilterProps) => {
    setSearchParams({
      [rangeFilterKey]: null,
      [URL_PARAM_KEYS.PAGE]: '1',
      [timeFilterKey]: timeOption.id as unknown as string,
    })
    setTimeOption(timeOption)
    setRangeSelection(false)

    switch (timeOption.id) {
      case TimeFilterByEnum.S7_DAY:
        return logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].D7)
      case TimeFilterByEnum.S14_DAY:
        return logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].D15)
      case TimeFilterByEnum.S30_DAY:
        return logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].D30)
      case TimeFilterByEnum.S60_DAY:
        return logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].D60)
      case TimeFilterByEnum.ALL_TIME:
        return logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].ALL_TIME)
    }
  }

  const { from, to } = (() => {
    if (isRangeSelection) return timeRange
    const today = dayjs()
    const from = today.subtract(timeOption.value, 'days').toDate()
    return { from, to: today.toDate() }
  })()

  // END TIME FILTER

  const currentPage = Number(searchParams[URL_PARAM_KEYS.PAGE] ?? 1) // use page param instead of currentPage to reset it in GlobalFilterProtocol
  const changeCurrentPage = (page: number) => setSearchParams({ [URL_PARAM_KEYS.PAGE]: `${page}` })
  const currentLimit = Number(searchParams[URL_PARAM_KEYS.LIMIT] ?? DEFAULT_LIMIT) // use page param instead of currentPage to reset it in GlobalFilterProtocol
  const changeCurrentLimit = (limit: number) => {
    setSearchParams({ [URL_PARAM_KEYS.LIMIT]: `${limit}`, [URL_PARAM_KEYS.PAGE]: undefined })
  }

  const { userPermission } = useExplorerPermission()
  const filters = getInitFilters({
    searchParams,
    accounts,
    filterTab: FilterTabEnum.DEFAULT,
  })
  const rankingFilters = getInitFilters({
    searchParams,
    accounts,
    filterTab: FilterTabEnum.RANKING,
  }).filter((option) => !!RANKING_FIELD_NAMES.includes(option.key))

  const labelsFilters = getInitLabelsFilters({ searchParams, accounts })
  const ifLabelsFilters = getInitIFLabelsFilters({ searchParams })

  const changeLabels = (labels: string[]) => {
    setSearchParams({
      [URL_PARAM_KEYS.LABELS_FILTERS]: labels.join('__'),
      [URL_PARAM_KEYS.PAGE]: '1',
      [URL_PARAM_KEYS.FILTER_TAB]: FilterTabEnum.LABELS,
      [URL_PARAM_KEYS.IF_LABELS_FILTERS]: null,
      [URL_PARAM_KEYS.RANKING_FILTERS]: null,
      [URL_PARAM_KEYS.DEFAULT_FILTERS]: null,
    })
    // localStorage.setItem(STORAGE_KEYS.FILTER_TAB, filterTab)
    localStorage.setItem(STORAGE_KEYS.LABELS_FILTERS, JSON.stringify(labels))
  }

  const changeIFLabels = (labels: string[]) => {
    setSearchParams({
      [URL_PARAM_KEYS.IF_LABELS_FILTERS]: labels.join('__'),
      [URL_PARAM_KEYS.PAGE]: '1',
      [URL_PARAM_KEYS.FILTER_TAB]: FilterTabEnum.IF_LABELS,
      [URL_PARAM_KEYS.LABELS_FILTERS]: null,
      [URL_PARAM_KEYS.RANKING_FILTERS]: null,
      [URL_PARAM_KEYS.DEFAULT_FILTERS]: null,
    })
    // localStorage.setItem(STORAGE_KEYS.FILTER_TAB, filterTab)
    localStorage.setItem(STORAGE_KEYS.IF_LABELS_FILTERS, JSON.stringify(labels))
  }

  const changeFilters = ({
    filters,
    filterTab,
  }: {
    filters: ConditionFormValues<TraderData>
    filterTab: FilterTabEnum
  }) => {
    const stringParams = stringifyParams(filters)
    const payload = {
      [URL_PARAM_KEYS.FILTER_TAB]: filterTab,
      [URL_PARAM_KEYS.PAGE]: '1',
      [URL_PARAM_KEYS.IF_LABELS_FILTERS]: null,
      [URL_PARAM_KEYS.RANKING_FILTERS]: null,
      [URL_PARAM_KEYS.LABELS_FILTERS]: null,
      [URL_PARAM_KEYS.DEFAULT_FILTERS]: null,
    }
    if (filterTab === FilterTabEnum.RANKING) {
      payload[URL_PARAM_KEYS.RANKING_FILTERS] = stringParams
    } else if (filterTab === FilterTabEnum.DEFAULT) {
      payload[URL_PARAM_KEYS.DEFAULT_FILTERS] = stringParams
    }

    setSearchParams(payload)

    // localStorage.setItem(STORAGE_KEYS.FILTER_TAB, filterTab)

    const uniqueFilters = filters.reduce((acc, filter) => {
      if (!acc.find((f) => f.key === filter.key)) {
        acc.push(filter)
      }
      return acc
    }, [] as ConditionFormValues<TraderData>)

    localStorage.setItem(
      filterTab === FilterTabEnum.RANKING ? STORAGE_KEYS.RANKING_FILTERS : STORAGE_KEYS.DEFAULT_FILTERS,
      JSON.stringify(uniqueFilters)
    )
  }

  const currentSort = getInitSort(searchParams)
  if (!userPermission?.fieldsAllowed.includes(currentSort.sortBy)) {
    currentSort.sortBy = DEFAULT_SORT_BY
  }

  const changeCurrentSort = (sort: TraderListSortProps<TraderData> | undefined) => {
    const params: Record<string, string | null> = {}
    params.sort_by = sort?.sortBy ?? null
    params.sort_type = sort?.sortType ?? null
    params[URL_PARAM_KEYS.PAGE] = '1'
    setSearchParams(params)
  }
  const filterTab = getInitFilterTab({ searchParams })

  const resetFilter = () => {
    setTimeOption(timeFilterOptions.find((option) => userPermission?.timeFramesAllowed?.[0] === option.id)!)
    setSearchParamsOnly({})
    localStorage.removeItem(STORAGE_KEYS.DEFAULT_FILTERS)
  }

  const contextValue: TradersContextData = {
    tab,
    accounts,
    isRangeSelection,
    from,
    to,
    timeRange,
    changeTimeRange: handleSetTimeRange,
    timeOption,
    changeTimeOption: handleSetTimeOption,
    currentPage: !isNaN(currentPage) ? currentPage : 1,
    changeCurrentPage,
    currentSuggestion,
    setCurrentSuggestion,
    currentLimit: !isNaN(currentLimit) ? currentLimit : DEFAULT_LIMIT,
    changeCurrentLimit,
    filters,
    changeFilters,
    changeLabels,
    changeIFLabels,
    ifLabelsFilters,
    rankingFilters,
    labelsFilters,
    currentSort,
    changeCurrentSort,
    filterTab,
    resetFilter,
  }

  return <TradersContext.Provider value={contextValue}>{children}</TradersContext.Provider>
}

const useTradersContext = () => useContext(TradersContext)
export default useTradersContext
