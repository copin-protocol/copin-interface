import { useState } from 'react'

import UserActivityView from 'components/@copyActivity/UserActivityView'
import { UserActivityData } from 'entities/user'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'

import SelectWallets from '../SelectWallets'
import SelectedCopyTrades from './SelectedCopyTrades'
import useFilterActivities from './useFilterActivities'

export default function UserActivityPage() {
  const { copyWallets } = useCopyWalletContext()
  const [selectionState, dispatch] = useFilterActivities()
  const selectedWalletIds = selectionState?.selectedWallets?.map((e) => e.id)
  const selectedCopyTradeIds = selectionState?.selectedCopyTrades?.map((e) => e.id)
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: 'page',
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })
  const [currentSort, setCurrentSort] = useState<TableSortProps<UserActivityData> | undefined>(() => {
    const initSortBy: TableSortProps<UserActivityData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  })
  const changeCurrentSort = (sort: TableSortProps<UserActivityData> | undefined) => {
    setCurrentSort(sort)
    changeCurrentPage(1)
  }

  const checkFilters = (allData: any[], selectedIds: string[]) => {
    if (allData?.length === selectedIds?.length) return
    if (!!selectedIds.length) return selectedIds
    return ['']
  }
  const onChangeFilter = () => {
    changeCurrentPage(1)
  }

  return (
    <>
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
        <Flex
          sx={{
            alignItems: 'center',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            height: 40,
            gap: 2,
          }}
        >
          <SelectWallets
            allWallets={selectionState.allWallets}
            selectedWallets={selectionState.selectedWallets}
            onChangeWallets={(wallets) => dispatch({ type: 'setWallets', payload: wallets })}
          />
          <Type.Caption color="neutral4">|</Type.Caption>
          <SelectedCopyTrades
            selectedWallets={selectionState.selectedWallets}
            allCopyTrades={selectionState.allCopyTrades}
            selectedCopyTrades={selectionState.selectedCopyTrades}
            dispatch={dispatch}
            onChangeCopyTrades={onChangeFilter}
          />
        </Flex>
        <UserActivityView
          traders={undefined}
          copyWalletIds={checkFilters(selectionState.allWallets, selectedWalletIds)}
          copyTradeIds={checkFilters(selectionState.allCopyTrades, selectedCopyTradeIds)}
          currentPage={currentPage}
          currentLimit={currentLimit}
          currentSort={currentSort}
          changeCurrentPage={changeCurrentPage}
          changeCurrentLimit={changeCurrentLimit}
          changeCurrentSort={changeCurrentSort}
          copyWallets={copyWallets}
        />
      </Flex>
    </>
  )
}
