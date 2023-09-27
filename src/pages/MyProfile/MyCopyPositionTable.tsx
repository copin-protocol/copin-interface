import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

// import { ApiListResponse } from 'apis/api'
import { GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi, getMyCopySourcePositionDetailApi } from 'apis/userApis'
import Container from 'components/@ui/Container'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import Table from 'components/@ui/Table'
import { ColumnData, TableSortProps } from 'components/@ui/Table/types'
import CopyTradePositionDetails from 'components/CopyTradePositionDetails'
import PositionDetails from 'components/PositionDetails'
import { CopyPositionData } from 'entities/copyTrade.d'
import useInfiniteLoadMore from 'hooks/features/useInfiniteLoadMore'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useUsdPrices, { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { PaginationWithLimit } from 'theme/Pagination'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { generateClosedPositionRoute, generateMyOpeningPositionRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

import { renderEntry, renderPnL, renderSource, renderTrader } from './renderProps'

type ExternalSource = {
  prices: UsdPrices
  submitting?: boolean
  currentId?: string
  onViewSource: (data: CopyPositionData, event?: any) => void
}
export default function MyCopyPositionTable({
  userId,
  hideTitle = false,
  tableSettings,
  title,
  titleIcon,
  tableWrapperSx,
  bgColor,
  queryParams,
  tableHeadSx,
  tableBodySx,
  pageParamKey,
  limitParamKey,
  isInfiniteLoad = true,
  defaultSortBy = 'createdAt',
}: {
  userId: string | undefined
  hideTitle?: boolean
  title: string
  titleIcon?: ReactNode
  tableSettings?: ColumnData<CopyPositionData, ExternalSource>[]
  tableWrapperSx?: any
  tableHeadSx?: any
  tableBodySx?: any
  bgColor?: string
  queryParams: GetMyPositionsParams
  pageParamKey: string
  limitParamKey?: string
  isInfiniteLoad?: boolean
  defaultSortBy?: keyof CopyPositionData
}) {
  const isMobile = useIsMobile()
  const { lg, xl } = useResponsive()
  const { prices } = useUsdPrices()
  // const { currentPage, changeCurrentPage } = usePageChange({ pageName: `my-copy-${label}` })

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: pageParamKey,
    limitName: limitParamKey ?? '',
    defaultLimit: DEFAULT_LIMIT,
  })

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyPositionData> | undefined>(() => {
    const initSortBy = defaultSortBy
    const initSortType = SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return { sortBy: initSortBy as TableSortProps<CopyPositionData>['sortBy'], sortType: initSortType as SortTypeEnum }
  })
  const changeCurrentSort = (sort: TableSortProps<CopyPositionData> | undefined) => {
    setCurrentSort(sort)
    changeCurrentPage(1)
  }

  const _queryParams: GetMyPositionsParams = {
    limit: isInfiniteLoad ? currentPage * DEFAULT_LIMIT : currentLimit,
    offset: isInfiniteLoad ? 0 : pageToOffset(currentPage, currentLimit),
    sortBy: currentSort?.sortBy,
    sortType: currentSort?.sortType,
    ...queryParams,
  }
  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, userId, currentPage],
    () => getMyCopyPositionsApi(_queryParams),
    {
      enabled: !!userId,
      retry: 0,
      keepPreviousData: true,
    }
  )
  // logic for infinite load
  const handleFetchNextPage = () => {
    changeCurrentPage(currentPage + 1)
  }
  const hasNextPage = data && data.meta.limit < data.meta.total
  const { scrollRef } = useInfiniteLoadMore({
    fetchNextPage: handleFetchNextPage,
    hasNextPage,
    isLoading,
    // because the inconsistency of code
    isDesktop: true,
  })
  // End

  const [openSourceDrawer, setOpenSourceDrawer] = useState(false)
  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData | undefined>()
  const [positionId, setPositionId] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const handleSelectSourceItem = useCallback(
    async (data: CopyPositionData, event?: any) => {
      event?.stopPropagation()
      if (data.status === PositionStatusEnum.OPEN) {
        setPositionId(undefined)
        setCurrentCopyPosition(data)
        setOpenSourceDrawer(true)
        window.history.replaceState(
          null,
          '',
          // TODO: 2
          generateMyOpeningPositionRoute(data)
        )
      } else {
        setCurrentCopyPosition(data)
        setSubmitting(true)
        const positionDetail = await getMyCopySourcePositionDetailApi({ copyId: data?.id ?? '' })
        setSubmitting(false)
        setPositionId(positionDetail.id)
        setOpenSourceDrawer(true)
        window.history.replaceState(
          null,
          '',
          // TODO: 2
          generateClosedPositionRoute({
            protocol: positionDetail.protocol,
            id: positionDetail.id,
            nextHours: nextHoursParam,
          })
        )
      }
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenSourceDrawer(false)
    setPositionId(undefined)
    setCurrentCopyPosition(undefined)
  }

  const handleSelectCopyItem = async (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }

  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
    setCurrentCopyPosition(undefined)
  }

  return (
    <Flex width="100%" height="100%" flexDirection="column" bg={bgColor}>
      {!hideTitle && title ? (
        <Box px={3} pt={16}>
          <SectionTitle icon={<>{titleIcon}</>} title={title} iconColor="primary1" />
        </Box>
      ) : null}
      {!data?.data.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your {title} Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have a position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data?.data && data.data.length > 0 && (
        <Box flex="1 0 0" overflow="hidden">
          <Table
            wrapperSx={{
              table: {
                '& th:last-child, td:last-child': {
                  pr: 2,
                },
                '& td:last-child': {
                  pr: 2,
                },
              },
              ...tableWrapperSx,
            }}
            tableHeadSx={tableHeadSx}
            tableBodySx={tableBodySx}
            isInfiniteLoad={isInfiniteLoad}
            scrollRef={isInfiniteLoad ? scrollRef : undefined}
            restrictHeight
            data={data?.data}
            columns={tableSettings ? tableSettings : openingColumns}
            isLoading={isLoading}
            // loadingSx={
            //   isInfiniteLoad
            //     ? xl
            //       ? {
            //           position: 'absolute',
            //           bottom: 0,
            //           right: 0,
            //           left: 0,
            //         }
            //       : lg
            //       ? {
            //           position: 'fixed',
            //           bottom: 0,
            //           left: 350,
            //           right: 0,
            //         }
            //       : {
            //           position: 'fixed',
            //           bottom: 0,
            //           left: 0,
            //           right: 0,
            //         }
            //     : undefined
            // }
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            externalSource={{
              prices,
              submitting,
              currentId: currentCopyPosition?.id,
              onViewSource: handleSelectSourceItem,
            }}
            onClickRow={handleSelectCopyItem}
          />
        </Box>
      )}
      {!isInfiniteLoad && data && (
        <PaginationWithLimit
          currentLimit={currentLimit}
          onLimitChange={changeCurrentLimit}
          currentPage={currentPage}
          onPageChange={changeCurrentPage}
          apiMeta={data.meta}
          sx={{ py: 2 }}
        />
      )}
      {openSourceDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openSourceDrawer}
          onDismiss={handleDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral6"
        >
          <Container sx={{ position: 'relative' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3 }}
              onClick={handleDismiss}
            />
            <PositionDetails
              protocol={currentCopyPosition?.protocol}
              id={positionId}
              account={currentCopyPosition?.copyAccount}
              indexToken={currentCopyPosition?.indexToken}
              dataKey={currentCopyPosition?.key}
              isShow={openSourceDrawer}
            />
          </Container>
        </Drawer>
      )}
      {openCopyDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openCopyDrawer}
          onDismiss={handleCopyDismiss}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral5"
        >
          <Container sx={{ position: 'relative', height: '100%' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
              onClick={handleCopyDismiss}
            />
            <CopyTradePositionDetails id={currentCopyPosition?.id} />
          </Container>
        </Drawer>
      )}
    </Flex>
  )
}

export const openingColumns: ColumnData<CopyPositionData, ExternalSource>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '90px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Copy Address',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '120px' },
    // TODO: 2
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={1}>Source</Box>,
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '70px', textAlign: 'right' },
    render: renderSource,
  },
]
export const historyTabColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '115px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Closed Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        {item.status === PositionStatusEnum.CLOSE ? <LocalTimeText date={item.lastOrderAt} /> : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px' },
    render: (item) => (
      <Type.Caption color="neutral1" sx={{ maxWidth: '110px', ...overflowEllipsis(), display: 'block' }}>
        {item.copyTradeTitle}
      </Type.Caption>
    ),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '150px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Size ($)',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta) * item.entryPrice, 0)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta) * item.entryPrice, 0)
          : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    sortBy: 'leverage',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>,
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', textAlign: 'right' },
    render: renderSource,
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    sortBy: 'pnl',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '100px', textAlign: 'center' },
    render: (item) => (
      <Flex width="100%" alignItems="center" justifyContent="center">
        <Tag width={70} status={item.status} />
      </Flex>
    ),
  },
]

export const historyColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Closed Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        {item.status === PositionStatusEnum.CLOSE ? <LocalTimeText date={item.lastOrderAt} /> : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '130px' },
    // TODO: 2
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px' },
    render: (item) => (
      <Type.Caption color="neutral1" sx={{ maxWidth: '110px', ...overflowEllipsis(), display: 'block' }}>
        {item.copyTradeTitle}
      </Type.Caption>
    ),
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', textAlign: 'center' },
    render: renderSource,
  },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '150px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Value',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta), 4, 4)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta), 4, 4)
          : '--'}{' '}
        {/* TODO: 2 */}
        {TOKEN_TRADE_SUPPORT[item.protocol][item.indexToken].symbol}
      </Type.Caption>
    ),
  },
  {
    title: 'Size ($)',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.status === PositionStatusEnum.OPEN
          ? formatNumber(Number(item.sizeDelta) * item.entryPrice, 0)
          : !isNaN(Number(item.totalSizeDelta))
          ? formatNumber(Number(item.totalSizeDelta) * item.entryPrice, 0)
          : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>,
  },
  {
    title: 'Pnl ($)',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: <Box pr={3}>Status</Box>,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '100px', textAlign: 'right' },
    render: (item) => (
      <Flex width="100%" alignItems="center" justifyContent="right">
        <Tag width={70} status={item.status} />
      </Flex>
    ),
  },
]
