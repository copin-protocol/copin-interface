import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import { getOpeningPositionsApi } from 'apis/positionApis'
import { getTraderHistoryApi } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { TableSortProps } from 'components/@ui/Table/types'
import { PositionData } from 'entities/trader'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ALL_TOKENS_ID, TokenOptionProps } from 'utils/config/trades'

export default function useQueryPositions({
  address,
  currencyOption,
  protocol,
  currentSort,
  currentPage,
  changeCurrentPage,
}: {
  address: string
  protocol: ProtocolEnum
  currencyOption: TokenOptionProps | undefined
  currentSort: TableSortProps<PositionData> | undefined
  currentPage: number
  changeCurrentPage: (page: number) => void
}) {
  const rangeFilters: RangeFilter[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  if (!!address) {
    queryFilters.push({ fieldName: 'account', value: address })
  }
  if (currencyOption?.id !== ALL_TOKENS_ID) {
    queryFilters.push({ fieldName: 'indexToken', value: currencyOption?.id })
  }
  const { data: openingPositions, isLoading: isLoadingOpening } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol],
    () => getOpeningPositionsApi({ protocol, account: address }),
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
