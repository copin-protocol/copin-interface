import { ReactNode, cloneElement, useCallback, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import {
  getHlAccountInfo,
  getHlHistoricalOrders,
  getHlOpenOrders,
  getHlOrderFilled,
  getHlTwapOrderFilled,
} from 'apis/hyperliquid'
import HistoricalOrdersView from 'components/@position/HLTraderOpeningPositions/HistoricalOrdersView'
import OpenOrdersView from 'components/@position/HLTraderOpeningPositions/OpenOrdersView'
import OrderFilledView from 'components/@position/HLTraderOpeningPositions/OrderFilledView'
import OrderTwapView from 'components/@position/HLTraderOpeningPositions/OrderTwapView'
import { TraderOpeningPositionsListViewProps } from 'components/@position/TraderOpeningPositions'
import {
  groupHLOrderFillsByOid,
  parseHLHistoricalOrderData,
  parseHLOrderData,
  parseHLTwapOrderFillData,
} from 'components/@position/helpers/hyperliquid'
import { parseHLOrderFillData } from 'components/@position/helpers/hyperliquid'
import useSearchParams from 'hooks/router/useSearchParams'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { HYPERLIQUID_TABS, LITE_TABS, TABS, TabsKeyEnumPosition } from './tabPositionConfigs'

export default function PositionMobileView({
  historyPositions,
  openingPositions,
  protocol,
  address,
  isLite,
  isDrawer,
}: {
  historyPositions: ReactNode
  openingPositions: ReactNode
  protocol?: ProtocolEnum
  address?: string
  isLite?: boolean
  isDrawer?: boolean
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentTabKey = searchParams['position_tab'] ?? TabsKeyEnumPosition.OPENING
  const handleChangeTab = (key: string) => setSearchParams({ ['position_tab']: key })
  const firstLoadedRef = useRef(!!searchParams['position_tab'] ? true : false)
  const handleNoOpeningPositionsLoaded = () => {
    if (firstLoadedRef.current) return
    firstLoadedRef.current = true
    handleChangeTab(TabsKeyEnumPosition.CLOSED)
  }

  const isHyperliquid = protocol === ProtocolEnum.HYPERLIQUID

  const { data: hlAccountData, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_DETAIL, address],
    () =>
      getHlAccountInfo({
        user: address ?? '',
      }),
    {
      enabled: !!address && isHyperliquid,
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
        user: address ?? '',
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchOpenOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: address ?? '', data })
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
        user: address ?? '',
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchOrderFilled ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderFillData({ account: address ?? '', data })
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

  const [enabledRefetchHistoricalOrder, setEnabledRefetchHistoricalOrder] = useState(true)
  const { data: historicalOrders, isLoading: isLoadingHistoricalOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_HISTORICAL_ORDERS, address],
    () =>
      getHlHistoricalOrders({
        user: address ?? '',
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchHistoricalOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLHistoricalOrderData({ account: address ?? '', data })
      },
    }
  )
  const onHistoricalOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchHistoricalOrder(true)
    } else setEnabledRefetchHistoricalOrder(false)
  }, [])

  const [enabledRefetchTwapOrder, setEnabledRefetchTwapOrder] = useState(true)
  const { data: twapOrders, isLoading: isLoadingTwapOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TWAP_ORDERS, address],
    () =>
      getHlTwapOrderFilled({
        user: address ?? '',
      }),
    {
      enabled: !!address && protocol === ProtocolEnum.HYPERLIQUID,
      retry: 0,
      refetchInterval: enabledRefetchTwapOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLTwapOrderFillData({ account: address ?? '', data })
      },
    }
  )
  const onTwapOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchTwapOrder(true)
    } else setEnabledRefetchTwapOrder(false)
  }, [])
  twapOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <TabHeader
        configs={isLite ? LITE_TABS : isHyperliquid ? (isDrawer ? TABS : HYPERLIQUID_TABS) : TABS}
        // configs={isLite ? LITE_TABS : isHyperliquid ? hlTabs : TABS}
        isActiveFn={(config) => config.key === currentTabKey}
        onClickItem={handleChangeTab}
        hasLine
        itemSx={isHyperliquid && { px: '10px' }}
      />
      <Box flex="1 0 0" overflow="hidden">
        {currentTabKey === TabsKeyEnumPosition.OPENING &&
          cloneElement<TraderOpeningPositionsListViewProps>(openingPositions as any, {
            onNoPositionLoaded: handleNoOpeningPositionsLoaded,
          })}
        {currentTabKey === TabsKeyEnumPosition.CLOSED && historyPositions}
        {currentTabKey === TabsKeyEnumPosition.OPEN_ORDERS && (
          <Box display="flex" flexDirection="column" height="100%">
            <OpenOrdersView
              data={openOrders}
              isLoading={isLoadingOpenOders}
              isDrawer={false}
              isExpanded={true}
              onPageChange={onOpenOrderPageChange}
              toggleExpand={undefined}
            />
          </Box>
        )}
        {currentTabKey === TabsKeyEnumPosition.FILLS && (
          <OrderFilledView
            toggleExpand={() => {
              //
            }}
            onPageChange={onOrderFilledPageChange}
            isLoading={isLoadingFilledOrders}
            data={groupedFilledOrders}
            isDrawer={false}
            isExpanded={true}
          />
        )}
        {currentTabKey === TabsKeyEnumPosition.HISTORICAL && (
          <HistoricalOrdersView
            toggleExpand={() => {
              //
            }}
            onPageChange={onHistoricalOrderPageChange}
            isLoading={isLoadingHistoricalOders}
            data={historicalOrders}
            isDrawer={false}
            isExpanded={true}
          />
        )}
        {currentTabKey === TabsKeyEnumPosition.TWAP && (
          <OrderTwapView
            toggleExpand={() => {
              //
            }}
            onPageChange={onTwapOrderPageChange}
            isLoading={isLoadingTwapOders}
            data={twapOrders}
            isDrawer={false}
            isExpanded={true}
          />
        )}
      </Box>
    </Flex>
  )
}
