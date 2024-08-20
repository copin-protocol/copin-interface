import { useCallback, useMemo } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'

import { getOpeningPositionsApi } from 'apis/positionApis'
import { getTraderHistoryApi } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { PositionData } from 'entities/trader'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ALL_TOKENS_ID, TokenOptionProps, getTokenTradeList } from 'utils/config/trades'
import { getNextParam } from 'utils/helpers/transform'

export default function useQueryPositions({
  address,
  currencyOption,
  protocol,
  currentSort,
  currentSortOpening,
  currentPage,
  changeCurrentPage,
}: {
  address: string
  protocol: ProtocolEnum
  currencyOption: TokenOptionProps | undefined
  currentSort: TableSortProps<PositionData> | undefined
  currentSortOpening: TableSortProps<PositionData> | undefined
  currentPage: number
  changeCurrentPage: (page: number) => void
}) {
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  if (!!address) {
    queryFilters.push({ fieldName: 'account', value: address })
  }
  if (currencyOption?.id && currencyOption?.id !== ALL_TOKENS_ID) {
    const indexTokens = getTokenTradeList(protocol)
      .filter((e) => e.symbol === currencyOption?.id)
      ?.map((e) => e.address)
    // queryFilters.push({ fieldName: 'indexToken', value: currencyOption?.id })
    rangeFilters.push({ fieldName: 'indexToken', in: indexTokens })
  }

  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol, currentSortOpening],
    () =>
      getOpeningPositionsApi({
        protocol,
        account: address,
        sortBy: currentSortOpening?.sortBy,
        sortType: currentSortOpening?.sortType,
      }),
    { enabled: !!address, retry: 0 }
  )
  const { data: closedPositions, isFetching: isLoadingClosed } = useQuery(
    [
      QUERY_KEYS.GET_POSITIONS_HISTORY,
      address,
      currentPage,
      currencyOption?.id,
      currentSort?.sortBy,
      currentSort?.sortType,
      protocol,
    ],
    () =>
      getTraderHistoryApi({
        limit: currentPage * DEFAULT_LIMIT,
        offset: 0,
        sort: currentSort,
        protocol,
        queryFilters,
        rangeFilters,
      }),
    { enabled: !!address, retry: 0, keepPreviousData: true }
  )
  const handleFetchClosedPositions = useCallback(() => {
    changeCurrentPage(currentPage + 1)
  }, [changeCurrentPage, currentPage])
  const hasNextClosedPositions = useMemo(() => {
    return closedPositions && closedPositions.meta.limit < closedPositions.meta.total
  }, [closedPositions])
  return useMemo(
    () => ({
      openingPositions,
      isLoadingOpening,
      closedPositions,
      isLoadingClosed,
      handleFetchClosedPositions,
      hasNextClosedPositions,
    }),
    [
      closedPositions,
      handleFetchClosedPositions,
      hasNextClosedPositions,
      isLoadingClosed,
      isLoadingOpening,
      openingPositions,
    ]
  )
}

export function useInfiniteQueryPositions({
  address,
  currencyOption,
  protocol,
  currentSort,
  currentPage,
  changeCurrentPage,
  limit,
}: {
  address: string
  protocol: ProtocolEnum
  currencyOption: TokenOptionProps | undefined
  currentSort: TableSortProps<PositionData> | undefined
  currentPage: number
  changeCurrentPage: (page: number) => void
  limit: number
}) {
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  if (!!address) {
    queryFilters.push({ fieldName: 'account', value: address })
  }
  if (currencyOption?.id && currencyOption?.id !== ALL_TOKENS_ID) {
    const indexTokens = getTokenTradeList(protocol)
      .filter((e) => e.symbol === currencyOption?.id)
      ?.map((e) => e.address)
    // queryFilters.push({ fieldName: 'indexToken', value: currencyOption?.id })
    rangeFilters.push({ fieldName: 'indexToken', in: indexTokens })
  }
  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol],
    () =>
      getOpeningPositionsApi({
        protocol,
        account: address,
      }),
    { enabled: !!address, retry: 0 }
  )
  const {
    data: closedPositions,
    isFetching: isLoadingClosed,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    [
      QUERY_KEYS.GET_POSITIONS_HISTORY,
      address,
      // currentPage,
      currencyOption?.id,
      currentSort?.sortBy,
      currentSort?.sortType,
      protocol,
      limit,
    ],
    ({ pageParam = 0 }) => {
      // return getNotificationsApi({ limit, offset: pageParam, otherParams })
      return getTraderHistoryApi({
        limit,
        offset: pageParam,
        sort: currentSort,
        protocol,
        queryFilters,
        rangeFilters,
      })
    },
    {
      getNextPageParam: (prev) => {
        return getNextParam(limit, prev.meta)
      },
      retry: 0,
      enabled: !!address && !!currencyOption?.id,
      keepPreviousData: true,
    }
  )
  return useMemo(
    () => ({
      openingPositions,
      isLoadingOpening,
      closedPositions: closedPositions?.pages.reduce((result, data) => {
        return [...result, ...(data?.data || [])]
      }, [] as PositionData[]),
      isLoadingClosed,
      handleFetchClosedPositions: fetchNextPage,
      hasNextClosedPositions: hasNextPage,
    }),
    [closedPositions, fetchNextPage, hasNextPage, isLoadingClosed, isLoadingOpening, openingPositions]
  )
}
