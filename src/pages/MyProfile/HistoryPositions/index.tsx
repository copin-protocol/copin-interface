import { Trans } from '@lingui/macro'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import { TableSortProps } from 'components/@ui/Table/types'
import { CopyPositionData } from 'entities/copyTrade.d'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { Button } from 'theme/Buttons'
import { PaginationWithLimit } from 'theme/Pagination'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, TOOLTIP_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import NoDataOrSelect from '../NoDataOrSelect'
import PositionTable, { historyColumns } from '../PositionTable'
import SelectedTraders from './SelectedTraders'
import useSelectTraders from './useSelectTraders'

export default function HistoryPositions() {
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
    () => ({ traders: selectionState.selectedTraders }),
    [selectionState.selectedTraders]
  )
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, currentPage],
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
  }, [selectionState])

  const hasSelectedTraders = !!selectionState.selectedTraders.length

  return (
    <Flex width="100%" height="100%" flexDirection="column" bg="neutral7">
      <Flex sx={{ alignItems: 'center', height: 50, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        <SelectedTraders
          allTraders={selectionState.allTraders}
          selectedTraders={selectionState.selectedTraders}
          dispatch={dispatch}
          onChangeTraders={onChangeTraders}
        />
      </Flex>
      <Box flex="1 0 0" overflow="hidden">
        {!isLoading && !!selectionState.allTraders.length && !hasSelectedTraders && (
          <NoDataOrSelect
            type="noSelectTradersInHistory"
            actionButton={
              !!selectionState.allTraders.length ? (
                <Button variant="primary" mt={3} onClick={() => dispatch({ type: 'setAllTraders' })}>
                  <Trans>Select All Traders</Trans>
                </Button>
              ) : null
            }
          />
        )}
        {!isLoading && !selectionState.allTraders.length && <NoDataOrSelect type="noTraders" />}
        {hasSelectedTraders && (
          <PositionTable
            data={data?.data}
            columns={historyColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            onClosePositionSuccess={refetch}
            wrapperSx={{ pt: 3 }}
            tableHeadSx={{
              '& th:first-child': {
                pl: 3,
              },
              '& th': {
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
          />
        )}
      </Box>
      {hasSelectedTraders && (
        <PaginationWithLimit
          currentLimit={currentLimit}
          onLimitChange={changeCurrentLimit}
          currentPage={currentPage}
          onPageChange={changeCurrentPage}
          apiMeta={data?.meta}
          sx={{ py: 2 }}
        />
      )}
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
