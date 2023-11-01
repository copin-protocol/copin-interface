import dayjs, { Dayjs } from 'dayjs'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getLeaderboardApi } from 'apis/leaderboardApis'
import { TableSortProps } from 'components/@ui/Table/types'
import { TopTraderData } from 'entities/trader'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { LeaderboardTypeEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { LEADERBOARD_OPTIONS, LeaderboardOptionProps } from 'utils/config/options'
import { pageToOffset } from 'utils/helpers/transform'

interface ContextValues {
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
  lastTimeUpdated?: string
}

export const LeaderboardContext = createContext({} as ContextValues)

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const dateParams = searchParams?.leaderboard as string
  const protocolParam = searchParams?.protocol as ProtocolEnum
  const { protocol: protocolStore } = useProtocolStore()
  const protocol = protocolParam ?? protocolStore
  const [currentDate, setCurrentDate] = useState(dateParams ? dayjs(Number(dateParams)) : dayjs().utc())
  const [keyword, setKeyword] = useState<string | undefined>()

  const [currentSort, setCurrentSort] = useState<TableSortProps<TopTraderData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'ranking'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.ASC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<TopTraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `page`,
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'leaderboard-type',
    options: LEADERBOARD_OPTIONS,
    callback: () => {
      setCurrentDate(dayjs().utc())
    },
  })

  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.GET_TRADERS_LEADERBOARD, currentLimit, currentPage, currentSort, protocol, keyword, currentOption.id],
    () =>
      getLeaderboardApi({
        protocol,
        keyword,
        statisticType: currentOption.id,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  const lastTimeUpdated = data?.data?.[0]?.rankingAt

  useEffect(() => {
    if (protocolParam) return
    setTimeout(() => setSearchParams({ protocol }), 100)
  }, [protocol, protocolParam, setSearchParams])

  const changeCurrentSort = (data: TableSortProps<TopTraderData> | undefined) => {
    setCurrentSort(data)
    changeCurrentPage(1)
    setTimeout(() => setSearchParams({ sort_by: data?.sortBy ?? null, sort_type: data?.sortType ?? null }), 100)
  }

  const changeSearchParams = (currentDate: Dayjs) => {
    setTimeout(() => setSearchParams({ leaderboard: currentDate.valueOf().toString() }), 100)
  }

  const { formatNext, formatPrev, formatCurrent } = useMemo(
    () => getSeasonFormat({ type: currentOption.id, currentDate }),
    [currentDate, currentOption.id]
  )

  const ignoreNext = useMemo(
    () => ignoreNextSeason({ type: currentOption.id, currentDate }),
    [currentDate, currentOption.id]
  )

  const onNext = () => {
    const now = dayjs().utc()
    switch (currentOption.id) {
      case LeaderboardTypeEnum.WEEKLY:
        if (currentDate.week() >= now.week()) return
        setCurrentDate((prevDate) => {
          const newDate = prevDate.add(1, 'week')
          changeSearchParams(newDate)
          return newDate
        })
        break
      case LeaderboardTypeEnum.MONTHLY:
        if (currentDate.month() >= now.month()) return
        setCurrentDate((prevDate) => {
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
        setCurrentDate((prevDate) => {
          const newDate = prevDate.subtract(1, 'week')
          changeSearchParams(newDate)
          return newDate
        })
        break
      case LeaderboardTypeEnum.MONTHLY:
        setCurrentDate((prevDate) => {
          const newDate = prevDate.subtract(1, 'month')
          changeSearchParams(newDate)
          return newDate
        })
        break
    }
  }

  const contextValue: ContextValues = {
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
    currentDate,
    formatCurrent,
    formatNext,
    formatPrev,
    ignoreNext,
    lastTimeUpdated,
  }

  return <LeaderboardContext.Provider value={contextValue}>{children}</LeaderboardContext.Provider>
}

const useLeaderboardContext = () => useContext(LeaderboardContext)
export default useLeaderboardContext

function getSeasonFormat({ type, currentDate }: { type: LeaderboardTypeEnum; currentDate: Dayjs }) {
  let formatCurrent
  let formatPrev
  let formatNext
  const date = currentDate.local()
  switch (type) {
    case LeaderboardTypeEnum.WEEKLY:
      formatCurrent = `Week ${date.week()}/${date.format('YYYY')}`
      formatPrev = `Week ${date.subtract(1, 'week').week()}/${date.format('YYYY')}`
      formatNext = `Week ${date.add(1, 'week').week()}/${date.format('YYYY')}`
      break
    case LeaderboardTypeEnum.MONTHLY:
      formatCurrent = date.format('MMMM YYYY')
      formatPrev = date.subtract(1, 'month').format('MMMM YYYY')
      formatNext = date.add(1, 'month').format('MMMM YYYY')
      break
  }

  return { formatCurrent, formatPrev, formatNext }
}

function ignoreNextSeason({ type, currentDate }: { type: LeaderboardTypeEnum; currentDate: Dayjs }) {
  const now = dayjs().utc()
  switch (type) {
    case LeaderboardTypeEnum.WEEKLY:
      return currentDate.week() >= now.week()
    case LeaderboardTypeEnum.MONTHLY:
      return currentDate.month() >= now.month()
  }
  return false
}
