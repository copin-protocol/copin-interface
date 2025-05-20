import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, BookOpen, Clock, Notebook } from '@phosphor-icons/react'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getHlAccountInfo, getHlOpenOrders, getHlOrderFilled } from 'apis/hyperliquid'
import emptyBg from 'assets/images/opening_empty_bg.png'
import HLTraderPositionListView from 'components/@position/HLTraderPositionsListView'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import Divider from 'components/@ui/Divider'
import { PositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { TabKeyEnum } from 'pages/Explorer/Layouts/layoutConfigs'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import { TabHeader } from 'theme/Tab'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

import HLPositionDetailsDrawer from '../HLTraderPositionDetails/HLPositionDetailsDrawer'
import {
  groupHLOrderFillsByOid,
  parseHLOrderData,
  parseHLOrderFillData,
  parseHLPositionData,
} from '../helpers/hyperliquid'
import OpenOrdersView from './OpenOrdersView'
import OpeningPositionsView from './OpeningPositionsView'
import OrderFiledView from './OrderFilledView'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

const emptySmallCss = {
  // backgroundImage: `url(${emptySmallBg})`,
  // backgroundSize: '98%',
  // backgroundPosition: 'center center',
  // backgroundRepeat: 'no-repeat',
  // backgroundOrigin: 'content-box',
}

export enum HLPositionTab {
  OPEN_POSITIONS = 'open_position',
  OPEN_ORDERS = 'open_order',
  ORDER_FILLED = 'order_filled',
}

export default function HLTraderOpeningPositionsTableView({
  protocol,
  address,
  toggleExpand,
  isExpanded,
  isDrawer,
  isShowIcon = true,
}: {
  address: string
  protocol: ProtocolEnum
  toggleExpand?: () => void
  isExpanded?: boolean
  isDrawer?: boolean
  isShowIcon?: boolean
}) {
  const [tab, setTab] = useState<string>(HLPositionTab.OPEN_POSITIONS)

  //
  const [currentSort, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'pnl',
    sortType: SortTypeEnum.DESC,
  })
  const changeCurrentSortExpanded = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }
  const resetSortOpening = () =>
    setCurrentSort({
      sortBy: 'pnl',
      sortType: SortTypeEnum.DESC,
    })
  const handleToggleExpand = () => {
    resetSortOpening()
    toggleExpand?.()
  }

  const { data: hlAccountData, isLoading } = useQuery(
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

  const [enabledRefetchOpenOrder, setEnabledRefetchOpenOrder] = useState(true)
  const { data: openOrders, isLoading: isLoadingOpenOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_OPEN_ORDERS, address],
    () =>
      getHlOpenOrders({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: enabledRefetchOpenOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: address, data })
      },
    }
  )
  const onOpenOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchOpenOrder(true)
    } else setEnabledRefetchOpenOrder(false)
  }, [])
  openOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  const [enabledRefetchOrderFilled, setEnabledRefetchOrderFilled] = useState(true)
  const { data: filledOrders, isLoading: isLoadingFilledOrders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_FILLED_ORDERS, address],
    () =>
      getHlOrderFilled({
        user: address,
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: enabledRefetchOrderFilled ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderFillData({ account: address, data })
      },
    }
  )
  const onOrderFilledPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchOrderFilled(true)
    } else setEnabledRefetchOrderFilled(false)
  }, [])

  // Sort filled orders by timestamp
  filledOrders?.sort((a, b) => b.timestamp - a.timestamp)

  // Group the filled orders
  const groupedFilledOrders = useMemo(() => {
    if (!filledOrders) return []
    return groupHLOrderFillsByOid(filledOrders)
  }, [filledOrders])

  const totalOpening = hlAccountData?.assetPositions?.length ?? 0
  const totalOpenOrders = openOrders?.length ?? 0
  const totalOrderFilled = groupedFilledOrders?.length ?? 0

  return (
    <Box
      className="opening"
      display={['block', isDrawer ? 'block' : 'flex']}
      flexDirection="column"
      height="100%"
      sx={{
        backgroundColor: !isDrawer && totalOpening ? 'neutral5' : 'transparent',

        ...(totalOpening || isLoading ? {} : isDrawer ? emptySmallCss : emptyCss),
      }}
    >
      <TabHeader
        configs={[
          {
            name: <Trans>Opening Positions</Trans>,
            key: HLPositionTab.OPEN_POSITIONS,
            icon: <Notebook size={20} />,
            activeIcon: <Notebook size={20} weight="fill" />,
            count: totalOpening,
          },
          {
            name: <Trans>Orders</Trans>,
            key: HLPositionTab.OPEN_ORDERS,
            icon: <BookOpen size={20} />,
            activeIcon: <BookOpen size={20} weight="fill" />,
            count: totalOpenOrders,
          },
          {
            name: <Trans>Fills</Trans>,
            key: HLPositionTab.ORDER_FILLED,
            icon: <Clock size={20} />,
            activeIcon: <Clock size={20} weight="fill" />,
            count: totalOrderFilled,
          },
        ]}
        isActiveFn={(config) => config.key === tab}
        onClickItem={(key) => setTab(key as TabKeyEnum)}
        fullWidth={false}
        size="lg"
        sx={{
          '& .tab-header > *': {
            pl: 2,
          },
        }}
        externalWidget={
          isShowIcon &&
          !isDrawer && (
            <IconBox
              icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
              role="button"
              sx={{
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
          )
        }
      />

      {tab === HLPositionTab.OPEN_POSITIONS && (
        <Box flex="1 0 0" display={['block', isDrawer ? 'block' : 'flex']} flexDirection="column" overflow="hidden">
          <OpeningPositionsView
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSortExpanded}
            openOrders={openOrders}
            address={address}
            data={hlAccountData}
            isLoading={isLoading}
            isExpanded={!!isExpanded}
            isDrawer={!!isDrawer}
          />
        </Box>
      )}
      {tab === HLPositionTab.OPEN_ORDERS && (
        <Box
          display={['block', isDrawer ? 'block' : 'flex']}
          flexDirection="column"
          height="100%"
          bg={isDrawer || !totalOpenOrders ? 'transparent' : 'neutral5'}
        >
          <OpenOrdersView
            data={openOrders}
            isLoading={isLoadingOpenOders}
            isDrawer={!!isDrawer}
            isExpanded={!!isExpanded}
            onPageChange={onOpenOrderPageChange}
            toggleExpand={handleToggleExpand}
          />
        </Box>
      )}
      {tab === HLPositionTab.ORDER_FILLED && (
        <Box
          display={['block', isDrawer ? 'block' : 'flex']}
          flexDirection="column"
          height="100%"
          bg={isDrawer || !totalOrderFilled ? 'transparent' : 'neutral5'}
        >
          <OrderFiledView
            onPageChange={onOrderFilledPageChange}
            toggleExpand={handleToggleExpand}
            isLoading={isLoadingFilledOrders}
            data={groupedFilledOrders}
            isDrawer={!!isDrawer}
            isExpanded={!!isExpanded}
          />
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
          <Type.CaptionBold display="block">This trader&quot;s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the trader starts a new position, you&quot;ll see it listed here
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
      {!isDrawer && <Divider />}
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
