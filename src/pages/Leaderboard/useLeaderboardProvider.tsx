import { useResponsive } from 'ahooks'
import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getLeaderboardApi } from 'apis/leaderboardApis'
import { TopTraderData } from 'entities/trader'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { getInitOption } from 'hooks/helpers/useOptionChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { LeaderboardTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { LEADERBOARD_OPTIONS, LeaderboardOptionProps } from 'utils/config/options'
import { getInitNumberValue } from 'utils/helpers/geInitialValue'
import { pageToOffset } from 'utils/helpers/transform'

export interface LeaderboardContextValues {
  data: ApiListResponse<TopTraderData> | undefined
  isLoading: boolean
  keyword?: string
  setKeyword: (value?: string) => void
  currentSort: TableSortProps<TopTraderData> | undefined
  changeCurrentSort: (sort: TableSortProps<TopTraderData> | undefined) => void
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  currentOption: LeaderboardOptionProps
  changeCurrentOption: (option: LeaderboardOptionProps) => void
  onNext: () => void
  onPrevious: () => void
  currentDate: Dayjs
  formatCurrent: string
  formatNext: string
  formatPrev: string
  ignoreNext: boolean
  isCurrentLeaderboard: boolean
  lastTimeUpdated?: string
}

export const LeaderboardContext = createContext({} as LeaderboardContextValues)

const PAGE_PARAM_KEY = URL_PARAM_KEYS.PAGE
const LIMIT_PARAM_KEY = URL_PARAM_KEYS.LIMIT
const TYPE_PARAM_KEY = URL_PARAM_KEYS.LEADERBOARD_TYPE
const DATE_PARAM_KEY = URL_PARAM_KEYS.LEADERBOARD_DATE
export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const { md } = useResponsive()
  const { searchParams, setSearchParams } = useSearchParams()
  const dateParams = searchParams?.[DATE_PARAM_KEY] as string
  const { allowedSelectProtocols } = useProtocolPermission()
  const { protocol: storedProtocol, setProtocol } = useGlobalStore()
  const protocol = allowedSelectProtocols.find((p) => p === storedProtocol)

  useEffect(() => {
    if (!protocol) setProtocol(allowedSelectProtocols[0])
  }, [allowedSelectProtocols, protocol, setProtocol])

  const initDate = dateParams ? dayjs(Number(dateParams)) : dayjs().utc()
  const [queryDate, setQueryDate] = useState(parseQueryDate(initDate))
  const [keyword, setKeyword] = useState<string | undefined>()

  const [currentSort, setCurrentSort] = useState<TableSortProps<TopTraderData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'ranking'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.ASC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<TopTraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })

  const currentPage = getInitNumberValue(searchParams, PAGE_PARAM_KEY, 1)
  const currentLimit = getInitNumberValue(searchParams, LIMIT_PARAM_KEY, DEFAULT_LIMIT)
  const changeCurrentPage = (page: number) => setSearchParams({ [PAGE_PARAM_KEY]: page.toString() })
  const changeCurrentLimit = (limit: number) => setSearchParams({ [LIMIT_PARAM_KEY]: limit.toString() })

  const currentOption = getInitOption({
    initOption: (searchParams[TYPE_PARAM_KEY] as string) ?? '',
    options: LEADERBOARD_OPTIONS,
  })

  const changeCurrentOption = (option: LeaderboardOptionProps) => {
    setQueryDate(parseQueryDate(dayjs().utc()))
    setSearchParams({ [TYPE_PARAM_KEY]: option.id, [PAGE_PARAM_KEY]: '1' })
  }

  const { data, isFetching: isLoading } = useQuery(
    [
      QUERY_KEYS.GET_TRADERS_LEADERBOARD,
      queryDate,
      currentLimit,
      currentPage,
      currentSort,
      protocol,
      keyword,
      currentOption.id,
    ],
    () =>
      getLeaderboardApi({
        protocol,
        keyword,
        queryDate: queryDate.valueOf(),
        statisticType: currentOption.id,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      retry: 0,
      keepPreviousData: true,
      enabled: !!protocol,
    }
  )

  const lastTimeUpdated = data?.data?.[0]?.rankingAt

  const changeCurrentSort = (data: TableSortProps<TopTraderData> | undefined) => {
    setCurrentSort(data)
    setSearchParams({ sort_by: data?.sortBy ?? null, sort_type: data?.sortType ?? null, [PAGE_PARAM_KEY]: '1' })
  }

  const changeSearchParams = (queryDate: Dayjs) => {
    setSearchParams({ [DATE_PARAM_KEY]: queryDate.valueOf().toString(), [PAGE_PARAM_KEY]: '1' })
  }

  const { formatNext, formatPrev, formatCurrent } = useMemo(
    () => getSeasonFormat({ type: currentOption.id, queryDate, shorten: !md }),
    [queryDate, currentOption.id]
  )

  const ignoreNext = useMemo(
    () => ignoreNextSeason({ type: currentOption.id, queryDate }),
    [queryDate, currentOption.id]
  )

  const isCurrentLeaderboard = useMemo(() => {
    const now = dayjs().utc()
    switch (currentOption.id) {
      case LeaderboardTypeEnum.WEEKLY:
        return queryDate.isoWeek() === now.isoWeek() && queryDate.year() === now.year()
      case LeaderboardTypeEnum.MONTHLY:
        return queryDate.month() === now.month() && queryDate.year() === now.year()
    }
  }, [currentOption.id, queryDate])

  const onNext = () => {
    const now = dayjs().utc()
    switch (currentOption.id) {
      case LeaderboardTypeEnum.WEEKLY:
        if (queryDate.isoWeek() >= now.isoWeek() && queryDate.year() == now.year()) return
        setQueryDate((prevDate) => {
          const newDate = prevDate.add(1, 'week')
          changeSearchParams(newDate)
          return newDate
        })
        break
      case LeaderboardTypeEnum.MONTHLY:
        if (queryDate.month() >= now.month() && queryDate.year() == now.year()) return
        setQueryDate((prevDate) => {
          const newDate = prevDate.add(1, 'month')
          changeSearchParams(newDate)
          return newDate
        })
        break
    }
  }

  const onPrevious = () => {
    switch (currentOption.id) {
      case LeaderboardTypeEnum.WEEKLY:
        setQueryDate((prevDate) => {
          const newDate = prevDate.subtract(1, 'week')
          changeSearchParams(newDate)
          return newDate
        })
        break
      case LeaderboardTypeEnum.MONTHLY:
        setQueryDate((prevDate) => {
          const newDate = prevDate.subtract(1, 'month')
          changeSearchParams(newDate)
          return newDate
        })
        break
    }
  }

  const contextValue: LeaderboardContextValues = {
    data,
    isLoading,
    keyword,
    setKeyword,
    currentSort,
    changeCurrentSort,
    currentPage,
    currentLimit,
    changeCurrentPage,
    changeCurrentLimit,
    currentOption,
    changeCurrentOption,
    onNext,
    onPrevious,
    currentDate: queryDate,
    formatCurrent,
    formatNext,
    formatPrev,
    ignoreNext,
    isCurrentLeaderboard,
    lastTimeUpdated,
  }

  return <LeaderboardContext.Provider value={contextValue}>{children}</LeaderboardContext.Provider>
}

const useLeaderboardContext = () => useContext(LeaderboardContext)
export default useLeaderboardContext

function getSeasonFormat({
  type,
  queryDate,
  shorten,
}: {
  type: LeaderboardTypeEnum
  queryDate: Dayjs
  shorten?: boolean
}) {
  let formatCurrent
  let formatPrev
  let formatNext
  const date = queryDate.local()

  switch (type) {
    case LeaderboardTypeEnum.WEEKLY:
      formatCurrent = `${shorten ? '' : 'Week'} ${date.isoWeek()}/${date.format('YYYY')}`
      formatPrev = `${shorten ? '' : 'Week'} ${date.subtract(1, 'week').isoWeek()}/${date.format('YYYY')}`
      formatNext = `${shorten ? '' : 'Week'} ${date.add(1, 'week').isoWeek()}/${date.format('YYYY')}`
      break
    case LeaderboardTypeEnum.MONTHLY:
      formatCurrent = date.format(shorten ? 'MMM' : 'MMMM')
      formatPrev = date.subtract(1, 'month').format(shorten ? 'MMM YYYY' : 'MMMM YYYY')
      formatNext = date.add(1, 'month').format(shorten ? 'MMM YYYY' : 'MMMM YYYY')
      break
  }

  return { formatCurrent, formatPrev, formatNext }
}

function ignoreNextSeason({ type, queryDate }: { type: LeaderboardTypeEnum; queryDate: Dayjs }) {
  const now = dayjs().utc()
  switch (type) {
    case LeaderboardTypeEnum.WEEKLY:
      return queryDate.isoWeek() >= now.isoWeek() && queryDate.year() >= now.year()
    case LeaderboardTypeEnum.MONTHLY:
      return queryDate.month() >= now.month() && queryDate.year() >= now.year()
  }
  return false
}

function parseQueryDate(date: Dayjs) {
  if (isFirstDayOfWeek(date) || isFirstDayOfMonth(date)) return date.subtract(1, 'day')
  return date
}

const isFirstDayOfWeek = (date: Dayjs): boolean => {
  return date.isoWeekday() === 1
}

const isFirstDayOfMonth = (date: Dayjs): boolean => {
  return date.date() === 1
}
