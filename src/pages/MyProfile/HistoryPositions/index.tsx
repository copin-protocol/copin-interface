import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import { TableSortProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { PaginationWithLimit } from 'theme/Pagination'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, TOOLTIP_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import PositionTable, { ListPositionMobile } from '../PositionTable'
import { historyColumns } from '../PositionTable/ListPositions'
import SelectedTraders from './SelectedTraders'
import useSelectTraders from './useSelectTraders'

export default function HistoryPositions() {
  const { myProfile } = useMyProfileStore()
  const storageData = sessionStorage.getItem(STORAGE_KEYS.MY_HISTORY_TRADERS)

  const [selectionState, dispatch] = useSelectTraders(storageData)

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
    if (allData?.length === selectedIds?.length) return
    if (!!selectedIds.length) return selectedIds
    return ['']
  }
  const _queryParams: GetMyPositionsParams = useMemo(
    () => ({
      limit: currentLimit,
      offset: pageToOffset(currentPage, currentLimit),
      sortBy: currentSort?.sortBy,
      sortType: currentSort?.sortType,
    }),
    [currentLimit, currentPage, currentSort?.sortBy, currentSort?.sortType]
  )
  const _queryBody: GetMyPositionRequestBody = useMemo(
    () => ({ traders: checkFilters(selectionState.allTraders, selectionState.selectedTraders) }),
    [selectionState.allTraders, selectionState.selectedTraders]
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

  useEffect(() => {
    const dataStorage = JSON.stringify(selectionState)
    sessionStorage.setItem(STORAGE_KEYS.MY_HISTORY_TRADERS, dataStorage)
    // return () => sessionStorage.removeItem(STORAGE_KEYS.MY_HISTORY_TRADERS)
  }, [selectionState])

  const { sm } = useResponsive()

  return (
    <Flex width="100%" height="100%" flexDirection="column" bg="neutral7">
      <Box
        sx={{
          alignItems: 'center',
          height: 50,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          display: selectionState.allTraders?.length ? 'flex' : 'none',
        }}
      >
        <SelectedTraders
          allTraders={selectionState.allTraders}
          selectedTraders={selectionState.selectedTraders}
          dispatch={dispatch}
          onChangeTraders={onChangeTraders}
        />
      </Box>
      <Box flex="1 0 0" overflow="hidden">
        {sm ? (
          <PositionTable
            data={data?.data}
            columns={historyColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            onClosePositionSuccess={refetch}
            tableHeadSx={{
              '& th:first-child': {
                pl: 3,
              },
              '& th': {
                py: 2,
                pr: '16px !important',
                border: 'none',
              },
            }}
            tableBodySx={{
              borderSpacing: ' 0px 4px',
              'td:first-child': {
                pl: 3,
              },
              '& td': {
                pr: 3,
                bg: 'neutral6',
              },
              '& tbody tr:hover td': {
                bg: 'neutral5',
              },
              ...generateDeletedTraderStyle(selectionState.deletedTraders),
            }}
            noDataMessage={<Trans>No History Found</Trans>}
          />
        ) : (
          <ListPositionMobile
            data={data?.data}
            isLoading={isLoading}
            onClosePositionSuccess={refetch}
            noDataMessage={<Trans>No History Found</Trans>}
          />
        )}
      </Box>
      <PaginationWithLimit
        currentLimit={currentLimit}
        onLimitChange={changeCurrentLimit}
        currentPage={currentPage}
        onPageChange={changeCurrentPage}
        apiMeta={data?.meta}
        sx={{ py: 2 }}
      />
      <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
        <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
          Reverse Copy
        </Type.Caption>
      </Tooltip>
    </Flex>
  )
}

function generateDeletedTraderStyle(addresses: string[]) {
  const key = addresses
    .map((address) => {
      return `[data-trader-address="${address}"]`
    })
    .join(',')
  return {
    '&': {
      [key]: { color: 'neutral3' },
    },
  }
}
