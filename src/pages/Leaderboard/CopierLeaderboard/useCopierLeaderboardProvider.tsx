import dayjs from 'dayjs'
import { ReactNode, createContext, useContext, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getCopierLeaderboardApi } from 'apis/copierApis'
import { GetCopierLeaderboardParams } from 'apis/types'
import { COPIER_LEADERBOARD_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import { TimeFilterProps } from 'components/@ui/TimeFilter/type'
import { CopierLeaderboardData } from 'entities/copier'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import {
  CopierLeaderBoardExchangeType,
  CopierLeaderboardTimeFilterEnum,
  CopyTradePlatformEnum,
  SortTypeEnum,
} from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { addressShorten } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'

export interface CopierLeaderboardContextValues {
  data: ApiListResponse<CopierLeaderboardData> | undefined
  myRankingData: CopierLeaderboardData[] | undefined
  isLoading: boolean
  keyword?: string
  setKeyword: (value: string) => void
  currentSort: TableSortProps<CopierLeaderboardData> | undefined
  changeCurrentSort: (sort: TableSortProps<CopierLeaderboardData> | undefined) => void
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  currentTime: TimeFilterProps<CopierLeaderboardTimeFilterEnum, CopierLeaderboardTimeFilterEnum>
  changeCurrentTime: (
    timeOpetion: TimeFilterProps<CopierLeaderboardTimeFilterEnum, CopierLeaderboardTimeFilterEnum>
  ) => void
  currentExchange: CopyTradePlatformEnum | null
  currentExchangeType: CopierLeaderBoardExchangeType | null
  changeExchange: (exchange: CopyTradePlatformEnum) => void
  changeExchangeType: (exchangeType: CopierLeaderBoardExchangeType) => void
  lastTimeUpdated?: string
}

export const CopierLeaderboardContext = createContext({} as CopierLeaderboardContextValues)

export function CopierLeaderboardProvider({ children }: { children: ReactNode }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const [keyword, setKeyword] = useState('')
  const [currentExchangeType, setExchangeType] = useState<CopierLeaderBoardExchangeType | null>(() => {
    const initExchangeType =
      (searchParams?.exchange_type as CopierLeaderBoardExchangeType) ?? CopierLeaderBoardExchangeType.TOTAL
    return initExchangeType
  })
  const [currentExchange, setExchange] = useState<CopierLeaderboardData['exchange'] | null>(() => {
    const initExchange = (searchParams?.exchange as CopyTradePlatformEnum) ?? null
    return initExchange
  })

  const { currentOption: currentTime, setCurrentOption: setTimeOption } = useOptionChange({
    optionName: 'time',
    options: COPIER_LEADERBOARD_TIME_FILTER_OPTIONS,
    defaultOption: CopierLeaderboardTimeFilterEnum.DAILY.toString(),
  })

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopierLeaderboardData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'ranking'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.ASC
    if (!initSortBy) return undefined
    return {
      sortBy: initSortBy as TableSortProps<CopierLeaderboardData>['sortBy'],
      sortType: initSortType as SortTypeEnum,
    }
  })
  const { currentPage, currentLimit, setCurrentPage, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const changeExchange = (exchange: CopyTradePlatformEnum) => {
    setExchange(exchange)
    setExchangeType(null)
    setCurrentPage(1)
    setSearchParams({
      page: null,
      exchange,
      exchange_type: null,
    })
  }
  const changeExchangeType = (exchangeType: CopierLeaderBoardExchangeType) => {
    setExchangeType(exchangeType)
    setExchange(null)
    setCurrentPage(1)
    setSearchParams({
      page: null,
      exchange: null,
      exchange_type: exchangeType,
    })
  }

  const changeCurrentSort = (data: TableSortProps<CopierLeaderboardData> | undefined) => {
    setCurrentSort(data)
    setCurrentPage(1)
    setSearchParams({
      page: null,
      sort_by: data?.sortBy ?? null,
      sort_type: data?.sortType ?? null,
    })
  }
  const changeCurrentTime = (
    timeOption: TimeFilterProps<CopierLeaderboardTimeFilterEnum, CopierLeaderboardTimeFilterEnum>
  ) => {
    setTimeOption(timeOption)
    setCurrentPage(1)
    setSearchParams({
      time: timeOption.id,
      page: null,
    })
  }
  const queryData: GetCopierLeaderboardParams = {
    limit: currentLimit,
    offset: pageToOffset(currentPage, currentLimit),
    // type: currentTime.id,
    sortBy: 'ranking',
    sortType: SortTypeEnum.ASC,
  }
  const yesterday = useRef(dayjs().utc().set('hour', 12).subtract(1, 'day').toISOString())
  {
    if (currentTime.id === CopierLeaderboardTimeFilterEnum.YESTERDAY) {
      queryData.statisticAt = yesterday.current
    } else {
      queryData.type = currentTime.id
    }
    if (currentExchange) {
      queryData.exchange = currentExchange
    } else if (currentExchangeType) {
      queryData.exchangeType = currentExchangeType
    }
    if (keyword) {
      queryData.keyword = keyword
    }
    if (currentSort?.sortBy) {
      queryData.sortBy = currentSort.sortBy
    }
    if (currentSort?.sortType) {
      queryData.sortType = currentSort.sortType
    }
  }
  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.GET_COPIER_LEADERBOARD, queryData],
    () => getCopierLeaderboardApi(queryData),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  const myProfile = useMyProfileStore((s) => s.myProfile)
  const myRankingQueryData = { ...queryData, limit: currentLimit, offset: 0, keyword: myProfile?.username ?? '' }
  const { data: myRankingData, isFetching: isLoadingMyRankingData } = useQuery(
    [QUERY_KEYS.GET_COPIER_LEADERBOARD, myRankingQueryData],
    () => getCopierLeaderboardApi(myRankingQueryData),
    {
      retry: 0,
      keepPreviousData: true,
      enabled: !!myProfile?.username,
      select(data) {
        return data.data?.length
          ? (data.data.map((_data) => ({ ..._data, isMe: true })) as unknown as CopierLeaderboardData[])
          : ([
              {
                id: myRankingQueryData.keyword,
                exchangeType: myRankingQueryData.exchangeType,
                exchange: myRankingQueryData.exchange,
                type: myRankingQueryData.type,
                displayName: addressShorten(myRankingQueryData.keyword),
                ranking: undefined,
                winRate: undefined,
                totalWin: undefined,
                totalLose: undefined,
                estPnl: undefined,
                volume: undefined,
                statisticAt: undefined,
                createdAt: undefined,
                isMe: true,
                plan: myProfile?.plan,
              },
            ] as unknown as CopierLeaderboardData[])
      },
    }
  )

  const lastTimeUpdated = data?.data?.[0]?.updatedAt

  const contextValue: CopierLeaderboardContextValues = {
    data,
    myRankingData,
    isLoading,
    keyword,
    setKeyword,
    currentSort,
    changeCurrentSort,
    currentPage,
    currentLimit,
    changeCurrentPage,
    changeCurrentLimit,
    currentTime,
    changeCurrentTime,
    currentExchange,
    currentExchangeType,
    changeExchange,
    changeExchangeType,
    lastTimeUpdated,
  }

  return <CopierLeaderboardContext.Provider value={contextValue}>{children}</CopierLeaderboardContext.Provider>
}

const useCopierLeaderboardContext = () => useContext(CopierLeaderboardContext)
export default useCopierLeaderboardContext
