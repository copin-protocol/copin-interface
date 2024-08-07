import { useState } from 'react'
import { useQuery } from 'react-query'

import { searchTradersApi } from 'apis/traderApis'
import { TableSortProps } from 'components/@ui/Table/types'
import { TraderData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

export default function useSearchTraders() {
  const { searchParams, setSearchParams } = useSearchParams()
  const keyword = searchParams?.[URL_PARAM_KEYS.SEARCH_KEYWORD] as string
  const protocol = searchParams?.[URL_PARAM_KEYS.PROTOCOL] as ProtocolEnum

  const [currentSort, setCurrentSort] = useState<TableSortProps<TraderData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'lastTradeAtTs'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<TraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })

  const [currentProtocol, setCurrentProtocol] = useState<ProtocolEnum | undefined>(protocol)

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.EXPLORER_PAGE,
    limitName: URL_PARAM_KEYS.EXPLORER_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })

  const { data: searchTraders, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_ALL_TRADERS, currentLimit, currentPage, currentSort, currentProtocol, keyword],
    () =>
      searchTradersApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        protocol: currentProtocol,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
        keyword,
      }),
    {
      enabled: !!keyword,
      keepPreviousData: true,
      retry: 0,
    }
  )

  const changeCurrentSort = (data: TableSortProps<TraderData> | undefined) => {
    setCurrentSort(data)
    changeCurrentPage(1)
    setTimeout(() => setSearchParams({ sort_by: data?.sortBy ?? null, sort_type: data?.sortType ?? null }), 100)
  }

  const changeCurrentProtocol = (data: ProtocolEnum | undefined) => {
    setCurrentProtocol(data)
    changeCurrentPage(1)
    setTimeout(() => setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: data ?? null }), 100)
  }

  return {
    keyword,
    isLoading,
    searchTraders,
    currentProtocol,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
    changeCurrentProtocol,
  }
}
