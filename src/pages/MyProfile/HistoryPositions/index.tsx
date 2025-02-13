import { useEffect, useState } from 'react'

import { CopyPositionData } from 'entities/copyTrade.d'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import SelectWallets from '../SelectWallets'
import FilterByStatus from './FilterByStatus'
import HistoryPositionsView from './HistoryPositionView'
import SelectedTraders from './SelectedTraders'
import useFilterHistory from './useFilterHistory'

export default function HistoryPositionsPage() {
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
      <HistoryPositionsView
        selectedTraders={checkFilters(selectionState.allTraders, selectionState.selectedTraders)}
        deletedTraders={selectionState.deletedTraders}
        selectedStatus={selectionState.selectedStatus}
        selectedWallets={selectionState.selectedWallets}
        currentSort={currentSort}
        changeCurrentSort={changeCurrentSort}
        currentPage={currentPage}
        currentLimit={currentLimit}
        changeCurrentPage={changeCurrentPage}
        changeCurrentLimit={changeCurrentLimit}
        layoutType="normal"
      />
    </Flex>
  )
}
