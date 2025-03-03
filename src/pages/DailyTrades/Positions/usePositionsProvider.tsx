import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { POSITION_RANGE_KEYS, PositionRangeFields, RangeValuesType } from 'components/@dailyTrades/configs'
import { PositionData } from 'entities/trader'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { TableProps, TableSortProps } from 'theme/Table/types'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PairFilterEnum, PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { getPairsParam } from '../helpers'
import { useProtocolsContext } from '../useProtocolsProvider'

export type DailyPositionRangeFilter = {
  field: PositionRangeFields
  gte?: number | string
  lte?: number | string
}
type ChangeFilterVariables = {
  ranges?: DailyPositionRangeFilter[]
  pairs?: string[]
  status?: PositionStatusEnum
}
export interface DaliPositionsContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
  onClearPairs: () => void
  protocols: ProtocolEnum[] | undefined | null
  changeProtocols: (protocols: ProtocolEnum[] | undefined) => void
  address: string | undefined
  changeAddress: (address: string) => void
  status: PositionStatusEnum | undefined
  changeStatus: (status: PositionStatusEnum | undefined) => void
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  currentSortBy: keyof PositionData
  currentSortType: SortTypeEnum
  changeCurrentSort: TableProps<PositionData, any>['changeCurrentSort']
  getFilterRangeValues: ({ valueKey }: { valueKey: PositionRangeFields }) => RangeValuesType
  changeFilterRange: ({ filter, valueKey }: { filter: RangeValuesType; valueKey: PositionRangeFields }) => void
  resetFilterRange: ({ valueKey }: { valueKey: PositionRangeFields }) => void
  ranges: DailyPositionRangeFilter[]
  changeFilters: (vars: ChangeFilterVariables) => void
  enabledLiveTrade: boolean
  toggleLiveTrade: (enabled?: boolean) => void
}

export const DailyPositionsContext = createContext({} as DaliPositionsContextValues)

export function DailyPositionsProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const defaultProtocolOptions = useGetProtocolOptions()
  const defaultProtocols = useMemo(() => defaultProtocolOptions.map((p) => p.id), [defaultProtocolOptions])
  const { selectedProtocols, setProtocols } = useProtocolsContext()

  const { getListSymbol } = useMarketsConfig()
  const defaultAllPairs = getListSymbol?.()
  const pairsParam = searchParams['pairs'] as string | undefined

  const pairs = useMemo(() => {
    if (!pairsParam || pairsParam === PairFilterEnum.ALL) {
      if (!defaultAllPairs?.length) return []
      return defaultAllPairs
    }
    return pairsParam.split('-')
  }, [pairsParam, defaultAllPairs])

  const excludedPairsParam = searchParams['excludedPairs'] as string | undefined
  const excludedPairs = useMemo(() => {
    return excludedPairsParam ? excludedPairsParam.split('-') : []
  }, [excludedPairsParam])

  const onChangePairs = useCallback(
    (pairs: string[], excludedPairs: string[]) => {
      const param = getPairsParam({ excludedPairs, pairs, defaultAllPairs })
      setSearchParams(param)
    },
    [defaultAllPairs, setSearchParams]
  )
  const onClearPairs = useCallback(() => setSearchParams({ pairs: null, excludedPairs: null }), [setSearchParams])

  const changeProtocols = useCallback(
    (protocols: ProtocolEnum[] | undefined) => {
      setProtocols(protocols ? protocols : defaultProtocols)
    },
    [defaultProtocols, setProtocols]
  )

  const address = (searchParams['address'] as string) ?? ''
  const changeAddress = useCallback(
    (address: string) => setSearchParams({ ['address']: address, ['page']: undefined }),
    [setSearchParams]
  )

  const status = (searchParams['status'] as string)?.toUpperCase() as PositionStatusEnum
  const changeStatus = useCallback(
    (status: PositionStatusEnum | undefined) =>
      setSearchParams({ ['status']: status?.toLocaleLowerCase(), ['page']: undefined }),
    [setSearchParams]
  )

  const currentPage = Number(searchParams['page'] ?? 1)
  const changeCurrentPage = useCallback(
    (page: number) => setSearchParams({ ['page']: page.toString() }),
    [setSearchParams]
  )

  const currentLimit = Number(searchParams['limit'] ?? DEFAULT_LIMIT)
  const changeCurrentLimit = useCallback(
    (limit: number) => setSearchParams({ ['limit']: limit.toString(), ['page']: '1' }),
    [setSearchParams]
  )

  const currentSortBy = (searchParams['sort_by'] as keyof PositionData) ?? 'openBlockTime'
  const currentSortType = (searchParams['sort_type'] as SortTypeEnum) ?? SortTypeEnum.DESC
  const changeCurrentSort = useCallback(
    (sort: TableSortProps<PositionData> | undefined) => {
      setSearchParams({ ['sort_by']: sort?.sortBy as any, ['sort_type']: sort?.sortType, ['page']: undefined })
    },
    [setSearchParams]
  )
  const ranges = useMemo(() => {
    const result: DaliPositionsContextValues['ranges'] = []
    Object.values(POSITION_RANGE_KEYS).forEach((key) => {
      const gteKey = `${key}g`
      const lteKey = `${key}l`
      const gteValueString = searchParams[gteKey]
      const lteValueString = searchParams[lteKey]
      if (gteValueString == null && lteValueString == null) return
      const values: DaliPositionsContextValues['ranges'][0] = { field: key as unknown as PositionRangeFields }
      if (gteValueString != null) values.gte = Number(gteValueString)
      if (lteValueString != null) values.lte = Number(lteValueString)
      result.push(values)
    })
    return result.filter((v) => Object.keys(v).length > 1)
  }, [searchParams])

  const getFilterRangeValues = useCallback(
    ({ valueKey }: { valueKey: PositionRangeFields }) => {
      const gteString = searchParams[`${valueKey}g`] as string | undefined
      const lteString = searchParams[`${valueKey}l`] as string | undefined
      const values: RangeValuesType = {
        gte: undefined,
        lte: undefined,
      }
      if (gteString != null) {
        values.gte = Number(gteString)
      }
      if (lteString != null) {
        values.lte = Number(lteString)
      }
      return values
    },
    [searchParams]
  )
  const changeFilterRange = useCallback(
    ({ filter, valueKey }: { filter: RangeValuesType; valueKey: PositionRangeFields }) => {
      setSearchParams({
        [`${valueKey}g`]: filter?.gte ? filter.gte.toString() : undefined,
        [`${valueKey}l`]: filter?.lte ? filter.lte.toString() : undefined,
        ['page']: undefined,
      })
    },
    [setSearchParams]
  )
  const resetFilterRange = useCallback(
    ({ valueKey }: { valueKey: PositionRangeFields }) => {
      setSearchParams({
        [`${valueKey}g`]: undefined,
        [`${valueKey}l`]: undefined,
        ['page']: undefined,
      })
    },
    [setSearchParams]
  )
  const changeFilters = useCallback(
    (vars: ChangeFilterVariables) => {
      const params: Record<string, string | undefined> = { ['page']: undefined }
      Object.entries(vars).forEach(([key, values]) => {
        if (key === 'ranges') {
          const _values = values as DailyPositionRangeFilter[]
          _values.forEach((v) => {
            const gte = v?.gte
            const lte = v?.lte
            params[`${v.field}g`] = gte ? gte.toString() : undefined
            params[`${v.field}l`] = lte ? lte.toString() : undefined
          })
        }
        if (key === 'pairs') {
          const _values = values as string[] | undefined
          params['pairs'] = _values?.length
            ? _values
                .map((v) => getSymbolFromPair(v))
                .filter((v) => !!v)
                .join('-')
            : undefined
        }
        if (key === 'excludedPairs') {
          const _values = values as string[] | undefined
          params['excludedPairs'] = _values?.length ? _values.filter((v) => !!v).join('-') : undefined
        }

        if (key === 'status') {
          const _values = values as PositionStatusEnum
          params['status'] = _values
        }
      })
      setSearchParams(params)
    },
    [setSearchParams]
  )

  const [enabledLiveTrade, setEnabledLiveTrade] = useState(() => {
    return localStorage.getItem('live_trade_positions_enabled') === '1' ? true : false
  })
  const toggleLiveTrade = useCallback((enabled?: boolean) => {
    if (enabled == null) {
      setEnabledLiveTrade((prev) => !prev)
      return
    }
    setEnabledLiveTrade(enabled)
  }, [])
  useEffect(() => {
    localStorage.setItem('live_trade_positions_enabled', enabledLiveTrade ? '1' : '0')
  }, [enabledLiveTrade])

  const contextValue: DaliPositionsContextValues = useMemo(() => {
    return {
      ranges,
      pairs,
      excludedPairs,
      changePairs: onChangePairs,
      onClearPairs,
      protocols: selectedProtocols,
      changeProtocols,
      address,
      changeAddress,
      status,
      changeStatus,
      currentPage,
      changeCurrentPage,
      currentLimit,
      changeCurrentLimit,
      currentSortBy,
      currentSortType,
      changeCurrentSort,
      getFilterRangeValues,
      changeFilterRange,
      resetFilterRange,
      changeFilters,
      enabledLiveTrade,
      toggleLiveTrade,
    }
  }, [
    ranges,
    pairs,
    excludedPairs,
    onChangePairs,
    onClearPairs,
    selectedProtocols,
    changeProtocols,
    address,
    changeAddress,
    status,
    changeStatus,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
    currentSortBy,
    currentSortType,
    changeCurrentSort,
    getFilterRangeValues,
    changeFilterRange,
    resetFilterRange,
    changeFilters,
    enabledLiveTrade,
    toggleLiveTrade,
  ])

  return <DailyPositionsContext.Provider value={contextValue}>{children}</DailyPositionsContext.Provider>
}

export const useDailyPositionsContext = () => {
  const context = useContext(DailyPositionsContext)
  if (!Object.keys(context)?.length) throw new Error('useAuthContext need to be used inside DailyPositionsContext')
  return context
}
