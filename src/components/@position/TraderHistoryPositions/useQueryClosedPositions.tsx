import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse, ApiMeta } from 'apis/api'
import { getTraderHistoryApi, getTraderTokensStatistic } from 'apis/traderApis'
import { QueryFilter, RangeFilter } from 'apis/types'
import { PositionData } from 'entities/trader'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import usePageChange from 'hooks/helpers/usePageChange'
import { TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT, MAX_PAGE_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ALL_OPTION, ALL_TOKENS_ID, TokenOptionProps } from 'utils/config/trades'
import { getSymbolFromPair, pageToOffset } from 'utils/helpers/transform'

const MAX_FIRST_LOAD_PAGE = 100
const defaultSort: TableSortProps<PositionData> = {
  sortBy: 'closeBlockTime',
  sortType: SortTypeEnum.DESC,
}

export default function useQueryClosedPositions({
  address,
  protocol,
  isExpanded,
}: {
  address: string
  protocol: ProtocolEnum
  isExpanded: boolean
}) {
  const { xl } = useResponsive()
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: URL_PARAM_KEYS.TRADER_HISTORY_PAGE })
  useLayoutEffect(() => {
    if (!currentPage || currentPage < 1) {
      changeCurrentPage(1)
      return
    }
    if (currentPage > MAX_FIRST_LOAD_PAGE) changeCurrentPage(MAX_FIRST_LOAD_PAGE)
  }, [])

  const { data: tokensStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, address],
    () => getTraderTokensStatistic({ protocol, account: address }),
    { enabled: !!address && !!protocol }
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

  const [currentSortPositions, setCurrentSort] = useState<TableSortProps<PositionData> | undefined>(defaultSort)
  const currentSort = xl && isExpanded ? currentSortPositions : defaultSort
  const resetSort = useCallback(() => setCurrentSort(defaultSort), [])
  const changeCurrentSort = useCallback((sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSort(sort)
  }, [])

  const prevFilterKeyRef = useRef(getFilterCheckKey({ address, protocol, currencyOption, currentSort }))
  const currentFilterKey = getFilterCheckKey({ address, protocol, currencyOption, currentSort })
  const forceSetPositions = prevFilterKeyRef.current !== currentFilterKey

  const latestBlockNumber = useRef(0)
  if (forceSetPositions) latestBlockNumber.current = 0
  const rangeFilters: RangeFilter<keyof PositionData>[] = []
  const rangeFiltersReload: RangeFilter<keyof PositionData>[] = []
  const queryFilters: QueryFilter[] = []
  queryFilters.push({ fieldName: 'status', value: PositionStatusEnum.CLOSE })
  if (!!address) {
    queryFilters.push({ fieldName: 'account', value: address })
  }
  if (currencyOption?.id && currencyOption?.id !== ALL_TOKENS_ID) {
    // const indexTokens = getTokenTradeList(protocol)
    //   .filter((e) => e.symbol === currencyOption?.id)
    //   ?.map((e) => e.address)
    // rangeFilters.push({ fieldName: 'indexToken', in: indexTokens })
    queryFilters.push({ fieldName: 'pair', value: `${currencyOption.id}-USDT` })
  }
  if (latestBlockNumber.current) {
    rangeFilters.push({ fieldName: 'closeBlockNumber', lte: latestBlockNumber.current })
    rangeFiltersReload.push({ fieldName: 'closeBlockNumber', gte: latestBlockNumber.current + 1 })
  }
  const limits = useMemo(() => {
    if (!currentPage) return []
    const _currentPage = currentPage > MAX_FIRST_LOAD_PAGE ? MAX_FIRST_LOAD_PAGE : currentPage
    const maxPositionCount = _currentPage * DEFAULT_LIMIT
    const maxLoadTimes = Math.ceil(maxPositionCount / MAX_PAGE_LIMIT)
    const result: number[] = []
    let remainPositionCount = maxPositionCount
    for (let i = 1; i <= maxLoadTimes; i++) {
      if (i === maxLoadTimes) {
        result.push(remainPositionCount)
        continue
      }
      result.push(MAX_PAGE_LIMIT)
      remainPositionCount -= MAX_PAGE_LIMIT
    }
    return result
  }, [currentPage])

  const [initiatedClosedPositions, setInitiated] = useState(false)
  const [closedPositions, setClosedPositions] = useState<ApiListResponse<PositionData>>()
  const [isLoadingClosedPositions, setIsLoadingClosedPositions] = useState(false)

  const [enabledReload, setEnabledReload] = useState(false)
  useEffect(() => {
    if (isExpanded) return
    const timeout = setTimeout(() => setEnabledReload(true), 15_000)
    return () => clearTimeout(timeout)
  }, [isExpanded])
  useQuery(
    [QUERY_KEYS.GET_POSITIONS_HISTORY, address, protocol, 'reload'],
    () => {
      return getTraderHistoryApi({
        limit: DEFAULT_LIMIT,
        offset: 0,
        sort: defaultSort,
        protocol,
        queryFilters,
        rangeFilters: rangeFiltersReload,
      })
    },
    {
      enabled: enabledReload && !isExpanded,
      refetchInterval: isExpanded ? undefined : 15_000,
      retry: 0,
      onSuccess: (data) => {
        if (!enabledReload || isExpanded) return
        setClosedPositions((prev) => {
          const oldData = prev?.data ?? []
          const parsedData: PositionData[] = []
          // remove duplicate
          if (data.data.length) {
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
    ],
    () => {
      setIsLoadingClosedPositions(true)
      if (!initiatedClosedPositions || forceSetPositions) {
        return Promise.all(
          limits.map((limit, index) => {
            return getTraderHistoryApi({
              limit,
              offset: pageToOffset(index + 1, MAX_PAGE_LIMIT),
              sort: currentSort,
              protocol,
              queryFilters,
              rangeFilters,
            })
          })
        )
      } else {
        return getTraderHistoryApi({
          limit: DEFAULT_LIMIT,
          offset: pageToOffset(currentPage, DEFAULT_LIMIT),
          sort: currentSort,
          protocol,
          queryFilters,
          rangeFilters,
        })
      }
    },
    {
      enabled: !!address,
      retry: 0,
      onSettled: () => setIsLoadingClosedPositions(false),
      onError: () => {
        changeCurrentPage(1)
      },
      onSuccess: (data) => {
        setIsLoadingClosedPositions(false)
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
            if (_data.data.length) {
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
  const hasNextClosedPositions =
    closedPositions && closedPositions.meta.limit + closedPositions.meta.offset < closedPositions.meta.total

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
    ]
  )
}

function getFilterCheckKey({
  address,
  protocol,
  currentSort,
  currencyOption,
}: {
  address: string
  protocol: ProtocolEnum
  currentSort: TableSortProps<PositionData> | undefined
  currencyOption: TokenOptionProps
}) {
  return `${address}_${protocol}_${currencyOption.id}_${currentSort?.sortBy}_${currentSort?.sortType}`
}
