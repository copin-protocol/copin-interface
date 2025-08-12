import { useMemo } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'

import { getOpeningPositionsApi } from 'apis/positionApis'
import { getTraderHistoryApi } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { PositionData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
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
  const { isEnableOpeningPosition, isEnablePosition, isUnlimitedPosition, maxPositionHistory } =
    useTraderProfilePermission({ protocol })
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  // if (!!address) {
  //   queryFilters.push({ fieldName: 'account', value: address })
  // }
  if (currentPair) {
    queryFilters.push({ fieldName: 'pair', value: currentPair })
  }
  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol, isEnableOpeningPosition],
    () =>
      getOpeningPositionsApi({
        protocol,
        account: address,
      }),
    { enabled: !!address && isEnableOpeningPosition, retry: 0 }
  )
  const _limit = isUnlimitedPosition ? limit : Math.min(limit, maxPositionHistory)
  const {
    data: closedPositions,
    isFetching: isLoadingClosed,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    [QUERY_KEYS.GET_POSITIONS_HISTORY, address, currentPair, protocol, _limit, isEnablePosition],
    ({ pageParam = 0 }) => {
      return getTraderHistoryApi({
        limit: _limit,
        offset: pageParam,
        account: address,
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
      enabled: !!address && !!currentPair && isEnablePosition && isUnlimitedPosition,
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
