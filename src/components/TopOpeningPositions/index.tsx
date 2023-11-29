import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import Table from 'components/@ui/Table'
import { TableSortProps } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT, RELOAD_TOP_OPENING_POSITIONS } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

import { topOpeningColumns } from './ColumnsData'

const TopOpenPositions = () => {
  const { sm } = useResponsive()
  const { searchParams, setSearchParams } = useSearchParams()
  const { protocol } = useParams<{ protocol: ProtocolEnum }>()
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>(() => {
    const initSortBy = searchParams?.sort_by ?? 'pnl'
    const initSortType = searchParams?.sort_type ?? SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<PositionData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `page`,
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })
  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, currentLimit, currentPage, currentSort, protocol],
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
      keepPreviousData: true,
      refetchInterval: RELOAD_TOP_OPENING_POSITIONS,
    }
  )
  const isMobile = useIsMobile()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const changeCurrentSort = (data: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(data)
    changeCurrentPage(1)
    setTimeout(() => setSearchParams({ sort_by: data?.sortBy ?? null, sort_type: data?.sortType ?? null }), 100)
  }

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute(data))
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  if (isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )
  return data?.meta && data.meta.total > 0 ? (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Box
          sx={{
            flex: '1 0 0',
            overflowX: 'auto',
            ...(sm
              ? {}
              : {
                  '& *': {
                    fontSize: '13px !important',
                    lineHeight: '18px !important',
                  },
                }),
          }}
        >
          <Table
            restrictHeight
            data={data?.data}
            columns={topOpeningColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            onClickRow={handleSelectItem}
          />
        </Box>
        <Box px={2}>
          <PaginationWithLimit
            currentPage={currentPage}
            currentLimit={currentLimit}
            onPageChange={changeCurrentPage}
            onLimitChange={changeCurrentLimit}
            apiMeta={data?.meta}
            menuPosition="top"
            sx={{ my: 1, width: '100%', justifyContent: 'space-between', gap: 2 }}
          />
        </Box>
      </Flex>
      <Drawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        mode="right"
        size={isMobile ? '100%' : '60%'}
        background="neutral6"
      >
        <Container pb={3} sx={{ position: 'relative', width: '100%' }}>
          <IconButton
            icon={<XCircle size={24} />}
            variant="ghost"
            sx={{ position: 'absolute', right: 1, top: 3 }}
            onClick={handleDismiss}
          />
          {!!currentPosition && (
            <PositionDetails protocol={currentPosition.protocol} id={currentPosition.id} isShow={openDrawer} />
          )}
        </Container>
      </Drawer>
    </>
  ) : (
    <NoDataFound />
  )
}

export default TopOpenPositions
