import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, BookOpen, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getHlAccountInfo, getHlOpenOrders } from 'apis/hyperliquid'
import emptyBg from 'assets/images/opening_empty_bg.png'
import emptySmallBg from 'assets/images/opening_emty_small.png'
import HLTraderPositionListView from 'components/@position/HLTraderPositionsListView'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import { drawerOrderColumns, fullOrderColumns, orderColumns } from 'components/@position/configs/hlOrderRenderProps'
import {
  drawerOpeningColumns,
  fullOpeningColumns,
  openingColumns,
} from 'components/@position/configs/hlPositionRenderProps'
import Divider from 'components/@ui/Divider'
import { PositionData } from 'entities/trader'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Tabs, { TabPane } from 'theme/Tab'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

import HLPositionDetailsDrawer from '../HLTraderPositionDetails/HLPositionDetailsDrawer'
import { parseHLOrderData, parseHLPositionData } from '../helpers/hyperliquid'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

const emptySmallCss = {
  backgroundImage: `url(${emptySmallBg})`,
  backgroundSize: '98%',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'content-box',
}

export enum HLPositionTab {
  OPEN_POSITIONS = 'open_position',
  OPEN_ORDERS = 'open_order',
}

export default function HLTraderOpeningPositionsTable({
  protocol,
  address,
  toggleExpand,
  isExpanded,
  isDrawer,
}: {
  address: string
  protocol: ProtocolEnum
  toggleExpand?: () => void
  isExpanded?: boolean
  isDrawer?: boolean
}) {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const [tab, setTab] = useState<string>(HLPositionTab.OPEN_POSITIONS)
  const { lg, xl, sm } = useResponsive()
  const { getListIndexTokenByListSymbols } = useMarketsConfig()

  //
  const [currentSortExpanded, setCurrentSortExpanded] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'pnl',
    sortType: SortTypeEnum.DESC,
  })
  const currentSort = currentSortExpanded
  const changeCurrentSortExpanded = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSortExpanded(sort)
  }
  const resetSortOpening = () =>
    setCurrentSortExpanded({
      sortBy: 'pnl',
      sortType: SortTypeEnum.DESC,
    })
  const handleToggleExpand = () => {
    resetSortOpening()
    toggleExpand?.()
  }

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_DETAIL, address],
    () =>
      getHlAccountInfo({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )

  const tableData = useMemo(() => {
    if (!data?.assetPositions) return undefined
    let openingPositions = parseHLPositionData({ account: address, data: data.assetPositions })
    if (currentSort?.sortBy) {
      openingPositions = openingPositions.sort((a, b) => {
        return (
          (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
          (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
        )
      })
    }

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [currentSort, data])

  const { data: openOrders, isLoading: isLoadingOpenOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_OPEN_ORDERS, address],
    () =>
      getHlOpenOrders({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: address, data })
      },
    }
  )
  openOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
  }

  const handleDismiss = () => {
    setOpenDrawer(false)
  }
  const scrollToTopDependencies = useMemo(() => {
    return isExpanded ? [currentSort?.sortBy, currentSort?.sortType, address, protocol] : [address, protocol]
  }, [isExpanded, currentSort?.sortBy, currentSort?.sortType, address, protocol])

  const totalOpening = data?.assetPositions?.length ?? 0
  const totalOpenOrders = openOrders?.length ?? 0

  const currentOpenOrders = openOrders?.filter((e) => e.pair === currentPosition?.pair)

  return (
    <Box
      className="opening"
      display={['block', 'block', 'block', isDrawer ? 'block' : 'flex']}
      flexDirection="column"
      height="100%"
      sx={{
        backgroundColor: !isDrawer && totalOpening ? 'neutral5' : 'neutral7',
        ...(totalOpening || isLoading ? {} : isDrawer ? emptySmallCss : emptyCss),
      }}
    >
      <Flex px={2} pt={12} alignItems="center" justifyContent="space-between">
        <Tabs
          defaultActiveKey={tab}
          onChange={(tab) => setTab(tab)}
          sx={{
            width: '100%',
          }}
          fullWidth
          headerSx={{
            marginBottom: 0,
            gap: 0,
            width: ['fit-content', 'fit-content', '100%'],
            mb: 0,
            px: 0,
            borderBottom: 'none',
          }}
          tabItemSx={{
            pt: 0,
            // px: 2,
            borderBottom: 'none',
            '&:hover,&:active,&:focus': {
              color: 'neutral1',
            },
          }}
          tabItemActiveSx={{
            color: 'neutral1',
          }}
          inactiveHasLine={false}
        >
          <TabPane
            key={HLPositionTab.OPEN_POSITIONS}
            tab={
              <Flex sx={{ gap: 2 }} alignItems="center">
                <IconBox display={['none', 'none', 'none', 'block']} color="neutral3" icon={<Pulse size={24} />} />

                <Type.BodyBold fontSize={['13px', '13px', '13px', '16px']}>
                  <Trans>Opening Positions</Trans> {totalOpening > 0 && `(${totalOpening})`}
                </Type.BodyBold>
              </Flex>
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={HLPositionTab.OPEN_ORDERS}
            tab={
              <Flex sx={{ gap: 2 }} alignItems="center">
                <IconBox display={['none', 'none', 'none', 'block']} color="neutral3" icon={<BookOpen size={24} />} />
                <Type.BodyBold fontSize={['13px', '13px', '13px', '16px']}>
                  <Trans>Open Orders</Trans> {totalOpenOrders > 0 && `(${totalOpenOrders})`}
                </Type.BodyBold>
              </Flex>
            }
          >
            <></>
          </TabPane>
        </Tabs>
        {!isDrawer && (
          <IconBox
            icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
            role="button"
            sx={{
              position: 'relative',
              top: '-8px',
              width: 32,
              height: 32,
              display: ['none', 'none', 'none', 'none', 'flex'],
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'sm',
              // border: 'small',
              // borderColor: 'neutral4',
              color: 'neutral2',
              '&:hover': { color: 'neutral1' },
            }}
            onClick={handleToggleExpand}
          />
        )}
      </Flex>
      {tab === HLPositionTab.OPEN_POSITIONS && (
        <Box display={['block', 'block', 'block', isDrawer ? 'block' : 'flex']} flexDirection="column" height="100%">
          {isLoading && <Loading />}
          {!data?.assetPositions?.length && !isLoading && (
            <Flex
              p={3}
              flexDirection="column"
              width="100%"
              height={isDrawer ? 60 : 180}
              justifyContent="center"
              alignItems="center"
            >
              <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
              <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
                Once the trader starts a new position, you’ll see it listed here
              </Type.Caption>
            </Flex>
          )}
          {data && data?.assetPositions?.length > 0 && (
            <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
              {sm ? (
                <Table
                  restrictHeight={!isDrawer && lg}
                  wrapperSx={{
                    minWidth: 500,
                  }}
                  tableBodySx={{
                    '& td:last-child': { pr: 2 },
                  }}
                  data={tableData?.data}
                  columns={isDrawer ? drawerOpeningColumns : xl && isExpanded ? fullOpeningColumns : openingColumns}
                  currentSort={currentSort}
                  changeCurrentSort={changeCurrentSortExpanded}
                  isLoading={isLoading}
                  onClickRow={handleSelectItem}
                  renderRowBackground={() => (isDrawer ? themeColors.neutral7 : 'rgb(31, 34, 50)')}
                  scrollToTopDependencies={scrollToTopDependencies}
                />
              ) : (
                <HLTraderPositionListView
                  data={tableData?.data}
                  isLoading={isLoading}
                  scrollDep={tableData?.meta?.offset}
                  onClickItem={handleSelectItem}
                  hasAccountAddress={false}
                />
              )}
            </Box>
          )}
          {protocol === ProtocolEnum.HYPERLIQUID && openDrawer && currentPosition ? (
            <HLPositionDetailsDrawer
              isOpen={openDrawer}
              data={currentPosition}
              orders={currentOpenOrders ?? []}
              onDismiss={handleDismiss}
            />
          ) : (
            <TraderPositionDetailsDrawer
              isOpen={openDrawer}
              onDismiss={handleDismiss}
              protocol={protocol}
              id={currentPosition?.id}
              chartProfitId="opening-position-detail"
            />
          )}
        </Box>
      )}
      {tab === HLPositionTab.OPEN_ORDERS && (
        <Box display={['block', 'block', 'block', isDrawer ? 'block' : 'flex']} flexDirection="column" height="100%">
          {isLoadingOpenOders && <Loading />}
          {!openOrders?.length && !isLoadingOpenOders && (
            <Flex
              p={3}
              flexDirection="column"
              width="100%"
              height={isDrawer ? 60 : 180}
              justifyContent="center"
              alignItems="center"
            >
              <Type.CaptionBold display="block">This trader’s opening orders is empty</Type.CaptionBold>
              <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
                Once the trader starts a new open order, you’ll see it listed here
              </Type.Caption>
            </Flex>
          )}
          {openOrders && openOrders?.length > 0 && (
            <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
              {sm ? (
                <Table
                  restrictHeight={!isDrawer && lg}
                  wrapperSx={{
                    minWidth: 500,
                  }}
                  tableBodySx={{
                    '& td:last-child': { pr: 2 },
                  }}
                  data={openOrders}
                  columns={isDrawer ? drawerOrderColumns : xl && isExpanded ? fullOrderColumns : orderColumns}
                  isLoading={isLoading}
                  renderRowBackground={() => (isDrawer ? themeColors.neutral7 : 'rgb(31, 34, 50)')}
                  scrollToTopDependencies={scrollToTopDependencies}
                />
              ) : (
                <HLTraderPositionListView
                  data={tableData?.data}
                  isLoading={isLoading}
                  scrollDep={tableData?.meta?.offset}
                  onClickItem={handleSelectItem}
                  hasAccountAddress={false}
                />
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export function HLTraderOpeningPositionsListView({
  protocol,
  address,
  isDrawer,
}: {
  address: string
  protocol: ProtocolEnum
  isExpanded?: boolean
  isDrawer?: boolean
}) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { currentPage, currentLimit, changeCurrentLimit, changeCurrentPage } = usePageChangeWithLimit({
    pageName: 'opening_page',
    limitName: 'opening_limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_DETAIL, address],
    () =>
      getHlAccountInfo({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )
  const listData = useMemo(() => {
    if (!data?.assetPositions) return undefined
    const openingPositions = parseHLPositionData({ account: address, data: data.assetPositions })

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [address, data?.assetPositions])

  const { data: openOrders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_OPEN_ORDERS, address],
    () =>
      getHlOpenOrders({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: address, data })
      },
    }
  )
  openOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })
  const currentOpenOrders = openOrders?.filter((e) => e.pair === currentPosition?.pair)

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    if (!!data.txHashes?.length) {
      window.history.pushState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
    }
  }

  const handleDismiss = () => {
    window.history.pushState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }
  const scrollToTopDependencies = useMemo(() => {
    return [address, protocol, currentPage, currentLimit]
  }, [address, protocol, currentPage, currentLimit])

  const offset = pageToOffset(currentPage, currentLimit)
  const pagingData = listData?.data?.slice(offset, offset + currentLimit)
  const total = listData?.data?.length ?? 0
  const totalPages = Math.ceil((listData?.data?.length ?? 0) / currentLimit)

  const totalOpening = listData?.data?.length ?? 0

  return (
    <Flex
      flexDirection="column"
      height="100%"
      width="100%"
      sx={{
        backgroundColor: !isDrawer && totalOpening ? 'neutral5' : 'neutral7',
        ...(totalOpening || isLoading ? {} : isDrawer ? emptySmallCss : emptyCss),
        pb: [0, 12],
      }}
    >
      {isLoading && <Loading />}
      {!listData?.data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the trader starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {listData?.data && listData.data.length > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
          <HLTraderPositionListView
            data={pagingData}
            isLoading={isLoading}
            scrollDep={scrollToTopDependencies}
            onClickItem={handleSelectItem}
            hasAccountAddress={false}
          />
        </Box>
      )}
      <Divider />
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={{ limit: currentLimit, offset, total, totalPages }}
      />

      {protocol === ProtocolEnum.HYPERLIQUID && openDrawer && currentPosition ? (
        <HLPositionDetailsDrawer
          isOpen={openDrawer}
          data={currentPosition}
          orders={currentOpenOrders ?? []}
          onDismiss={handleDismiss}
        />
      ) : (
        <TraderPositionDetailsDrawer
          isOpen={openDrawer}
          onDismiss={handleDismiss}
          protocol={protocol}
          id={currentPosition?.id}
          chartProfitId="opening-position-detail"
        />
      )}
    </Flex>
  )
}
