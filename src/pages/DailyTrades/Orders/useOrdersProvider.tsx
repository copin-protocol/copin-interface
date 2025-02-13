import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  DirectionFilterEnum,
  ORDER_RANGE_KEYS,
  OrderRangeFields,
  RangeValuesType,
} from 'components/@dailyTrades/configs'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { getPairFromSymbol, getSymbolFromPair } from 'utils/helpers/transform'

import { useProtocolsContext } from '../useProtocolsProvider'

export type DailyOrderRangeFilter = {
  field: OrderRangeFields
  gte?: number | string
  lte?: number | string
}
type ChangeFilterVariables = {
  ranges?: DailyOrderRangeFilter[]
  pairs?: string[]
  action?: OrderTypeEnum
  direction?: DirectionFilterEnum
}
export interface DailyOrderContextValues {
  pairs: string[] | undefined
  changePairs: (pairs: string[] | undefined) => void
  protocols: ProtocolEnum[] | undefined
  changeProtocols: (protocols: ProtocolEnum[] | undefined) => void
  address: string | undefined
  changeAddress: (address: string) => void
  action: OrderTypeEnum | undefined
  changeAction: (status: OrderTypeEnum | undefined) => void
  direction: DirectionFilterEnum | undefined
  changeDirection: (direction: DirectionFilterEnum | undefined) => void
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentLimit: number
  changeCurrentLimit: (limit: number) => void
  getFilterRangeValues: ({ valueKey }: { valueKey: OrderRangeFields }) => RangeValuesType
  changeFilterRange: ({ filter, valueKey }: { filter: RangeValuesType; valueKey: OrderRangeFields }) => void
  resetFilterRange: ({ valueKey }: { valueKey: OrderRangeFields }) => void
  ranges: DailyOrderRangeFilter[]
  changeFilters: (vars: ChangeFilterVariables) => void
  enabledLiveTrade: boolean
  toggleLiveTrade: (enabled?: boolean) => void
}
export const DailyOrdersContext = createContext({} as DailyOrderContextValues)

export function DailyOrdersProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const defaultProtocolOptions = useGetProtocolOptions()
  const defaultProtocols = useMemo(() => defaultProtocolOptions.map((p) => p.id), [defaultProtocolOptions])
  const { selectedProtocols, setProtocols } = useProtocolsContext()

  const symbols = (searchParams['pairs'] as string)?.split('_')
  const changePairs = useCallback(
    (pairs: string[] | undefined) => {
      setSearchParams({
        ['pairs']: pairs?.length
          ? pairs
              .map((v) => getSymbolFromPair(v))
              .filter((v) => !!v)
              .join('_')
          : undefined,
        ['page']: undefined,
      })
    },
    [setSearchParams]
  )

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

  const action = (searchParams['action'] as string)?.toUpperCase() as OrderTypeEnum
  const changeAction = useCallback(
    (action: OrderTypeEnum | undefined) =>
      setSearchParams({ ['action']: action?.toLocaleLowerCase(), ['page']: undefined }),
    [setSearchParams]
  )

  const direction = searchParams['direction'] as DirectionFilterEnum
  const changeDirection = useCallback(
    (direction: DirectionFilterEnum | undefined) => setSearchParams({ ['direction']: direction, ['page']: undefined }),
    [setSearchParams]
  )

  const currentPage = Number(searchParams['page'] ?? 1)
  const changeCurrentPage = useCallback(
    (page: number) => setSearchParams({ ['page']: page.toString() }),
    [setSearchParams]
  )

  const currentLimit = Number(searchParams['limit'] ?? DEFAULT_LIMIT)
  const changeCurrentLimit = useCallback(
    (limit: number) => setSearchParams({ ['limit']: limit.toString(), ['page']: undefined }),
    [setSearchParams]
  )

  // TODO: need to improve duplicated code
  const ranges = useMemo(() => {
    const result: DailyOrderContextValues['ranges'] = []
    Object.values(ORDER_RANGE_KEYS).forEach((key) => {
      const gteKey = `${key}g`
      const lteKey = `${key}l`
      const gteValueString = searchParams[gteKey]
      const lteValueString = searchParams[lteKey]
      if (gteValueString == null && lteValueString == null) return
      const values: DailyOrderContextValues['ranges'][0] = { field: key as unknown as OrderRangeFields }
      if (gteValueString != null) values.gte = Number(gteValueString)
      if (lteValueString != null) values.lte = Number(lteValueString)
      result.push(values)
    })
    return result.filter((v) => Object.keys(v).length > 1)
  }, [searchParams])

  const getFilterRangeValues = useCallback(
    ({ valueKey }: { valueKey: OrderRangeFields }) => {
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
    ({ filter, valueKey }: { filter: RangeValuesType; valueKey: OrderRangeFields }) => {
      setSearchParams({
        [`${valueKey}g`]: filter?.gte ? filter.gte.toString() : undefined,
        [`${valueKey}l`]: filter?.lte ? filter.lte.toString() : undefined,
        ['page']: undefined,
      })
    },
    [setSearchParams]
  )
  const resetFilterRange = useCallback(
    ({ valueKey }: { valueKey: OrderRangeFields }) => {
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
          const _values = values as DailyOrderRangeFilter[] | undefined
          _values?.length
            ? _values.forEach((v) => {
                const gte = v?.gte
                const lte = v?.lte
                params[`${v.field}g`] = gte ? gte.toString() : undefined
                params[`${v.field}l`] = lte ? lte.toString() : undefined
              })
            : undefined
        }
        if (key === 'pairs') {
          const _values = values as string[] | undefined
          params['pairs'] = _values?.length
            ? _values
                .map((v) => getSymbolFromPair(v))
                .filter((v) => !!v)
                .join('_')
            : undefined
        }
        if (key === 'action') {
          const _values = values as OrderTypeEnum | undefined
          params['action'] = _values
        }
        if (key === 'direction') {
          const _values = values as unknown as DirectionFilterEnum | undefined
          params['direction'] = _values
        }
      })
      setSearchParams(params)
    },
    [setSearchParams]
  )

  const [enabledLiveTrade, setEnabledLiveTrade] = useState(() => {
    return localStorage.getItem('live_trade_orders_enabled') === '1' ? true : false
  })

  const toggleLiveTrade = useCallback(
    (enabled?: boolean) => {
      setSearchParams({ ['page']: null })
      if (enabled == null) {
        setEnabledLiveTrade((prev) => !prev)
        return
      }
      setEnabledLiveTrade(enabled)
    },
    [setSearchParams]
  )
  useEffect(() => {
    localStorage.setItem('live_trade_orders_enabled', enabledLiveTrade ? '1' : '0')
  }, [enabledLiveTrade])

  const contextValue: DailyOrderContextValues = useMemo(() => {
    return {
      pairs: symbols?.map((v) => getPairFromSymbol(v)),
      changePairs,
      protocols: selectedProtocols,
      changeProtocols,
      address,
      changeAddress,
      action,
      changeAction,
      direction,
      changeDirection,
      currentPage,
      changeCurrentPage,
      currentLimit,
      changeCurrentLimit,
      ranges,
      getFilterRangeValues,
      changeFilterRange,
      resetFilterRange,
      changeFilters,
      enabledLiveTrade,
      toggleLiveTrade,
    }
  }, [
    symbols,
    changePairs,
    selectedProtocols,
    changeProtocols,
    address,
    changeAddress,
    action,
    changeAction,
    direction,
    changeDirection,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
    ranges,
    getFilterRangeValues,
    changeFilterRange,
    resetFilterRange,
    changeFilters,
    enabledLiveTrade,
    toggleLiveTrade,
  ])

  return <DailyOrdersContext.Provider value={contextValue}>{children}</DailyOrdersContext.Provider>
}

export const useDailyOrdersContext = () => {
  const context = useContext(DailyOrdersContext)
  if (!Object.keys(context)?.length)
    throw new Error('useDailyPositionsContext need to be used inside DailyOrdersContext')
  return context
}
