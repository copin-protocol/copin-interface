import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse, ApiMeta } from 'apis/api'
import { getTraderHistoryApi, getTraderTokensStatistic } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { useFilterAction } from 'components/@widgets/TableFilter/TableRangeFilterIcon'
import { PositionData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import usePageChange from 'hooks/helpers/usePageChange'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ALL_OPTION, ALL_TOKENS_ID } from 'utils/config/trades'
import { getPairFromSymbol, getSymbolFromPair, pageToOffset } from 'utils/helpers/transform'

const MAX_FIRST_LOAD_PAGE = 100
const defaultSort: TableSortProps<PositionData> = {
  sortBy: 'closeBlockTime',
  sortType: SortTypeEnum.DESC,
}

export default function useQueryClosedPositions({
  address,
  protocol,
  isExpanded,
  isCopyAll,
  pairs,
  excludedPairs,
}: {
  address: string
  protocol: ProtocolEnum
  isExpanded: boolean
  isCopyAll?: boolean
  pairs?: string[]
  excludedPairs?: string[]
}) {
  const { xl } = useResponsive()
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })

  const {
    requiredPlanToUnlimitedPosition,
    isEnableTokenStats,
    isEnablePosition,
    isUnlimitedPosition: isUnlimited,
    maxPositionHistory: maxAllowedRecords,
  } = useTraderProfilePermission({ protocol })
  const isAllowedFetch = isEnablePosition && (isUnlimited || (!isUnlimited && maxAllowedRecords !== 0))

  useLayoutEffect(() => {
    if (!currentPage || currentPage < 1) {
      changeCurrentPage(1)
      return
    }
    if (currentPage > MAX_FIRST_LOAD_PAGE) changeCurrentPage(MAX_FIRST_LOAD_PAGE)
  }, [])

  const { data: tokensStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, address, isEnableTokenStats],
    () => getTraderTokensStatistic({ protocol, account: address }),
    { enabled: !!address && !!protocol && isEnableTokenStats }
  )
  const tokenOptions = useMemo(() => {
    if (tokensStatistic?.data?.length) {
      const statisticSymbolOptions = tokensStatistic.data.map((e) => {
        const symbol = getSymbolFromPair(e.pair)
        return {
          id: symbol,
          label: symbol,
          value: symbol,
        }
      })
      return [ALL_OPTION, ...statisticSymbolOptions]
    }
    return [ALL_OPTION]
  }, [tokensStatistic])
  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: URL_PARAM_KEYS.CURRENCY,
    options: tokenOptions,
    callback: () => {
      changeCurrentPage(1)
    },
  })

  const { getFilterRangeValues } = useFilterAction()
  const getRange = (min?: number, max?: number): { min?: number; max?: number } | undefined => {
    const range: { min?: number; max?: number } = {}
    if (min != null) range.min = min
    if (max != null) range.max = max
    return Object.keys(range).length ? range : undefined
  }
  const {
    sizeGte,
    sizeLte,
    leverageGte,
    leverageLte,
    collateralGte,
    collateralLte,
    realisedRoiGte,
    realisedRoiLte,
    feeGte,
    feeLte,
    pnlGte,
    pnlLte,
  } = getFilterRangeValues({ listParamKey: ['size', 'leverage', 'collateral', 'realisedRoi', 'fee', 'pnl'] })

  const sizeRange = getRange(sizeGte, sizeLte)
  const leverageRange = getRange(leverageGte, leverageLte)
  const collateralRange = getRange(collateralGte, collateralLte)
  const realisedRoiRange = getRange(realisedRoiGte, realisedRoiLte)
  const feeRange = getRange(feeGte, feeLte)
  const pnlRange = getRange(pnlGte, pnlLte)
  const [currentSortPositions, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>(defaultSort)
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const currentSort = xl && isExpanded ? currentSortPositions : defaultSort

  const resetSort = useCallback(() => setCurrentSort(defaultSort), [])
  const changeCurrentSort = useCallback((sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }, [])
  const range = (range?: { min?: number; max?: number }) => ({
    min: range?.min,
    max: range?.max,
  })

  const currentFilterKey = getFilterCheckKey({
    address,
    protocol,
    currencyOption,
    currentSort,
    leverageRange: range(leverageRange),
    sizeRange: range(sizeRange),
    pairs,
    excludedPairs,
    collateralRange: range(collateralRange),
    realisedRoiRange: range(realisedRoiRange),
    feeRange: range(feeRange),
    pnlRange: range(pnlRange),
    pnlWithFeeEnabled,
  })
  const prevFilterKeyRef = useRef(currentFilterKey)
  const forceSetPositions = prevFilterKeyRef.current !== currentFilterKey

  const latestBlockNumber = useRef(0)
  if (forceSetPositions) latestBlockNumber.current = 0
  const rangeFilters: RangeFilter<keyof PositionData>[] = []
  const rangeFiltersReload: RangeFilter<keyof PositionData>[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  // if (!!address) {
  //   queryFilters.push({ fieldName: 'account', value: address })
  // }
  if (currencyOption?.id && currencyOption?.id !== ALL_TOKENS_ID) {
    // const indexTokens = getTokenTradeList(protocol)
    //   .filter((e) => e.symbol === currencyOption?.id)
    //   ?.map((e) => e.address)
    // rangeFilters.push({ fieldName: 'indexToken', in: indexTokens })
    queryFilters.push({ fieldName: 'pair', value: getPairFromSymbol(currencyOption.id) })
  }
  if (latestBlockNumber.current) {
    rangeFilters.push({ fieldName: 'closeBlockNumber', lte: latestBlockNumber.current })
    rangeFiltersReload.push({ fieldName: 'closeBlockNumber', gte: latestBlockNumber.current + 1 })
  }

  const rangeConditions = [
    { range: sizeRange, field: 'size' },
    { range: leverageRange, field: 'leverage' },
    { range: collateralRange, field: 'collateral' },
    { range: realisedRoiRange, field: pnlWithFeeEnabled ? 'roi' : 'realisedRoi' },
    { range: feeRange, field: 'fee' },
    { range: pnlRange, field: pnlWithFeeEnabled ? 'pnl' : 'realisedPnl' },
  ]
  rangeConditions.forEach(({ range, field }) => {
    if (range && (range.min !== undefined || range.max !== undefined)) {
      rangeFilters.push({ fieldName: field as keyof PositionData, gte: range.min, lte: range.max })
      rangeFiltersReload.push({ fieldName: field as keyof PositionData, gte: range.min, lte: range.max })
    }
  })

  // Pairs
  const inPairs = pairs?.map((symbol) => `${symbol}-USDT`)
  const notInPairs = excludedPairs?.map((symbol) => `${symbol}-USDT`)

  if (isCopyAll && notInPairs?.length) {
    rangeFilters.push({
      fieldName: 'pair',
      nin: notInPairs,
    })
    rangeFiltersReload.push({
      fieldName: 'pair',
      nin: notInPairs,
    })
  } else if (!isCopyAll && inPairs?.length) {
    rangeFilters.push({
      fieldName: 'pair',
      in: inPairs,
    })
    rangeFilters.push({
      fieldName: 'pair',
      in: inPairs,
    })
  }

  const limits = useMemo(() => {
    if (!currentPage || (!isUnlimited && maxAllowedRecords === 0)) return []

    const _currentPage = currentPage > MAX_FIRST_LOAD_PAGE ? MAX_FIRST_LOAD_PAGE : currentPage
    let maxPositionCount = _currentPage * DEFAULT_LIMIT

    if (!isUnlimited && maxAllowedRecords > 0) {
      maxPositionCount = Math.min(maxPositionCount, maxAllowedRecords)
    }

    const maxLoadTimes = Math.ceil(maxPositionCount / MAX_PAGE_LIMIT)
    const result: number[] = []
    let remainPositionCount = maxPositionCount

    for (let i = 1; i <= maxLoadTimes; i++) {
      if (i === maxLoadTimes) {
        result.push(remainPositionCount)
      } else {
        result.push(MAX_PAGE_LIMIT)
        remainPositionCount -= MAX_PAGE_LIMIT
      }
    }

    return result
  }, [currentPage, isUnlimited, maxAllowedRecords])

  const [initiatedClosedPositions, setInitiated] = useState(false)
  const [closedPositions, setClosedPositions] = useState<ApiListResponse<PositionData>>()
  const [isLoadingClosedPositions, setIsLoadingClosedPositions] = useState(false)
  const [isFetchingClosedPositions, setIsFetchingClosedPositions] = useState(false)
  const defaultLimit = isUnlimited ? DEFAULT_LIMIT : Math.min(maxAllowedRecords, DEFAULT_LIMIT)

  const [enabledReload, setEnabledReload] = useState(false)
  useEffect(() => {
    if (isExpanded) return
    const timeout = setTimeout(() => setEnabledReload(true), 15_000)
    return () => clearTimeout(timeout)
  }, [isExpanded])
  useQuery(
    [QUERY_KEYS.GET_POSITIONS_HISTORY, address, protocol, pairs, 'reload', isAllowedFetch, pnlWithFeeEnabled],
    () => {
      return getTraderHistoryApi({
        limit: defaultLimit,
        offset: 0,
        sort: currentSort,
        account: address,
        protocol,
        queryFilters,
        rangeFilters: rangeFiltersReload,
      })
    },
    {
      enabled: enabledReload && !isExpanded && isAllowedFetch,
      refetchInterval: isExpanded || !isAllowedFetch ? undefined : 5_000,
      retry: 0,
      onSuccess: (data) => {
        if (!enabledReload || isExpanded) return
        setClosedPositions((prev) => {
          const oldData = prev?.data ?? []
          const parsedData: PositionData[] = []
          // remove duplicate
          if (data?.data?.length) {
            const checker = data.data.reduce<Record<string, boolean>>((result, _p) => {
              return { ...result, [_p.id]: true }
            }, {})
            oldData.forEach((_p) => {
              if (checker[_p.id]) delete checker[_p.id]
            })
            data.data.forEach((_p) => {
              if (checker[_p.id]) parsedData.push(_p)
            })
          }
          const newData = [...parsedData, ...(prev?.data ?? [])]
          return { ...(prev ?? {}), meta: prev?.meta ?? ({} as ApiMeta), data: newData }
        })
      },
    }
  )

  useQuery<ApiListResponse<PositionData>[] | ApiListResponse<PositionData>>(
    [
      QUERY_KEYS.GET_POSITIONS_HISTORY,
      address,
      currentPage,
      currencyOption?.id,
      currentSort?.sortBy,
      currentSort?.sortType,
      protocol,
      isAllowedFetch,
      queryFilters,
      rangeFilters,
      pnlWithFeeEnabled,
    ],
    () => {
      if (!initiatedClosedPositions || forceSetPositions) {
        setIsLoadingClosedPositions(true)
        return Promise.all(
          limits.map((limit, index) => {
            return getTraderHistoryApi({
              limit,
              offset: pageToOffset(index + 1, MAX_PAGE_LIMIT),
              sort: currentSort,
              account: address,
              protocol,
              queryFilters,
              rangeFilters,
            })
          })
        )
      } else {
        setIsFetchingClosedPositions(true)
        return getTraderHistoryApi({
          limit: defaultLimit,
          offset: pageToOffset(currentPage, defaultLimit),
          sort: currentSort,
          account: address,
          protocol,
          queryFilters,
          rangeFilters,
        })
      }
    },
    {
      enabled: !!address && isAllowedFetch,
      retry: 0,
      onSettled: () => {
        setIsLoadingClosedPositions(false)
        setIsFetchingClosedPositions(false)
      },
      onError: () => {
        changeCurrentPage(1)
      },
      onSuccess: (data) => {
        if (!initiatedClosedPositions || forceSetPositions) {
          prevFilterKeyRef.current = currentFilterKey
          const _data = data as ApiListResponse<PositionData>[]
          const parsedData = _data.reduce((result, response) => {
            return [...result, ...(response?.data ?? [])]
          }, [] as PositionData[])
          let maxCloseBlockNumber = 0
          const checker: Record<string, boolean> = {}
          const dataResult: PositionData[] = []
          parsedData.forEach((_p) => {
            if (checker[_p.id]) {
              return
            }
            checker[_p.id] = true
            dataResult.push(_p)
            maxCloseBlockNumber = maxCloseBlockNumber > _p.closeBlockNumber ? maxCloseBlockNumber : _p.closeBlockNumber
          })
          latestBlockNumber.current = maxCloseBlockNumber
          setInitiated(true)
          setClosedPositions({
            data: dataResult,
            meta: _data[0]?.meta,
          })
        } else {
          const _data = data as ApiListResponse<PositionData>
          setClosedPositions((prev) => {
            const oldData = prev?.data ?? []
            const parsedData: PositionData[] = []
            // remove duplicate
            if (_data?.data?.length) {
              const checker = _data.data.reduce<Record<string, boolean>>((result, _p) => {
                return { ...result, [_p.id]: true }
              }, {})
              oldData.forEach((_p) => {
                if (checker[_p.id]) delete checker[_p.id]
              })
              _data.data.forEach((_p) => {
                if (checker[_p.id]) parsedData.push(_p)
              })
            }
            const newData = [...(prev?.data ?? []), ...parsedData]
            return { ...(prev ?? {}), meta: { ..._data.meta }, data: newData }
          })
        }
      },
    }
  )

  const handleFetchClosedPositions = useCallback(() => {
    changeCurrentPage(currentPage + 1)
  }, [changeCurrentPage, currentPage])
  const metaLimit = closedPositions?.meta?.limit ?? 0
  const metaOffset = closedPositions?.meta?.offset ?? 0
  const metaTotal = closedPositions?.meta?.total ?? 0
  const hasNextClosedPositions =
    closedPositions && metaLimit + metaOffset < (maxAllowedRecords === 0 ? metaTotal : maxAllowedRecords)

  return useMemo(
    () => ({
      resetSort,
      tokenOptions,
      currencyOption,
      changeCurrency,
      currentSort,
      changeCurrentSort: xl && isExpanded ? changeCurrentSort : undefined,
      closedPositions,
      isLoadingClosed: isLoadingClosedPositions,
      hasNextClosedPositions,
      handleFetchClosedPositions,
      isFetchingClosedPositions,
      maxAllowedRecords,
      isUnlimited,
      requiredPlanToUnlimitedPosition,
      forceSetPositions,
    }),
    [
      resetSort,
      tokenOptions,
      currencyOption,
      changeCurrency,
      currentSort,
      xl,
      isExpanded,
      changeCurrentSort,
      closedPositions,
      isLoadingClosedPositions,
      hasNextClosedPositions,
      handleFetchClosedPositions,
      isFetchingClosedPositions,
      maxAllowedRecords,
      isUnlimited,
      requiredPlanToUnlimitedPosition,
      forceSetPositions,
    ]
  )
}

function getFilterCheckKey(params: Record<string, any>): string {
  return Object.keys(params)
    .sort()
    .map((key) => {
      const value = params[key]

      if (value == null) return ''

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.join(',')
        }
        return getFilterCheckKey(value)
      }

      return String(value)
    })
    .join('|')
}
