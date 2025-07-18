import { Trans } from '@lingui/macro'
import {
  Alarm,
  ArrowsIn,
  ArrowsOutSimple,
  BookOpen,
  Clock,
  ClockCounterClockwise,
  Notebook,
} from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getHlAccountInfo, getHlOpenOrders } from 'apis/hyperliquid'
import emptyBg from 'assets/images/opening_empty_bg.png'
import HLTraderPositionListView from 'components/@position/HLTraderPositionsListView'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import Divider from 'components/@ui/Divider'
import { PositionData } from 'entities/trader'
import { useHyperliquidTraderContext } from 'hooks/features/trader/useHyperliquidTraderContext'
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
import { parseHLOrderData, parseHLPositionData } from '../helpers/hyperliquid'
import HistoricalOrdersView from './HistoricalOrdersView'
import OpenOrdersView from './OpenOrdersView'
import OpeningPositionsView from './OpeningPositionsView'
import OrderFiledView from './OrderFilledView'
import OrderTwapView from './OrderTwapView'

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
  HISTORICAL_ORDERS = 'historical_order',
  ORDER_TWAP = 'order_twap',
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
  const {
    hlAccountData,
    openOrders,
    groupedFilledOrders,
    twapOrders,
    historicalOrders,
    totalOpenOrders,
    totalOpening,
    totalOrderFilled,
    totalTwapFilled,
    totalHistoricalOrders,
    isLoading,
    isLoadingOpenOders,
    isLoadingFilledOrders,
    isLoadingTwapOders,
    isLoadingHistoricalOders,
    onOpenOrderPageChange,
    onOrderFilledPageChange,
    onTwapOrderPageChange,
    onHistoricalOrderPageChange,
  } = useHyperliquidTraderContext()
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
            name: <Trans>Open Positions</Trans>,
            key: HLPositionTab.OPEN_POSITIONS,
            icon: <Notebook size={20} />,
            activeIcon: <Notebook size={20} weight="fill" />,
            count: totalOpening,
          },
          ...(isDrawer
            ? []
            : [
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
                {
                  name: <Trans>History Orders</Trans>,
                  key: HLPositionTab.HISTORICAL_ORDERS,
                  icon: <ClockCounterClockwise size={20} />,
                  activeIcon: <ClockCounterClockwise size={20} weight="fill" />,
                  count: totalHistoricalOrders,
                },
                {
                  name: <Trans>TWAP</Trans>,
                  key: HLPositionTab.ORDER_TWAP,
                  icon: <Alarm size={20} />,
                  activeIcon: <Alarm size={20} weight="fill" />,
                  count: totalTwapFilled,
                },
              ]),
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
      {tab === HLPositionTab.HISTORICAL_ORDERS && (
        <Box
          display={['block', isDrawer ? 'block' : 'flex']}
          flexDirection="column"
          height="100%"
          bg={isDrawer || !totalHistoricalOrders ? 'transparent' : 'neutral5'}
        >
          <HistoricalOrdersView
            onPageChange={onHistoricalOrderPageChange}
            toggleExpand={handleToggleExpand}
            isLoading={isLoadingHistoricalOders}
            data={historicalOrders}
            isDrawer={!!isDrawer}
            isExpanded={!!isExpanded}
          />
        </Box>
      )}
      {tab === HLPositionTab.ORDER_TWAP && (
        <Box
          display={['block', isDrawer ? 'block' : 'flex']}
          flexDirection="column"
          height="100%"
          bg={isDrawer || !totalTwapFilled ? 'transparent' : 'neutral5'}
        >
          <OrderTwapView
            onPageChange={onTwapOrderPageChange}
            isLoading={isLoadingTwapOders}
            data={twapOrders}
            isDrawer={!!isDrawer}
            isExpanded={!!isExpanded}
            toggleExpand={handleToggleExpand}
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

  const totalPositionValue = useMemo(
    () => data?.assetPositions?.reduce((sum, current) => sum + Number(current.position.positionValue), 0) ?? 0,
    [data]
  )

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
            totalPositionValue={totalPositionValue}
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
