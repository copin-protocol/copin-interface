import { useCallback, useMemo } from 'react'

import TableSortMobileButton from 'components/@widgets/TableSortMobileButton'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useSearchParams from 'hooks/router/useSearchParams'
import { columns } from 'pages/PerpDEXsExplorer/configs'
import { TableSortProps } from 'theme/Table/types'
import { SortTypeEnum } from 'utils/config/enums'

const DEFAULT_SORT: TableSortProps<PerpDEXSourceResponse> = { sortBy: 'volume1d', sortType: SortTypeEnum.DESC }
export default function SortButtonMobile() {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentSortBy = (searchParams['sortBy'] ?? 'volume1d') as TableSortProps<PerpDEXSourceResponse>['sortBy']
  const currentSortType = (searchParams['sortType'] ??
    SortTypeEnum.DESC) as TableSortProps<PerpDEXSourceResponse>['sortType']
  const currentSort = useMemo(
    () => ({ sortBy: currentSortBy, sortType: currentSortType }),
    [currentSortBy, currentSortType]
  )
  const changeCurrentSort = useCallback(
    (sort: TableSortProps<PerpDEXSourceResponse> | undefined) => {
      setSearchParams({ ['sortBy']: sort?.sortBy, ['sortType']: sort?.sortType })
    },
    [setSearchParams]
  )
  // TODO: @toanla re-use component
  return (
    <TableSortMobileButton
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
      defaultSort={DEFAULT_SORT}
      tableColumnsData={columns}
    />
  )
}
