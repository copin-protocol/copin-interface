import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { SEARCH_DAILY_ORDERS_QUERY, SEARCH_ORDERS_FUNCTION_NAME, SEARCH_ORDERS_INDEX } from 'graphql/query'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { ApiListResponse, ApiMeta } from 'apis/api'
import DailyOrderListView from 'components/@dailyTrades/OrderListView'
import ToggleLiveButton from 'components/@dailyTrades/ToggleLIveButton'
import { DirectionFilterEnum } from 'components/@dailyTrades/configs'
import { TraderPositionDetailsFromOrderDrawer } from 'components/@position/TraderPositionDetailsDrawer'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import ToastBody from 'components/@ui/ToastBody'
import { OrderData } from 'entities/trader'
import useCheckFeature from 'hooks/features/subscription/useCheckFeature'
import useLiveTradesPermission from 'hooks/features/subscription/useLiveTradesPermission'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { MAX_LIST_DATA_LIMIT, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { MarginModeEnum, SortTypeEnum, SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import reorderArray from 'utils/helpers/reorderArray'
import { getPairFromSymbol, pageToOffset } from 'utils/helpers/transform'

import FilterProtocols from '../FilterProtocols'
import FilterOrderDirectionTag from '../FilterTags/FilterDirectionTag'
import FilterOrderActionTag from '../FilterTags/FilterOrderActionTag'
import FilterOrderRangesTag from '../FilterTags/FilterOrderRangeTag'
import FilterPairTag from '../FilterTags/FilterPairTag'
import SearchTrader from '../SearchTrader'
import { mapOrderData } from '../helpers'
import FilterOrderButton from './FilterOrderButton'
import { ORDER_FILTER_TYPE_MAPPING, orderColumns } from './config'
import { DailyOrdersProvider, useDailyOrdersContext } from './useOrdersProvider'

export default function DailyOrdersPage() {
  return (
    <DailyOrdersProvider>
      <DailyOrdersComponent />
    </DailyOrdersProvider>
  )
}

const defaultSort: { field: keyof OrderData; direction: SortTypeEnum }[] = [
  { field: 'blockTime', direction: SortTypeEnum.DESC },
]

// TODO: Improve performance
function DailyOrdersComponent() {
  const {
    ranges,
    pairs,
    excludedPairs,
    onClearPairs,
    address,
    changeAddress,
    protocols,
    action,
    direction,
    enabledLiveTrade,
    toggleLiveTrade,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
  } = useDailyOrdersContext()
  const { md } = useResponsive()

  // FETCH DATA
  const { isCopyAll, hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const filters = useMemo(() => {
    const result: any[] = []

    if (hasExcludingPairs) {
      result.push({ field: 'pair', nin: excludedPairs.map((v) => getPairFromSymbol(v)) })
    } else if (!isCopyAll) {
      result.push({ field: 'pair', in: pairs.map((v) => getPairFromSymbol(v)) })
    }

    if (direction === DirectionFilterEnum.LONG) {
      result.push({ field: 'isLong', match: true })
    }
    if (direction === DirectionFilterEnum.SHORT) {
      result.push({ field: 'isLong', match: false })
    }
    if (action) {
      result.push(ORDER_FILTER_TYPE_MAPPING[action])
    }
    if (address) {
      result.push({
        field: 'account',
        match: address,
      })
    }
    if (protocols) {
      result.push({
        field: 'protocol',
        in: protocols,
      })
    }
    if (ranges.length) {
      ranges.forEach((values) => result.push(values))
    }
    const _parsedResult = result.map(({ field, ...rest }) => {
      const convertedRest = Object.fromEntries(
        Object.entries(rest)
          .filter(([_, value]) => value !== null && value !== undefined)
          .map(([key, value]) => {
            if (Array.isArray(value) || key === 'exists') {
              return [key, value]
            }
            return [key, String(value)]
          })
      )

      return {
        field,
        ...convertedRest,
      }
    })

    return _parsedResult
  }, [action, address, pairs, protocols, ranges, direction])

  // Table data
  const tableTime = useRef({
    currentTime: dayjs().utc().toISOString(),
    lastTime: dayjs.utc().subtract(1, 'day').toISOString(),
  })
  const queryOpeningVariables = useMemo(() => {
    return {
      index: SEARCH_ORDERS_INDEX,
      body: {
        filter: {
          and: [
            ...filters,
            {
              field: 'blockTime',
              lte: tableTime.current.currentTime,
              gte: tableTime.current.lastTime,
            },
          ],
        },
        sorts: defaultSort,
        paging: { size: currentLimit, from: pageToOffset(currentPage, currentLimit) },
      },
    }
  }, [currentLimit, currentPage, filters])

  const {
    data: ordersTableData,
    loading: isLoadingOrders,
    previousData,
  } = useApolloQuery<{ [SEARCH_ORDERS_FUNCTION_NAME]: ApiListResponse<OrderData> }>(SEARCH_DAILY_ORDERS_QUERY, {
    skip: md && enabledLiveTrade,
    variables: queryOpeningVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })
  const tableData = isLoadingOrders
    ? previousData?.[SEARCH_ORDERS_FUNCTION_NAME]
    : ordersTableData?.[SEARCH_ORDERS_FUNCTION_NAME]

  // live data

  const [currentData, setCurrentData] = useState<OrderData[] | undefined>()
  const [currentDataMeta, setCurrentDataMeta] = useState<ApiMeta | undefined>()

  const checkDataRef = useRef<Record<string, boolean>>({})
  const currentDataRef = useRef<OrderData[]>([])
  const diffDataRef = useRef<{ id: string; isLong: boolean }[]>()
  useEffect(() => {
    if (!currentData) return
    currentDataRef.current = currentData
    checkDataRef.current = currentData?.reduce((result, data) => {
      return { ...result, [data.id]: true }
    }, {})
  }, [currentData])

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const { fetchMore } = useApolloQuery<{ [SEARCH_ORDERS_FUNCTION_NAME]: ApiListResponse<OrderData> } | null>(
    SEARCH_DAILY_ORDERS_QUERY,
    { skip: true }
  )

  const requestTimeRef = useRef({ currentTime: '', lastTime: '' })
  const handleFirstLoad = useCallback(
    (filters: any[]) => {
      setLoading(true)
      const currentTime = dayjs().utc()
      const lastTime = currentTime.subtract(1, 'day')
      requestTimeRef.current.currentTime = currentTime.toISOString()
      requestTimeRef.current.lastTime = lastTime.toISOString()

      fetchMore({
        variables: {
          index: SEARCH_ORDERS_INDEX,
          body: {
            filter: {
              and: [
                ...filters,
                {
                  field: 'blockTime',
                  lte: requestTimeRef.current.currentTime,
                  gte: requestTimeRef.current.lastTime,
                },
              ],
            },
            sorts: defaultSort,
            paging: { size: MAX_PAGE_LIMIT, from: 0 },
            // paging: { size: 100, from: 0 },
          },
        },
      })
        .then(({ data: fetchMoreResult }) => {
          setLoading(false)
          if (!fetchMoreResult) return
          const resData = fetchMoreResult[SEARCH_ORDERS_FUNCTION_NAME]
          setCurrentData(resData.data)
          setCurrentDataMeta(resData.meta)
        })
        .catch((error) => {
          setLoading(false)
          toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
        })
    },
    [fetchMore]
  )

  const handleIntervalFetch = useCallback(
    (filters: any[]) => {
      fetchMore({
        variables: {
          index: SEARCH_ORDERS_INDEX,
          body: {
            sorts: { field: 'blockTime', direction: SortTypeEnum.ASC },
            filter: {
              and: [...filters, { field: 'blockTime', gt: currentDataRef.current[0]?.blockTime }],
            },
            paging: { size: 100, from: 0 },
            // paging: { size: 10, from: 0 },
          },
        },
      })
        .then(({ data: fetchMoreResult }) => {
          if (!fetchMoreResult) return
          const resData = fetchMoreResult[SEARCH_ORDERS_FUNCTION_NAME]
          const fetchedOrderData = resData.data.filter((d) => !checkDataRef.current[d.id]).reverse()
          const newOrderData: OrderData[] = [...fetchedOrderData, ...(currentDataRef.current ?? [])]
          if (newOrderData.length > MAX_LIST_DATA_LIMIT) {
            newOrderData.splice(MAX_LIST_DATA_LIMIT)
          }
          diffDataRef.current = fetchedOrderData.map((v) => ({ id: v.id, isLong: v.isLong }))
          setCurrentData(newOrderData)
          setCurrentDataMeta((prev) => {
            const total = (prev?.total ?? 0) + (fetchedOrderData?.length ?? 0)
            return {
              ...prev,
              limit: prev?.limit ?? 0,
              offset: prev?.offset ?? 0,
              totalPages: prev?.totalPages ?? 0,
              total: total >= MAX_LIST_DATA_LIMIT ? MAX_LIST_DATA_LIMIT : total,
            }
          })
        })
        .catch((error) => {
          // toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
        })
    },
    [fetchMore]
  )

  const handleFetchMore = useCallback(
    (filters: any[]) => {
      setFetching(true)
      fetchMore({
        variables: {
          index: SEARCH_ORDERS_INDEX,
          body: {
            sorts: { field: 'blockTime', direction: SortTypeEnum.DESC },
            filter: {
              and: [
                ...filters,
                {
                  field: 'blockTime',
                  lt: currentDataRef.current.at(-1)?.blockTime,
                  gte: requestTimeRef.current.lastTime,
                },
              ],
            },
            paging: { size: MAX_PAGE_LIMIT, from: 0 },
            // paging: { size: 100, from: 0 },
          },
        },
      })
        .then(({ data: fetchMoreResult }) => {
          setFetching(false)
          const resData = fetchMoreResult?.[SEARCH_ORDERS_FUNCTION_NAME]
          const fetchedOrderData = resData?.data.filter((d) => !checkDataRef.current[d.id]) ?? []
          const newOrderData: OrderData[] = [...(currentDataRef.current ?? []), ...fetchedOrderData]
          if (newOrderData.length > MAX_LIST_DATA_LIMIT) {
            newOrderData.splice(MAX_LIST_DATA_LIMIT)
          }
          setCurrentData(newOrderData)
        })
        .catch((error) => {
          setFetching(false)
          toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
        })
    },
    [fetchMore]
  )
  const fetchNextPage = useCallback(() => {
    handleFetchMore(filters)
  }, [filters, handleFetchMore])

  const [disabledIntervalRefetch, setDisabledInterval] = useState(false)
  useEffect(() => {
    if (!enabledLiveTrade || !md) return
    handleFirstLoad(filters)
  }, [filters, enabledLiveTrade, md])

  useEffect(() => {
    if (disabledIntervalRefetch || !enabledLiveTrade || !md) return
    const interval = setInterval(() => handleIntervalFetch(filters), 3_000)
    return () => clearInterval(interval)
  }, [filters, disabledIntervalRefetch, enabledLiveTrade, md])

  const onScrollList = useMemo(() => {
    return debounce(({ scrollOffset }: { scrollOffset: number }) => {
      if (scrollOffset > 200) {
        setDisabledInterval(true)
        return
      }
      setDisabledInterval(false)
    }, 300)
  }, [])

  const styleLongKeys: string[] = []
  const styleShortKeys: string[] = []
  diffDataRef.current?.forEach((v) => {
    if (v.isLong) styleLongKeys.push(`[data-virtual-list-id="${v.id}"]`)
    if (!v.isLong) styleShortKeys.push(`[data-virtual-list-id="${v.id}"]`)
  })
  const styleLongKey = styleLongKeys.join(', ')
  const styleShortKey = styleShortKeys.join(', ')

  const {
    orderFieldsAllowed,
    isEliteUser,
    planToShowOrderDetails,
    isEnableSearchOrderTrader,
    planToSearchOrderTrader,
    liveOrderDelayInSecond,
    planToEnabledLiveOrder,
  } = useLiveTradesPermission()

  const _data = enabledLiveTrade && md ? currentData : tableData?.data
  const data = _data ? _data.map((v) => mapOrderData({ sourceData: v, allowedFields: orderFieldsAllowed })) : undefined
  const dataMeta = enabledLiveTrade && md ? currentDataMeta : tableData?.meta
  const isLoading = loading || isLoadingOrders

  const { isAvailableFeature: isAllowShowPositionDetails } = useCheckFeature({
    requiredPlan: planToShowOrderDetails,
  })
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const handleClickRow = useCallback(
    (data: OrderData) => {
      isAllowShowPositionDetails && setCurrentOrder(data)
    },
    [isAllowShowPositionDetails]
  )
  const handleDismiss = useCallback(() => setCurrentOrder(null), [])

  const _orderColumns = useMemo(() => {
    return reorderArray({ source: orderFieldsAllowed, target: orderColumns, getValue: (v) => v.key }).map((v) => {
      const isAllowed = orderFieldsAllowed == null || !v.key || orderFieldsAllowed.includes(v.key) || isEliteUser
      return {
        ...v,
        sortBy: isAllowed ? v.sortBy : undefined,
        filterComponent: isAllowed ? v.filterComponent : undefined,
        style: { ...v.style, paddingRight: '8px' },
      }
    })
  }, [isEliteUser, orderFieldsAllowed])

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const tableWrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!tableWrapperRef.current || !data?.length || orderFieldsAllowed == null) return
    const rows = tableWrapperRef.current.querySelectorAll(`[data-table-cell-row-index="0"]`)
    let attr = ''
    for (const cell of rows) {
      const _attr = cell.getAttribute('data-table-cell-key')
      if (orderFieldsAllowed != null && !orderFieldsAllowed.includes(_attr as any)) {
        attr = _attr as string
        break
      }
    }
    if (!attr) return
    const headerWrapper = document.querySelector('.row_header_wrapper')
    const headerTopLeftElement = headerWrapper?.querySelector(`[data-table-key="${attr as any}"]`)
    if (headerTopLeftElement) {
      ;(headerTopLeftElement as HTMLDivElement).style.paddingLeft = '8px'
    }
    const listBodyCell = tableWrapperRef.current.querySelectorAll(`[data-table-cell-key="${attr as any}"]`)

    if (!listBodyCell) return
    for (const cell of listBodyCell) {
      ;(cell as HTMLDivElement).style.paddingLeft = '8px'
    }
    const topLeftElement: Element | undefined = listBodyCell[0]

    const handleResize = debounce(() => {
      if (overlayRef.current) {
        const topLeftRect = topLeftElement?.getBoundingClientRect()
        const bodyRect = tableWrapperRef.current?.getBoundingClientRect()
        overlayRef.current.style.left = `${Math.max(topLeftRect?.x ?? 0, bodyRect?.x ?? 0)}px`
        overlayRef.current.style.top = `${bodyRect?.y ?? 0}px`
        overlayRef.current.style.right = `${window.innerWidth - (bodyRect?.x ?? 0) - (bodyRect?.width ?? 0)}px`
        overlayRef.current.style.height = `${bodyRect?.height ?? 0}px`
        if (overlayRef.current.clientWidth > 1) {
          overlayRef.current.style.borderLeft = `1px solid ${themeColors.neutral4}`
        } else {
          overlayRef.current.style.borderLeft = 'none'
        }
        if (overlayRef.current.clientWidth > 200) {
          overlayRef.current.classList.add('active')
        } else {
          overlayRef.current.classList.remove('active')
        }
      }
    }, 300)
    const handleWhell = (e: WheelEvent) => {
      const multiple = 2
      tableWrapperRef.current?.firstElementChild?.scrollBy(
        e.shiftKey
          ? { left: e.deltaY * multiple, top: 0, behavior: 'smooth' }
          : { left: e.deltaX * multiple, top: e.deltaY * multiple, behavior: 'smooth' }
      )
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    overlayRef.current?.addEventListener('wheel', handleWhell)
    return () => {
      window.removeEventListener('resize', handleResize)
      overlayRef.current?.removeEventListener('wheel', handleWhell)
    }
  }, [data, orderFieldsAllowed])

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flexDirection: 'column',
        '.active': {
          '& > *': {
            display: 'block',
          },
        },
      }}
    >
      {md ? (
        <Flex
          sx={{
            height: 48,
            alignItems: 'center',
            gap: 3,
            pl: 3,
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'nowrap', flex: '1 0 0', overflow: 'auto hidden' }}>
            <Type.Caption pr={1} flexShrink={0} color="neutral2">
              FILTER:
            </Type.Caption>
            <FilterPairTag pairs={pairs} excludedPairs={excludedPairs} onClear={onClearPairs} />
            <FilterOrderActionTag />
            <FilterOrderDirectionTag />
            <FilterOrderRangesTag />
          </Flex>
          <Flex sx={{ height: '100%', alignItems: 'center' }}>
            <Box px={3}>
              <ToggleLiveButton
                enabledLiveData={enabledLiveTrade}
                onClick={() => toggleLiveTrade()}
                requiredPlan={!liveOrderDelayInSecond ? undefined : planToEnabledLiveOrder}
                delay={liveOrderDelayInSecond}
              />
            </Box>
            <Box height="100%" sx={{ bg: 'neutral4', flexShrink: 0, width: '1px' }} />
            <SearchTrader
              address={address}
              setAddress={changeAddress}
              requiredPlan={isEnableSearchOrderTrader ? undefined : planToSearchOrderTrader}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40 }}>
          <Flex sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
            <Flex sx={{ alignItems: 'center', py: '2px' }}>
              <SearchTrader
                address={address}
                setAddress={changeAddress}
                requiredPlan={isEnableSearchOrderTrader ? undefined : planToSearchOrderTrader}
              />
            </Flex>
            <Flex sx={{ height: '100%', gap: 3, flexShrink: 0 }}>
              <Flex
                sx={{
                  alignItems: 'center',
                  borderLeft: 'small',
                  borderRight: 'small',
                  borderColor: 'neutral4',
                  px: 2,
                }}
              >
                <FilterOrderButton />
                {/* <SortPositionsDropdown /> */}
              </Flex>
            </Flex>
          </Flex>
          <Box px={2}>
            <FilterProtocols />
          </Box>
        </Flex>
      )}
      <Box
        flex="1 0 0"
        overflow="hidden"
        sx={{
          '.row_wrapper, .row_header_wrapper': { pl: '16px !important' },
          ...(styleLongKeys.length
            ? {
                [styleLongKey]: {
                  background: 'transparent',
                  animationName: 'daily_trades_update_list_long',
                  animationDuration: '2s',
                  animationTimingFunction: 'ease-in-out',
                },
              }
            : {}),
          ...(styleShortKey.length
            ? {
                [styleShortKey]: {
                  background: 'transparent',
                  animationName: 'daily_trades_update_list_short',
                  animationDuration: '2s',
                  animationTimingFunction: 'ease-in-out',
                },
              }
            : {}),
        }}
      >
        {md ? (
          <VirtualList
            scrollWrapperRef={tableWrapperRef}
            key={enabledLiveTrade.toString()}
            handleSelectItem={isAllowShowPositionDetails ? handleClickRow : undefined}
            data={data?.map((v) => ({
              ...v,
              marginMode: PROTOCOLS_CROSS_MARGIN.includes(v.protocol) ? MarginModeEnum.CROSS : MarginModeEnum.ISOLATED, // Todo: need to improve
            }))}
            columns={_orderColumns}
            isLoading={isLoading}
            dataMeta={dataMeta}
            hasNextPage={enabledLiveTrade ? (data?.length ?? 0) < (dataMeta?.total ?? 0) : undefined}
            fetchNextPage={enabledLiveTrade ? fetchNextPage : undefined}
            isLoadingFooter={enabledLiveTrade ? fetching : false}
            onScroll={enabledLiveTrade ? onScrollList : undefined}
            hiddenFooter
            hiddenScrollToTopButton={false}
            scrollWhenDataChange={enabledLiveTrade ? false : true}
            availableColumns={orderFieldsAllowed}
          />
        ) : (
          <DailyOrderListView
            data={data}
            isLoading={isLoading}
            scrollDep={data}
            availableColumns={orderFieldsAllowed}
            onClickItem={isAllowShowPositionDetails ? handleClickRow : undefined}
          />
        )}
      </Box>
      {enabledLiveTrade && md && (
        <Type.Caption
          color="neutral3"
          display="block"
          lineHeight="30px"
          bg="neutral5"
          textAlign="center"
          sx={{ position: 'relative' }}
        >
          <Box as="span" sx={{ position: 'relative' }}>
            {data?.length} / {dataMeta?.total}
            <Box
              as="span"
              sx={{
                visibility: fetching ? 'visible' : 'hidden',
                position: 'absolute',
                top: '50%',
                right: '-24px',
                transform: 'translateY(-50%)',
              }}
            >
              <Loading size={16} />
            </Box>
          </Box>
          {disabledIntervalRefetch && (
            <Type.Caption
              color="neutral3"
              display="block"
              lineHeight="30px"
              bg="neutral5"
              textAlign="center"
              sx={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            >
              Latest data update is paused
            </Type.Caption>
          )}
        </Type.Caption>
      )}
      {(!enabledLiveTrade || !md) && (
        <Flex
          height={40}
          sx={{
            pl: 2,
            alignItems: 'center',
            width: '100%',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            visibility: dataMeta?.total ? 'visible' : 'hidden',
            '& > *': { width: '100%' },
          }}
        >
          <PaginationWithLimit
            currentPage={currentPage}
            currentLimit={currentLimit}
            onPageChange={changeCurrentPage}
            onLimitChange={changeCurrentLimit}
            apiMeta={dataMeta}
          />
        </Flex>
      )}
      {!isEliteUser && !!data?.length && (
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            backdropFilter: 'blur(10px)',
            borderLeftColor: 'neutral4',
            overflow: 'hidden',
          }}
          ref={overlayRef}
        >
          <Box display="none" minWidth={180} sx={{ flexShrink: 0 }}>
            <PlanUpgradePrompt
              requiredPlan={SubscriptionPlanEnum.ELITE}
              title={<Trans>Upgrade to Unlock more Metrics</Trans>}
              description={<Trans>See Unrealised PnL, Traded Tokens and more.</Trans>}
              showTitleIcon
              showLearnMoreButton
              useLockIcon
              learnMoreSection={SubscriptionFeatureEnum.LIVE_TRADES}
            />
          </Box>
        </Flex>
      )}
      <TraderPositionDetailsFromOrderDrawer
        isOpen={!!currentOrder}
        onDismiss={handleDismiss}
        chartProfitId="live-order-page"
        orderId={currentOrder?.id}
        protocol={currentOrder?.protocol}
        account={currentOrder?.account}
        txHash={currentOrder?.txHash}
        logId={currentOrder?.logId}
      />
    </Flex>
  )
}
