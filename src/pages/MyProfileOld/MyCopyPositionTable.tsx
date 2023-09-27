import { CaretRight, ClockCounterClockwise, Pulse, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

// import { ApiListResponse } from 'apis/api'
import { GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionDetailApi, getMyCopyPositionsApi } from 'apis/userApis'
import Container from 'components/@ui/Container'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import { CopyPositionData } from 'entities/copyTrade.d'
import useInfiniteLoadMore from 'hooks/features/useInfiniteLoadMore'
import useIsMobile from 'hooks/helpers/useIsMobile'
import usePageChange from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useUsdPrices, { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { generateClosedPositionRoute, generateMyOpeningPositionRoute } from 'utils/helpers/generateRoute'

import { renderEntry, renderPnL, renderTrader } from './renderProps'

type ExternalSource = {
  prices: UsdPrices
  submitting?: boolean
  currentId?: string
}
export default function MyCopyPositionTable({
  userId,
  status,
}: {
  userId: string | undefined
  status: PositionStatusEnum
}) {
  const isMobile = useIsMobile()
  const { lg, xl } = useResponsive()
  const { prices } = useUsdPrices()

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.MY_PROFILE_HISTORY_PAGE })

  const _queryParams: GetMyPositionsParams = {
    limit: currentPage * DEFAULT_LIMIT,
    offset: 0,
    status: status ? [status] : undefined,
  }
  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, status, userId, currentPage],
    () => getMyCopyPositionsApi(_queryParams),
    { enabled: !!userId, retry: 0, keepPreviousData: true }
  )
  const handleFetchNextPage = () => {
    changeCurrentPage(currentPage + 1)
  }
  const hasNextPage = data && data.meta.limit < data.meta.total
  const { scrollRef } = useInfiniteLoadMore({
    fetchNextPage: handleFetchNextPage,
    hasNextPage,
    isLoading,
    isDesktop: xl,
  })

  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData | undefined>()
  const [positionId, setPositionId] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined

  const handleSelectItem = useCallback(
    async (data: CopyPositionData) => {
      if (data.status === PositionStatusEnum.OPEN) {
        setPositionId(undefined)
        setCurrentCopyPosition(data)
        setOpenDrawer(true)
        window.history.replaceState(
          null,
          '',
          // TODO: 2
          generateMyOpeningPositionRoute(data)
        )
      } else {
        setCurrentCopyPosition(data)
        setSubmitting(true)
        const positionDetail = await getMyCopyPositionDetailApi({ copyId: data?.id ?? '' })
        setSubmitting(false)
        setPositionId(positionDetail.id)
        setOpenDrawer(true)
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
    setOpenDrawer(false)
    setPositionId(undefined)
    setCurrentCopyPosition(undefined)
  }

  const Icon = status === PositionStatusEnum.OPEN ? Pulse : ClockCounterClockwise

  const title = status === PositionStatusEnum.OPEN ? 'Opening Positions' : 'History'

  return (
    <>
      <Box px={12} pt={16}>
        <SectionTitle icon={<Icon size={24} />} title={title} />
      </Box>
      {!data?.data.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">Your {title} Is Empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once you have {PositionStatusEnum.OPEN ? 'an opening' : 'a closed'} position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data?.data && data.data.length > 0 && (
        <Box flex="1" overflowX="auto" overflowY={'hidden'} height="100%">
          <Table
            wrapperSx={{
              minWidth: 500,
            }}
            isInfiniteLoad
            scrollRef={scrollRef}
            restrictHeight={xl}
            data={data?.data}
            columns={columns}
            isLoading={isLoading}
            loadingSx={
              xl
                ? {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                  }
                : lg
                ? {
                    position: 'fixed',
                    bottom: 0,
                    left: 350,
                    right: 0,
                  }
                : {
                    position: 'fixed',
                    bottom: 160,
                    left: 0,
                    right: 0,
                  }
            }
            externalSource={{ prices, submitting, currentId: currentCopyPosition?.id }}
            onClickRow={handleSelectItem}
          />
        </Box>
      )}
      {openDrawer && currentCopyPosition && (
        <Drawer
          isOpen={openDrawer}
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
              protocol={currentCopyPosition.protocol}
              id={positionId}
              account={currentCopyPosition?.copyAccount}
              indexToken={currentCopyPosition?.indexToken}
              dataKey={currentCopyPosition?.key}
              isShow={openDrawer}
            />
          </Container>
        </Drawer>
      )}
    </>
  )
}

// const columns: ColumnProps<CopyPositionData, ExternalSource>[] = [
//   {
//     title: 'Time',
//     columnSx: { minWidth: '120px', width: '30%' },
//     key: 'createdAt',
//     render: (item: CopyPositionData) => (
//       <Flex flexDirection="column">
//         <Type.Caption color="neutral1">{formatLocalRelativeDate(item.createdAt)}</Type.Caption>
//         <Link to={`${ROUTES.TRADER_DETAILS.path_prefix}/${item.copyAccount}`}>
//           <Type.CaptionBold color="neutral1" sx={{ ':hover': { textDecoration: 'underline' } }}>
//             Copy: {addressShorten(item.copyAccount, 3, 5)}
//           </Type.CaptionBold>
//         </Link>
//         {item.name && (
//           <Type.Caption mt="2px" color="neutral3">
//             {formatTraderName(item.name)}
//           </Type.Caption>
//         )}
//       </Flex>
//     ),
//   },
//   {
//     title: 'Entry',
//     columnSx: { minWidth: '180px', width: '40%' },
//     key: 'entryPrice',
//     render: renderEntry,
//   },
//   {
//     title: 'PnL ($)',
//     columnSx: { minWidth: '80px', width: '15%' },
//     key: 'sizeDelta',
//     render: (item: CopyPositionData, index, externalSource) => renderPnL(item, externalSource?.prices),
//   },
//   {
//     title: 'Status',
//     columnSx: { minWidth: '80px', width: '15%' },
//     key: 'status',
//     align: 'right',
//     render: (item: CopyPositionData) => <Tag width={70} status={item.status} />,
//   },
// ]

const columns: ColumnData<CopyPositionData, ExternalSource>[] = [
  {
    title: 'Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { width: '90px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <LocalTimeText date={item.status === PositionStatusEnum.CLOSE ? item.lastOrderAt : item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Copy Address',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { width: '140px' },
    render: (item) => renderTrader({ protocol: item.protocol, address: item.copyAccount }),
  },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { width: '140px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Pnl $',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { width: '80px', textAlign: 'right' },
    render: (item, index, externalSource) => renderPnL(item, externalSource?.prices),
  },
  {
    title: ' ',
    dataIndex: 'id',
    key: 'id',
    style: { width: '20px', textAlign: 'right' },
    render: (item, index, externalSource) => {
      return externalSource?.submitting && externalSource?.currentId === item.id ? (
        <Loading size={12} margin="0 4px!important" />
      ) : (
        <Box sx={{ position: 'relative', top: '2px' }}>
          <CaretRight />
        </Box>
      )
    },
  },
]
