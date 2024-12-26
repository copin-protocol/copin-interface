import { useCallback, useMemo } from 'react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useSearchParams from 'hooks/router/useSearchParams'
import { TableSortProps } from 'theme/Table/types'
import { SortTypeEnum } from 'utils/config/enums'

export default function useSortData() {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentSortBy = (searchParams['sortBy'] ?? 'volume1d') as TableSortProps<PerpDEXSourceResponse>['sortBy']
  const currentSortType = (searchParams['sortType'] ??
    SortTypeEnum.DESC) as TableSortProps<PerpDEXSourceResponse>['sortType']
  const currentSort = useMemo(() => {
    return { sortBy: currentSortBy, sortType: currentSortType }
  }, [currentSortBy, currentSortType])
  const changeCurrentSort = useCallback(
    (sort: TableSortProps<PerpDEXSourceResponse> | undefined) => {
      setSearchParams({ ['sortBy']: sort?.sortBy, ['sortType']: sort?.sortType })
    },
    [setSearchParams]
  )
  return { currentSort, changeCurrentSort }
}
