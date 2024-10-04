import { useMemo } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'

import { getOpeningPositionsApi } from 'apis/positionApis'
import { getTraderHistoryApi } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { PositionData } from 'entities/trader'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getNextParam } from 'utils/helpers/transform'

export function useQueryInfinitePositions({
  address,
  currentPair,
  protocol,
  limit,
}: {
  address: string
  protocol: ProtocolEnum
  currentPair: string | undefined
  limit: number
}) {
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  if (!!address) {
    queryFilters.push({ fieldName: 'account', value: address })
  }
  if (currentPair) {
    queryFilters.push({ fieldName: 'pair', value: currentPair })
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
    [QUERY_KEYS.GET_POSITIONS_HISTORY, address, currentPair, protocol, limit],
    ({ pageParam = 0 }) => {
      return getTraderHistoryApi({
        limit,
        offset: pageParam,
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
      enabled: !!address && !!currentPair,
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
