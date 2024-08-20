import { useState } from 'react'
import { useQuery } from 'react-query'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import { PositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

export default function useQueryTopOpenings({
  protocol,
  defaultLimit,
  intervalRequest,
  queryKey,
}: {
  protocol: ProtocolEnum
  defaultLimit: number
  intervalRequest?: number
  queryKey?: string
}) {
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>(() => {
    const initSortBy = 'pnl'
    const initSortType = SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<PositionData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `page`,
    limitName: 'limit',
    defaultLimit,
  })
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, queryKey, currentLimit, currentPage, currentSort, protocol],
    () =>
      getTopOpeningPositionsApi({
        protocol,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      retry: 0,
      refetchInterval: intervalRequest,
    }
  )

  return {
    data,
    isLoading,
    currentPage,
    currentLimit,
    changeCurrentPage,
    changeCurrentLimit,
    currentSort,
    setCurrentSort,
  }
}
