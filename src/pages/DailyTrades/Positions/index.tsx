import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { LiveTradePositionsGraphQLResponse } from 'graphql/entities/liveTradePositions'
import { SEARCH_DAILY_POSITIONS_QUERY, SEARCH_POSITIONS_FUNCTION_NAME, SEARCH_POSITIONS_INDEX } from 'graphql/query'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { ApiListResponse, ApiMeta } from 'apis/api'
import { normalizePositionData } from 'apis/normalize'
import DailyPositionListView from 'components/@dailyTrades/PositionListView'
import ToggleLiveButton from 'components/@dailyTrades/ToggleLIveButton'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import { dailyPositionColumns } from 'components/@position/configs/traderPositionRenderProps'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import ToastBody from 'components/@ui/ToastBody'
import { PositionData, ResponsePositionData } from 'entities/trader'
import useCheckFeature from 'hooks/features/subscription/useCheckFeature'
import useLiveTradesPermission from 'hooks/features/subscription/useLiveTradesPermission'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import VirtualList from 'theme/VirtualList'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { MAX_LIST_DATA_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum, SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import reorderArray from 'utils/helpers/reorderArray'
import { getPairFromSymbol, pageToOffset } from 'utils/helpers/transform'

import FilterProtocols from '../FilterProtocols'
import FilterPairTags from '../FilterTags/FilterPairTag'
import FilterPositionRangesTag from '../FilterTags/FilterPositionRangesTag'
import FilterPositionStatusTag from '../FilterTags/FilterPositionStatusTag'
import SearchTrader from '../SearchTrader'
import { mapPositionData } from '../helpers'
import FilterPositionButton from './FilterPositionButton'
import { LiveDataSortSelect } from './LiveDataSortSelect'
import SortPositionsDropdown from './SortPositionDropdown'
import { getTablePositionPermissionStyle } from './helpers'
import { DailyPositionsProvider, useDailyPositionsContext } from './usePositionsProvider'

export default function DailyPositionsPage() {
  return (
    <DailyPositionsProvider>
      <DailyPositionsComponent />
    </DailyPositionsProvider>
  )
}
function DailyPositionsComponent() {
  const {
    status,
    ranges,
    currentSortBy,
    currentSortType,
    pairs,
    excludedPairs,
    onClearPairs,
    address,
    currentPage,
    currentLimit,
    protocols,
    changeAddress,
    changeCurrentSort,
    changeCurrentPage,
    changeCurrentLimit,
    enabledLiveTrade,
    toggleLiveTrade,
  } = useDailyPositionsContext()

  const { md } = useResponsive()

  // Filters
  const { isCopyAll, hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const tableFilters = useMemo(() => {
    const result: any[] = []
    if (hasExcludingPairs) {
      result.push({ field: 'pair', nin: excludedPairs.map((v) => getPairFromSymbol(v)) })
    } else if (!isCopyAll) {
      result.push({ field: 'pair', in: pairs.map((v) => getPairFromSymbol(v)) })
    }

    if (status) {
      result.push({
        field: 'status',
        in: [status],
      })
    }
    if (address) {
      result.push({
        field: 'account',
        match: address,
      })
    }
    if (ranges.length) {
      ranges.forEach((values) => {
        //@ts-ignore
        if (values.field === 'durationInSecond') {
          const newValues = { ...values }
          if (typeof newValues.gte === 'number') {
            newValues.gte = newValues.gte * 60
          }
          if (typeof newValues.lte === 'number') {
            newValues.lte = newValues.lte * 60
          }
          //@ts-ignore
          result.push(newValues)
        } else {
          //@ts-ignore
          result.push(values)
        }
      })
    }

    const _parsedResult = result.map(({ field, ...rest }) => {
      const convertedRest = Object.fromEntries(
        Object.entries(rest)
          .filter(([_, value]) => value !== null && value !== undefined)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
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
  }, [address, pairs, ranges, status])

  // Sorts
  const tableSorts = useMemo(() => {
    return { field: currentSortBy, direction: currentSortType }
  }, [currentSortBy, currentSortType])

  // Paging
  const tablePaging = useMemo(() => {
    return { size: currentLimit, from: pageToOffset(currentPage, currentLimit) }
  }, [currentLimit, currentPage])

  // Default time for table
  const tableTime = useRef({
    currentTime: dayjs().utc().toISOString(),
    lastTime: dayjs.utc().subtract(1, 'day').toISOString(),
  })

  const queryTableDataVariables = useMemo(() => {
    return {
      index: SEARCH_POSITIONS_INDEX,
      body: {
        filter: {
          and: [
            ...tableFilters,
            {
              or: [
                {
                  field: 'openBlockTime',
                  lte: tableTime.current.currentTime,
                  gte: tableTime.current.lastTime,
                },
                {
                  field: 'closeBlockTime',
                  lte: tableTime.current.currentTime,
                  gte: tableTime.current.lastTime,
                },
              ],
            },
          ],
        },
        sorts: tableSorts,
        paging: tablePaging,
      },
      protocols,
    }
  }, [protocols, tableFilters, tablePaging, tableSorts])

  // Fetch table data
  const {
    data: tablePositionsData,
    loading: isLoadingTablePositions,
    previousData: previousTableData,
  } = useApolloQuery<LiveTradePositionsGraphQLResponse<ResponsePositionData>>(SEARCH_DAILY_POSITIONS_QUERY, {
    skip: md && enabledLiveTrade,
    variables: queryTableDataVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const tableData = isLoadingTablePositions
    ? previousTableData?.[SEARCH_POSITIONS_FUNCTION_NAME]
    : tablePositionsData?.[SEARCH_POSITIONS_FUNCTION_NAME]

  // Live data
  const [currentLiveData, setCurrentLiveData] = useState<PositionData[] | undefined>()
  const [currentLiveDataMeta, setCurrentLiveDataMeta] = useState<ApiMeta | undefined>()

  const checkLiveDataRef = useRef<Record<string, boolean>>({})
  const currentLiveDataRef = useRef<PositionData[]>([])
  const diffLiveDataRef = useRef<{ id: string; isLong: boolean }[]>()
  useEffect(() => {
    if (!currentLiveData) return
    currentLiveDataRef.current = currentLiveData
    checkLiveDataRef.current = currentLiveData?.reduce((result, data) => {
      return { ...result, [data.id]: true }
    }, {})
  }, [currentLiveData])

  const [loadingLiveData, setLoadingLiveData] = useState(false)
  const [fetchingLiveData, setFetchingLiveData] = useState(false)

  const { fetchMore } = useApolloQuery<{ [SEARCH_POSITIONS_FUNCTION_NAME]: ApiListResponse<PositionData> } | null>(
    SEARCH_DAILY_POSITIONS_QUERY,
    {
      skip: true,
      onError: (error) => {
        setLoadingLiveData(false)
        setFetchingLiveData(false)
        // toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
      },
    }
  )

  const requestTimeRef = useRef({ currentTime: '', lastTime: '' })
  const [liveDataSortBy, setLiveDataSortBy] =
    useState<keyof Pick<PositionData, 'openBlockTime' | 'closeBlockTime' | 'updatedAt'>>('openBlockTime')

  const handleFirstLoad = useCallback(
    ({
      filters,
      sortBy,
      protocols,
    }: {
      filters: any[]
      sortBy: keyof PositionData
      protocols: ProtocolEnum[] | undefined | null
    }) => {
      setLoadingLiveData(true)
      const currentTime = dayjs().utc()
      const lastTime = currentTime.subtract(1, 'day')
      requestTimeRef.current.currentTime = currentTime.toISOString()
      requestTimeRef.current.lastTime = lastTime.toISOString()

      fetchMore({
        variables: {
          index: SEARCH_POSITIONS_INDEX,
          body: {
            filter: {
              and: [
                ...filters,
                {
                  field: sortBy,
                  lte: requestTimeRef.current.currentTime,
                  gte: requestTimeRef.current.lastTime,
                },
              ],
            },
            sorts: { field: sortBy, direction: SortTypeEnum.DESC },
            // paging: { size: MAX_PAGE_LIMIT, from: 0 },
            paging: { size: 50, from: 0 },
          },
          protocols,
        },
      })
        .then(({ data: fetchMoreResult }) => {
          setLoadingLiveData(false)
          const resData = fetchMoreResult?.[SEARCH_POSITIONS_FUNCTION_NAME]
          setCurrentLiveData(resData?.data)
          setCurrentLiveDataMeta(resData?.meta)
        })
        .catch((error) => {
          setLoadingLiveData(false)
          toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
        })
    },
    [fetchMore]
  )
  const handleIntervalFetch = useCallback(
    ({
      filters,
      sortBy,
      protocols,
    }: {
      filters: any[]
      sortBy: keyof PositionData
      protocols: ProtocolEnum[] | undefined | null
    }) => {
      fetchMore({
        variables: {
          index: SEARCH_POSITIONS_INDEX,
          body: {
            sorts: { field: sortBy, direction: SortTypeEnum.ASC },
            filter: {
              and: [...filters, { field: sortBy, gt: currentLiveDataRef.current[0]?.[sortBy] }],
            },
            // paging: { size: 100, from: 0 },
            paging: { size: 20, from: 0 },
          },
          protocols,
        },
      })
        .then(({ data: fetchMoreResult }) => {
          const resData = fetchMoreResult?.[SEARCH_POSITIONS_FUNCTION_NAME]
          const fetchedPositionData = resData?.data.filter((d) => !checkLiveDataRef.current[d.id]).reverse() ?? []
          const newPositionData: PositionData[] = [...fetchedPositionData, ...(currentLiveDataRef.current ?? [])]
          if (newPositionData.length > MAX_LIST_DATA_LIMIT) {
            newPositionData.splice(MAX_LIST_DATA_LIMIT)
          }
          diffLiveDataRef.current = fetchedPositionData.map((v) => ({ id: v.id, isLong: v.isLong }))
          setCurrentLiveData(newPositionData)
          setCurrentLiveDataMeta((prev) => {
            const total = (prev?.total ?? 0) + (fetchedPositionData?.length ?? 0)
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
    ({
      filters,
      sortBy,
      protocols,
    }: {
      filters: any[]
      sortBy: keyof PositionData
      protocols: ProtocolEnum[] | null | undefined
    }) => {
      setFetchingLiveData(true)
      fetchMore({
        variables: {
          index: SEARCH_POSITIONS_INDEX,
          body: {
            sorts: { field: sortBy, direction: SortTypeEnum.DESC },
            filter: {
              and: [
                ...filters,
                {
                  field: sortBy,
                  lt: currentLiveDataRef.current.at(-1)?.[sortBy],
                  gte: requestTimeRef.current.lastTime,
                },
              ],
            },
            // paging: { size: MAX_PAGE_LIMIT, from: 0 },
            paging: { size: 20, from: 0 },
          },
          protocols,
        },
      })
        .then(({ data: fetchMoreResult }) => {
          setFetchingLiveData(false)
          const resData = fetchMoreResult?.[SEARCH_POSITIONS_FUNCTION_NAME]
          const fetchedPositionData = resData?.data.filter((d) => !checkLiveDataRef.current[d.id]) ?? []
          const newPositionData: PositionData[] = [...(currentLiveDataRef.current ?? []), ...fetchedPositionData]
          if (newPositionData.length > MAX_LIST_DATA_LIMIT) {
            newPositionData.splice(MAX_LIST_DATA_LIMIT)
          }
          setCurrentLiveData(newPositionData)
        })
        .catch((error) => {
          setFetchingLiveData(false)
          toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
        })
    },
    [fetchMore]
  )

  const fetchNextPage = useCallback(() => {
    handleFetchMore({ filters: tableFilters, sortBy: liveDataSortBy, protocols })
  }, [handleFetchMore, liveDataSortBy, tableFilters, protocols])

  const [disabledIntervalRefetch, setDisabledInterval] = useState(false)
  useEffect(() => {
    if (!enabledLiveTrade || !md) return
    handleFirstLoad({ filters: tableFilters, sortBy: liveDataSortBy, protocols })
  }, [enabledLiveTrade, tableFilters, liveDataSortBy, protocols, md])

  useEffect(() => {
    if (disabledIntervalRefetch || !enabledLiveTrade || !md) return
    const interval = setInterval(
      () => handleIntervalFetch({ filters: tableFilters, sortBy: liveDataSortBy, protocols }),
      3_000
    )
    return () => clearInterval(interval)
  }, [disabledIntervalRefetch, enabledLiveTrade, tableFilters, liveDataSortBy, protocols, md])

  const onScrollList = useMemo(() => {
    return debounce(({ scrollOffset }: { scrollOffset: number }) => {
      if (scrollOffset > 200) {
        setDisabledInterval(true)
        return
      }
      setDisabledInterval(false)
    }, 100)
  }, [])

  const styleLongKeys: string[] = []
  const styleShortKeys: string[] = []
  diffLiveDataRef.current?.forEach((v) => {
    if (v.isLong) styleLongKeys.push(`[data-virtual-list-id="${v.id}"]`)
    if (!v.isLong) styleShortKeys.push(`[data-virtual-list-id="${v.id}"]`)
  })
  const styleLongKey = styleLongKeys.join(', ')
  const styleShortKey = styleShortKeys.join(', ')

  // Position details drawer
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const {
    positionFieldsAllowed,
    isEliteUser,
    planToShowPositionDetails,
    isEnableSearchPositionTrader,
    planToSearchPositionTrader,
    livePositionDelayInSecond,
    planToEnabledLivePosition,
  } = useLiveTradesPermission()

  const { isAvailableFeature: isAllowedToShowPositionDetails } = useCheckFeature({
    requiredPlan: planToShowPositionDetails,
  })

  const handleSelectItem = useCallback(
    (data: PositionData) => {
      if (!isAllowedToShowPositionDetails) return
      setCurrentPosition(data)
      setOpenDrawer(true)
    },
    [isAllowedToShowPositionDetails]
  )

  const handleDismiss = () => {
    setOpenDrawer(false)
  }

  // DATA
  // const _data = [1, 2, 3, 5, 6].map(() => ({})) as PositionData[]
  const _data = enabledLiveTrade && md ? currentLiveData : tableData?.data
  const data = _data
    ? _data.map((v) => mapPositionData({ sourceData: v, allowedFields: positionFieldsAllowed }))
    : undefined
  const dataMeta = enabledLiveTrade && md ? currentLiveDataMeta : tableData?.meta
  const isLoading = loadingLiveData || isLoadingTablePositions
  const isFetching = enabledLiveTrade ? fetchingLiveData : false

  const _positionColumns = reorderArray({
    source: positionFieldsAllowed,
    target: dailyPositionColumns,
    getValue: (v) => v.key,
  }).map((v) => {
    const isAllowed = positionFieldsAllowed == null || !v.key || positionFieldsAllowed?.includes(v.key) || isEliteUser
    return {
      ...v,
      sortBy: isAllowed ? v.sortBy : undefined,
      filterComponent: isAllowed ? v.filterComponent : undefined,
      style: { ...v.style, paddingRight: '8px' },
    }
  })

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const tableWrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!tableWrapperRef.current || !data?.length || positionFieldsAllowed == null) return
    const rows = tableWrapperRef.current.querySelectorAll(`[data-table-cell-row-index="0"]`)
    let attr = ''
    for (const cell of rows) {
      const _attr = cell.getAttribute('data-table-cell-key')
      if (!positionFieldsAllowed?.includes(_attr as any)) {
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
  }, [data, positionFieldsAllowed])

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
            px: 3,
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'nowrap', flex: '1 0 0', overflow: 'auto hidden' }}>
            <Type.Caption pr={1} sx={{ flexShrink: 0 }}>
              Filter:
            </Type.Caption>
            <FilterPairTags pairs={pairs} excludedPairs={excludedPairs} onClear={onClearPairs} />
            <FilterPositionStatusTag />
            <FilterPositionRangesTag />
          </Flex>
          <Flex sx={{ height: '100%', alignItems: 'center' }}>
            {enabledLiveTrade && (
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Type.Caption sx={{ flexShrink: 0 }} color="neutral3">
                  Sort By:
                </Type.Caption>
                <LiveDataSortSelect
                  currentSelection={liveDataSortBy}
                  changeSelection={(sort) => setLiveDataSortBy(sort as any)}
                />
              </Flex>
            )}
            <Box px={3}>
              <ToggleLiveButton
                enabledLiveData={enabledLiveTrade}
                onClick={() => toggleLiveTrade()}
                requiredPlan={!livePositionDelayInSecond ? undefined : planToEnabledLivePosition}
                delay={livePositionDelayInSecond}
              />
            </Box>
            <Box height="100%" sx={{ bg: 'neutral4', flexShrink: 0, width: '1px' }} />
            <SearchTrader
              address={address}
              setAddress={changeAddress}
              requiredPlan={isEnableSearchPositionTrader ? undefined : planToSearchPositionTrader}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40 }}>
          <Flex mr={2} sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
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
                }}
              >
                <FilterPositionButton />
                <SortPositionsDropdown />
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
                  animationTimingFunction: 'ease-in-out',
                  animationDuration: '2s',
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
          // ...getTablePositionPermissionStyle({
          //   availableColumns: positionFieldsAllowed ?? [],
          //   keysToCheck: ['isLong', 'averagePrice', 'pair'],
          // }),
        }}
      >
        {md ? (
          <>
            <VirtualList
              scrollWrapperRef={tableWrapperRef}
              columns={_positionColumns}
              data={data?.map((v) => normalizePositionData(v))} // Todo: improve here
              dataMeta={dataMeta}
              hasNextPage={
                enabledLiveTrade ? (currentLiveData?.length ?? 0) < (currentLiveDataMeta?.total ?? 0) : undefined
              }
              fetchNextPage={enabledLiveTrade ? fetchNextPage : undefined}
              isLoading={isLoading}
              handleSelectItem={isAllowedToShowPositionDetails ? handleSelectItem : undefined}
              isLoadingFooter={enabledLiveTrade ? isFetching : false}
              onScroll={enabledLiveTrade ? onScrollList : undefined}
              hiddenFooter
              currentSort={enabledLiveTrade ? undefined : { sortBy: currentSortBy, sortType: currentSortType }}
              changeCurrentSort={enabledLiveTrade ? undefined : changeCurrentSort}
              hiddenScrollToTopButton={false}
              scrollWhenDataChange={enabledLiveTrade ? false : true}
              availableColumns={positionFieldsAllowed}
            />
          </>
        ) : (
          <DailyPositionListView
            data={data}
            isLoading={isLoading}
            scrollDep={data}
            onClickItem={isAllowedToShowPositionDetails ? handleSelectItem : undefined}
            availableColumns={positionFieldsAllowed}
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
                visibility: isFetching ? 'visible' : 'hidden',
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
            justifyContent: 'space-between',
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
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="opening-position-detail"
      />
    </Flex>
  )
}
