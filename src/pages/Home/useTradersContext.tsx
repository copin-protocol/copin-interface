import dayjs from 'dayjs'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { ConditionFormValues } from 'components/ConditionFilterForm/types'
import { TraderListSortProps } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader.d'
import useInternalRole from 'hooks/features/useInternalRole'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { RANKING_FIELD_NAMES } from 'hooks/store/useRankingCustomize'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { TimeRange } from 'utils/types'

import { FilterTabEnum } from './ConditionFilter/configs'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import { getInitFilterTab, getInitFilters, getInitSort } from './helpers/getInitValues'
import { stringifyParams } from './helpers/handleParams'

export interface TradersContextData {
  protocol: ProtocolEnum
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
  changeFilters: (filters: ConditionFormValues<TraderData>) => void
  rankingFilters: ConditionFormValues<TraderData>
  changeRankingFilters: (filters: ConditionFormValues<TraderData>) => void
  currentSort: TraderListSortProps<TraderData> | undefined
  changeCurrentSort: (sort: TraderListSortProps<TraderData> | undefined) => void
  filterTab: FilterTabEnum
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
  const { searchParams, setSearchParams } = useSearchParams()
  const protocolParam = searchParams?.protocol as ProtocolEnum
  const { protocol: protocolStore } = useProtocolStore()
  const protocol = protocolParam ?? protocolStore

  const [currentSuggestion, setCurrentSuggestion] = useState<string | undefined>()

  useEffect(() => {
    if (protocolParam) return
    setTimeout(() => setSearchParams({ protocol }), 100)
  }, [protocol, protocolParam, setSearchParams])

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
  const isInternal = useInternalRole()
  const [isRangeSelection, setRangeSelection] = useState(() => {
    if (!isInternal) return false
    if (searchParams[rangeFilterKey]) return true
    return false
  })

  const { currentOption: timeOption, changeCurrentOption: setTimeOption } = useOptionChange({
    optionName: timeFilterKey,
    options: TIME_FILTER_OPTIONS,
    defaultOption: TimeFilterByEnum.S30_DAY.toString(),
    optionNameToBeDelete: [rangeFilterKey],
    callback: () => {
      changeCurrentPage(1)
    },
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
    setSearchParams({ [rangeFilterKey]: rangeSearch, [timeFilterKey]: null })
    setTimeRange(range)
    changeCurrentPage(1, false)
    setRangeSelection(true)

    logEventFilter(EVENT_ACTIONS[EventCategory.FILTER].CUSTOM_RANGE)
  }

  const handleSetTimeOption = (timeOption: TimeFilterProps) => {
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
    }
  }

  const { from, to } = useMemo(() => {
    if (isRangeSelection) return timeRange
    const from = dayjs().subtract(timeOption.value, 'days').toDate()
    return { from }
  }, [isRangeSelection, timeOption, timeRange])

  // END TIME FILTER

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.EXPLORER_PAGE,
    limitName: URL_PARAM_KEYS.EXPLORER_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })

  const [filters, setFilters] = useState<ConditionFormValues<TraderData>>(() =>
    getInitFilters({
      searchParams,
      accounts,
      filterTab: FilterTabEnum.DEFAULT,
    })
  )
  const [rankingFilters, setRankingFilters] = useState<ConditionFormValues<TraderData>>(() =>
    getInitFilters({
      searchParams,
      accounts,
      filterTab: FilterTabEnum.RANKING,
    }).filter((option) => !!RANKING_FIELD_NAMES.includes(option.key))
  )
  const changeFilters = (options: ConditionFormValues<TraderData>) => {
    const stringParams = stringifyParams(options)
    setSearchParams({
      [URL_PARAM_KEYS.RANKING_FILTERS]: null,
      [URL_PARAM_KEYS.DEFAULT_FILTERS]: stringParams,
      [URL_PARAM_KEYS.FILTER_TAB]: FilterTabEnum.DEFAULT,
    })
    localStorage.setItem(STORAGE_KEYS.FILTER_TAB, FilterTabEnum.DEFAULT)
    localStorage.setItem(STORAGE_KEYS.DEFAULT_FILTERS, JSON.stringify(options))
    changeCurrentPage(1, false)
    setFilters(options)
  }
  const changeRankingFilters = (options: ConditionFormValues<TraderData>) => {
    const stringParams = stringifyParams(options)
    setSearchParams({
      [URL_PARAM_KEYS.DEFAULT_FILTERS]: null,
      [URL_PARAM_KEYS.RANKING_FILTERS]: stringParams,
      [URL_PARAM_KEYS.FILTER_TAB]: FilterTabEnum.RANKING,
    })
    localStorage.setItem(STORAGE_KEYS.FILTER_TAB, FilterTabEnum.RANKING)
    localStorage.setItem(STORAGE_KEYS.RANKING_FILTERS, JSON.stringify(options))
    changeCurrentPage(1, false)
    setRankingFilters(options)
  }

  const [currentSort, setCurrentSort] = useState<TraderListSortProps<TraderData> | undefined>(() =>
    getInitSort(searchParams)
  )
  const changeCurrentSort = (sort: TraderListSortProps<TraderData> | undefined) => {
    const params: Record<string, string> = {}
    if (sort?.sortBy) params.sort_by = sort.sortBy
    if (sort?.sortType) params.sort_type = sort.sortType
    changeCurrentPage(1, false)
    setSearchParams(params)
    setCurrentSort(sort)
  }
  const filterTab = getInitFilterTab({ searchParams })

  const contextValue: TradersContextData = {
    protocol,
    tab,
    accounts,
    isRangeSelection,
    from,
    to,
    timeRange,
    changeTimeRange: handleSetTimeRange,
    timeOption,
    changeTimeOption: handleSetTimeOption,
    currentPage,
    changeCurrentPage,
    currentSuggestion,
    setCurrentSuggestion,
    currentLimit,
    changeCurrentLimit,
    filters,
    changeFilters,
    rankingFilters,
    changeRankingFilters,
    currentSort,
    changeCurrentSort,
    filterTab,
  }

  return <TradersContext.Provider value={contextValue}>{children}</TradersContext.Provider>
}

const useTradersContext = () => useContext(TradersContext)
export default useTradersContext
