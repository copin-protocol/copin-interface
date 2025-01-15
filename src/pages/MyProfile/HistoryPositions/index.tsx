import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyHistoryPositions from 'components/@position/CopyHistoryPositions'
import { CopyPositionData } from 'entities/copyTrade.d'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { PaginationWithLimit } from 'theme/Pagination'
import { TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, TOOLTIP_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import SelectWallets from '../SelectWallets'
import FilterByStatus from './FilterByStatus'
import SelectedTraders from './SelectedTraders'
import useFilterHistory from './useFilterHistory'

export default function HistoryPositions() {
  const { myProfile } = useMyProfileStore()

  const [selectionState, dispatch] = useFilterHistory()

  const selectedWallets =
    selectionState.allWallets?.length === selectionState.selectedWallets?.length
      ? undefined
      : selectionState.selectedWallets?.map((data) => data.id)

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    limitName: URL_PARAM_KEYS.MY_PROFILE_ALL_HISTORY_LIMIT,
    pageName: URL_PARAM_KEYS.MY_PROFILE_ALL_HISTORY_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  })

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyPositionData> | undefined>(() => {
    const initSortBy: TableSortProps<CopyPositionData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  })
  const changeCurrentSort = (sort: TableSortProps<CopyPositionData> | undefined) => {
    setCurrentSort(sort)
    changeCurrentPage(1)
  }

  const checkFilters = (allData: any[], selectedIds: string[]) => {
    if (selectedWallets == null && allData?.length === selectedIds?.length) {
      return undefined
    } else {
      return selectedIds?.length ? selectedIds : ['']
    }
  }

  const _queryParams: GetMyPositionsParams = useMemo(
    () => ({
      limit: currentLimit,
      offset: pageToOffset(currentPage, currentLimit),
      sortBy: currentSort?.sortBy,
      sortType: currentSort?.sortType,
      status: selectionState.selectedStatus?.length > 1 ? undefined : selectionState.selectedStatus,
    }),
    [currentLimit, currentPage, currentSort?.sortBy, currentSort?.sortType, selectionState.selectedStatus]
  )
  const _queryBody: GetMyPositionRequestBody = useMemo(
    () => ({
      traders: checkFilters(selectionState.allTraders, selectionState.selectedTraders),
      copyWalletIds: selectionState.selectedWallets.map((wallet) => wallet.id),
    }),
    [selectionState.allTraders, selectionState.selectedTraders, selectionState.selectedWallets]
  )
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, currentPage, myProfile?.id],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  const onChangeTraders = () => {
    changeCurrentPage(1)
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <Flex width="100%" height="100%" flexDirection="column" bg="neutral7">
      <Flex
        sx={{
          alignItems: 'center',
          height: [56, 40],
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          display: selectionState.allTraders?.length ? 'flex' : 'none',
          gap: 2,
          pr: 2,
        }}
      >
        <SelectWallets
          allWallets={selectionState.allWallets}
          selectedWallets={selectionState.selectedWallets}
          onChangeWallets={(wallets) => dispatch({ type: 'setWallets', payload: wallets })}
        />
        <Type.Caption color="neutral4">|</Type.Caption>
        <SelectedTraders
          copyWalletIds={selectedWallets}
          allTraders={selectionState.allTraders}
          selectedTraders={selectionState.selectedTraders}
          dispatch={dispatch}
          onChangeTraders={onChangeTraders}
        />
        <Type.Caption color="neutral4">|</Type.Caption>
        <Box sx={{ flexShrink: 0, minWidth: 100 }}>
          <FilterByStatus
            selected={selectionState.selectedStatus}
            handleChangeStatus={(status) => dispatch({ type: 'toggleStatus', payload: status })}
            vertical
          />
        </Box>
      </Flex>
      <Box flex="1 0 0" overflow="hidden">
        <CopyHistoryPositions
          data={data?.data}
          isLoading={isLoading}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          onClosePositionSuccess={refetch}
          deletedTraders={selectionState.deletedTraders}
        />
      </Box>
      <PaginationWithLimit
        currentLimit={currentLimit}
        onLimitChange={changeCurrentLimit}
        currentPage={currentPage}
        onPageChange={changeCurrentPage}
        apiMeta={data?.meta}
        sx={{ py: 1 }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          Reverse Copy
        </Type.Caption>
      </Tooltip>
    </Flex>
  )
}
