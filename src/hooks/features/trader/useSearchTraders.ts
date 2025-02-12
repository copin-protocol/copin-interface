import { useState } from 'react'
import { useQuery } from 'react-query'

import { getHlAccountInfo } from 'apis/hyperliquid'
import { searchTradersApi } from 'apis/traderApis'
import { SearchTradersParams } from 'apis/types'
import { HlAccountData } from 'entities/hyperliquid'
import { TraderData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum, TimeFrameEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'
import { isAddress } from 'utils/web3/contracts'

export default function useSearchTraders({ protocols }: { protocols: ProtocolEnum[] }) {
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
  const queryTraderData: SearchTradersParams = {
    limit: currentLimit,
    offset: pageToOffset(currentPage, currentLimit),
    sortBy: currentSort?.sortBy,
    sortType: currentSort?.sortType,
    keyword,
  }
  if (protocols) {
    queryTraderData.protocols = protocols
  } else {
    const _protocol = !!currentProtocol ? currentProtocol : undefined
    queryTraderData.protocol = _protocol
  }

  const { data: searchTraders, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_ALL_TRADERS, queryTraderData],
    () => searchTradersApi(queryTraderData),
    {
      enabled: !!keyword,
      keepPreviousData: true,
      retry: 0,
    }
  )

  const address = isAddress(keyword)

  const { data: searchHLTrader, isLoading: isLoadingHLTrader } = useQuery(
    [QUERY_KEYS.SEARCH_HL_TRADER, keyword],
    () => getHlAccountInfo({ user: keyword }),
    {
      enabled: address !== '' && currentPage === 1,
      select: (data: HlAccountData) => {
        if (Number(data.marginSummary.accountValue) <= 0) return
        return {
          id: address,
          account: address,
          protocol: ProtocolEnum.HYPERLIQUID,
          type: TimeFrameEnum.ALL_TIME,
        } as TraderData
      },
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
    searchHLTrader,
    isLoadingHLTrader,
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
