import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { ApiListResponse, ApiMeta } from 'apis/api'
import DailyOrderListView from 'components/@dailyTrades/OrderListView'
import ToggleLiveButton from 'components/@dailyTrades/ToggleLIveButton'
import { DirectionFilterEnum } from 'components/@dailyTrades/configs'
import { TraderPositionDetailsFromOrderDrawer } from 'components/@position/TraderPositionDetailsDrawer'
import ToastBody from 'components/@ui/ToastBody'
import { OrderData } from 'entities/trader'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, Type } from 'theme/base'
import { MAX_LIST_DATA_LIMIT, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { MarginModeEnum, OrderTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { pageToOffset } from 'utils/helpers/transform'

import FilterProtocols from '../FilterProtocols'
import FilterOrderDirectionTag from '../FilterTags/FilterDirectionTag'
import FilterOrderActionTag from '../FilterTags/FilterOrderActionTag'
import FilterOrderRangesTag from '../FilterTags/FilterOrderRangeTag'
import FilterPairTag from '../FilterTags/FilterPairTag'
import SearchTrader from '../SearchTrader'
import FilterOrderButton from './FilterOrderButton'
import {
  ORDER_FILTER_TYPE_MAPPING,
  SEARCH_DAILY_ORDERS_QUERY,
  SEARCH_FUNCTION_NAME,
  SEARCH_ORDERS_INDEX,
  orderColumns,
} from './config'
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
    changePairs,
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
  const filters = useMemo(() => {
    const result: any[] = []

    if (pairs?.length) {
      result.push({ field: 'pair', in: pairs })
    } else {
      result.push({ field: 'pair', exists: true })
    }
    if (direction === DirectionFilterEnum.LONG) {
      result.push({ field: 'isLong', match: true })
    }
    if (direction === DirectionFilterEnum.SHORT) {
      result.push({ field: 'isLong', match: false })
    }
    if (action) {
      result.push(ORDER_FILTER_TYPE_MAPPING[action])
    } else {
      const _filters: any[] = []
      ;[
        OrderTypeEnum.OPEN,
        OrderTypeEnum.INCREASE,
        OrderTypeEnum.DECREASE,
        OrderTypeEnum.CLOSE,
        OrderTypeEnum.LIQUIDATE,
        // OrderTypeEnum.MARGIN_TRANSFERRED,
      ].forEach((type) => {
        _filters.push(ORDER_FILTER_TYPE_MAPPING[type])
      })
      result.push({
        or: _filters.map(({ field, ...rest }) => {
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
        }),
      })
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
  } = useApolloQuery<{ [SEARCH_FUNCTION_NAME]: ApiListResponse<OrderData> }>(SEARCH_DAILY_ORDERS_QUERY, {
    skip: md && enabledLiveTrade,
    variables: queryOpeningVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })
  const tableData = isLoadingOrders ? previousData?.[SEARCH_FUNCTION_NAME] : ordersTableData?.[SEARCH_FUNCTION_NAME]

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

  const { fetchMore } = useApolloQuery<{ [SEARCH_FUNCTION_NAME]: ApiListResponse<OrderData> } | null>(
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
          const resData = fetchMoreResult[SEARCH_FUNCTION_NAME]
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
          const resData = fetchMoreResult[SEARCH_FUNCTION_NAME]
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
          const resData = fetchMoreResult?.[SEARCH_FUNCTION_NAME]
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

  const data = enabledLiveTrade && md ? currentData : tableData?.data
  const dataMeta = enabledLiveTrade && md ? currentDataMeta : tableData?.meta
  const isLoading = loading || isLoadingOrders

  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const handleClickRow = useCallback((data: OrderData) => {
    setCurrentOrder(data)
  }, [])
  const handleDismiss = useCallback(() => setCurrentOrder(null), [])

  return (
    <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
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
          <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'nowrap', flex: '1 0 0', overflow: 'auto' }}>
            <Type.Caption pr={1} flexShrink={0} color="neutral2">
              FILTER:
            </Type.Caption>
            <FilterPairTag pairs={pairs} onClear={() => changePairs(undefined)} />
            <FilterOrderActionTag />
            <FilterOrderDirectionTag />
            <FilterOrderRangesTag />
          </Flex>
          <Flex sx={{ height: '100%', alignItems: 'center' }}>
            <Box px={3}>
              <ToggleLiveButton enabledLiveData={enabledLiveTrade} onClick={() => toggleLiveTrade()} />
            </Box>
            <Box height="100%" sx={{ bg: 'neutral4', flexShrink: 0, width: '1px' }} />
            <SearchTrader address={address} setAddress={changeAddress} />
          </Flex>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40 }}>
          <Flex sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
            <Flex sx={{ alignItems: 'center', py: '2px' }}>
              <SearchTrader address={address} setAddress={changeAddress} />
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
            key={enabledLiveTrade.toString()}
            handleSelectItem={handleClickRow}
            data={data?.map((v) => ({
              ...v,
              marginMode: PROTOCOLS_CROSS_MARGIN.includes(v.protocol) ? MarginModeEnum.CROSS : MarginModeEnum.ISOLATED, // Todo: need to improve
            }))}
            columns={orderColumns}
            isLoading={isLoading}
            dataMeta={dataMeta}
            hasNextPage={enabledLiveTrade ? (data?.length ?? 0) < (dataMeta?.total ?? 0) : undefined}
            fetchNextPage={enabledLiveTrade ? fetchNextPage : undefined}
            isLoadingFooter={enabledLiveTrade ? fetching : false}
            onScroll={enabledLiveTrade ? onScrollList : undefined}
            hiddenFooter
            hiddenScrollToTopButton={false}
            scrollWhenDataChange={enabledLiveTrade ? false : true}
          />
        ) : (
          <DailyOrderListView data={data} isLoading={isLoading} scrollDep={data} />
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
