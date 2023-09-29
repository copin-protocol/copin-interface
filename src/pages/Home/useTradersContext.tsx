import dayjs from 'dayjs'
import isEqual from 'lodash/isEqual'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { ApiListResponse } from 'apis/api'
import { RequestBodyApiData } from 'apis/types'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { TraderListSortProps } from 'components/Tables/TraderListTable/dataConfig'
import { CheckAvailableResultData, TraderData } from 'entities/trader.d'
import useInternalRole from 'hooks/features/useInternalRole'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { TimeRange } from 'utils/types'

import { getFiltersFromFormValues } from './ConditionFilter/helpers'
import { ConditionFormValues } from './ConditionFilter/types'
import { TabKeyEnum } from './Layouts/layoutConfigs'
import { getInitFilters, getInitSort, getInitValue } from './helpers/getInitValues'
import { stringifyParams } from './helpers/handleParams'
import useRangeFilterData from './hooks/useRangeFilterData'
import useTimeFilterData from './hooks/useTimeFilterData'

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
  filters: ConditionFormValues
  changeFilters: (filters: ConditionFormValues) => void
  currentSort: TraderListSortProps<TraderData> | undefined
  changeCurrentSort: (sort: TraderListSortProps<TraderData> | undefined) => void
  isLoading: boolean
  loadingRangeProgress: CheckAvailableResultData
  data: ApiListResponse<TraderData> | undefined
}

const TradersContext = createContext<TradersContextData>({} as TradersContextData)

const transformRequestWithAccounts = (request: RequestBodyApiData, accounts: string[]) => {
  request.ranges = [
    {
      fieldName: 'account',
      in: accounts,
    },
  ]
  request.pagination = {
    limit: accounts.length,
    offset: 0,
  }
  return request
}

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
  const { protocol } = useProtocolStore()
  const { searchParams, setSearchParams } = useSearchParams()

  const [currentSuggestion, setCurrentSuggestion] = useState<string | undefined>()
  const [requestData, setRequestData] = useState<RequestBodyApiData>(() => {
    const page = getInitValue(searchParams, 'page', 1)
    const limit = getInitValue(searchParams, 'limit', DEFAULT_LIMIT)
    const { sortBy, sortType } = getInitSort(searchParams)
    const request = {
      sortBy,
      sortType,
      ranges: getFiltersFromFormValues(getInitFilters(searchParams, accounts)),
      pagination: {
        limit,
        offset: pageToOffset(page ?? 0, limit ?? 0),
      },
    }
    if (accounts) transformRequestWithAccounts(request, accounts)
    return request
  })
  const handleSetRequestData = useCallback(
    (data: RequestBodyApiData) => {
      if (!data) return
      if (accounts) transformRequestWithAccounts(data, accounts)
      const newRequestData = { ...requestData, ...data }
      if (!isEqual(requestData, newRequestData)) {
        setRequestData(newRequestData)
      }
    },
    [requestData, accounts]
  )

  const logEventFilter = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.FILTER,
      action,
    })
  }

  const timeFilterKey = tab === TabKeyEnum.Explorer ? 'time' : 'time-favorite'
  const rangeFilterKey = tab === TabKeyEnum.Explorer ? 'range' : 'range-favorite'

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

  useEffect(() => {
    handleSetRequestData({})
  }, [accounts, handleSetRequestData])

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
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
    callback: (args) => {
      handleSetRequestData({
        pagination: {
          limit: args?.limit,
          offset: pageToOffset(args?.page ?? 0, args?.limit ?? 0),
        },
      })
      // onDataLoaded && onDataLoaded()
    },
  })

  const [filters, setFilters] = useState<ConditionFormValues>(() => getInitFilters(searchParams, accounts))
  const [currentSort, setCurrentSort] = useState<TraderListSortProps<TraderData> | undefined>(() =>
    getInitSort(searchParams)
  )

  const changeFilters = (options: ConditionFormValues) => {
    const stringParams = stringifyParams(options)
    setSearchParams({ [URL_PARAM_KEYS.CONDITIONAL_FILTERS]: stringParams })
    changeCurrentPage(1, false)
    setFilters(options)
    handleSetRequestData({ ranges: getFiltersFromFormValues(options) })
  }

  const changeCurrentSort = (sort: TraderListSortProps<TraderData> | undefined) => {
    const params: Record<string, string> = {}
    if (sort?.sortBy) params.sort_by = sort.sortBy
    if (sort?.sortType) params.sort_type = sort.sortType
    changeCurrentPage(1, false)
    setSearchParams(params)
    setCurrentSort(sort)
    handleSetRequestData({ sortBy: sort?.sortBy, sortType: sort?.sortType })
  }

  const { rangeTraders, loadingRangeTraders, loadingRangeProgress } = useRangeFilterData({
    protocol,
    tab,
    requestData,
    timeRange,
    isRangeSelection,
  })

  const { timeTraders, loadingTimeTraders } = useTimeFilterData({
    protocol,
    tab,
    requestData,
    timeOption,
    isRangeSelection,
  })

  let data = isRangeSelection ? rangeTraders : timeTraders
  if (accounts && data) {
    const accountsWithInfo: string[] = []
    data.data.forEach((trader) => {
      accountsWithInfo.push(trader.account)
    })
    data = {
      data: [
        ...data.data,
        ...accounts
          .filter((account) => !accountsWithInfo.includes(account))
          .map(
            (account) =>
              ({
                account,
              } as TraderData)
          ),
      ],
      meta: {
        limit: accounts.length,
        offset: 0,
        total: accounts.length,
        totalPages: 1,
      },
    }
  }
  const isLoading = isRangeSelection ? loadingRangeTraders : loadingTimeTraders

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
    currentSort,
    changeCurrentSort,
    loadingRangeProgress,
    isLoading,
    data,
  }

  return <TradersContext.Provider value={contextValue}>{children}</TradersContext.Provider>
}

const useTradersContext = () => useContext(TradersContext)
export default useTradersContext
