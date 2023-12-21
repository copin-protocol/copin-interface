import { useState } from 'react'
import { useQuery } from 'react-query'

import { searchTradersApi } from 'apis/traderApis'
import { TableSortProps } from 'components/@ui/Table/types'
import { TraderData } from 'entities/trader'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS } from 'utils/config/protocols'
import { pageToOffset } from 'utils/helpers/transform'

export default function useSearchTraders() {
  const { searchParams, setSearchParams } = useSearchParams()
  const keyword = searchParams?.[URL_PARAM_KEYS.SEARCH_KEYWORD] as string
  const { protocol } = useProtocolStore()

  const [currentSort, setCurrentSort] = useState<TableSortProps<TraderData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'lastTradeAtTs'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<TraderData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })

  const { currentOption: currentProtocol, changeCurrentOption: changeCurrentProtocol } = useOptionChange({
    optionName: 'protocol',
    options: PROTOCOL_OPTIONS,
    defaultOption: protocol,
    callback: () => {
      changeCurrentPage(1)
    },
  })

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.EXPLORER_PAGE,
    limitName: URL_PARAM_KEYS.EXPLORER_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })

  const { data: searchTraders, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_ALL_TRADERS, currentLimit, currentPage, currentProtocol, currentSort, keyword],
    () =>
      searchTradersApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        protocol: currentProtocol.id,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
        keyword,
      }),
    {
      enabled: !!keyword && !!currentProtocol.id,
    }
  )

  const changeCurrentSort = (data: TableSortProps<TraderData> | undefined) => {
    setCurrentSort(data)
    changeCurrentPage(1)
    setTimeout(() => setSearchParams({ sort_by: data?.sortBy ?? null, sort_type: data?.sortType ?? null }), 100)
  }

  return {
    keyword,
    isLoading,
    searchTraders,
    changeCurrentProtocol,
    currentProtocol,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
  }
}
