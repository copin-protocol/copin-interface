import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { DirectionFilterEnum, ORDER_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import { getRangeFilterValues } from 'components/@widgets/TableFilter/helpers'
import { RangeFilterValues } from 'components/@widgets/TableFilter/types'
import useLiveTradesPermission from 'hooks/features/subscription/useLiveTradesPermission'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { OrderTypeEnum, PairFilterEnum, ProtocolEnum } from 'utils/config/enums'

import { getPairsParam } from '../helpers'
import { useProtocolsContext } from '../useProtocolsProvider'

type ChangeFilterVariables = {
  ranges?: RangeFilterValues[]
  pairs?: string[]
  excludedPairs?: string[]
  action?: OrderTypeEnum
  direction?: DirectionFilterEnum
}
export interface DailyOrderContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
  onClearPairs: () => void
  protocols: ProtocolEnum[] | undefined | null
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
  ranges: RangeFilterValues[]
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

  const { getListSymbol } = useMarketsConfig()
  const defaultAllPairs = getListSymbol?.()
  const pairsParam = searchParams['pairs'] as string | undefined

  const pairs = useMemo(() => {
    if (!pairsParam || pairsParam === PairFilterEnum.ALL) {
      if (!defaultAllPairs?.length) return []
      return defaultAllPairs
    }
    return pairsParam.split('_')
  }, [pairsParam, defaultAllPairs])

  const excludedPairsParam = searchParams['excludedPairs'] as string | undefined
  const excludedPairs = useMemo(() => {
    return excludedPairsParam ? excludedPairsParam.split('_') : []
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

  const { orderFieldsAllowed } = useLiveTradesPermission()
  const ranges: RangeFilterValues[] = useMemo(() => {
    const result = Object.entries(ORDER_RANGE_CONFIG_MAPPING).map(([field, values]) => {
      if (orderFieldsAllowed != null && !orderFieldsAllowed.includes(field as any)) return undefined
      return {
        ...getRangeFilterValues({ urlParamKey: values.urlParamKey ?? '', searchParams: searchParams as any }),
        field,
      }
    })
    return result.filter((v) => !!v && (v.gte != null || v.lte != null)) as RangeFilterValues[]
  }, [searchParams, orderFieldsAllowed])

  const changeFilters = useCallback(
    (vars: ChangeFilterVariables) => {
      const params: Record<string, string | undefined> = { ['page']: undefined }
      Object.entries(vars).forEach(([key, values]) => {
        if (key === 'ranges') {
          const _values = values as RangeFilterValues[] | undefined
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
          params['pairs'] = _values?.length ? _values.filter((v) => !!v).join('_') : undefined
        }
        if (key === 'excludedPairs') {
          const _values = values as string[] | undefined
          params['excludedPairs'] = _values?.length ? _values.filter((v) => !!v).join('_') : undefined
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

  const [enabledLiveTrade, setEnabledLiveTrade] = useState(false)
  // const [enabledLiveTrade, setEnabledLiveTrade] = useState(() => {
  //   return localStorage.getItem('live_trade_orders_enabled') === '1' ? true : false
  // })

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
  // useEffect(() => {
  //   localStorage.setItem('live_trade_orders_enabled', enabledLiveTrade ? '1' : '0')
  // }, [enabledLiveTrade])

  const contextValue: DailyOrderContextValues = useMemo(() => {
    return {
      onClearPairs,
      pairs,
      excludedPairs,
      changePairs: onChangePairs,
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
      changeFilters,
      enabledLiveTrade,
      toggleLiveTrade,
    }
  }, [
    onClearPairs,
    pairs,
    excludedPairs,
    onChangePairs,
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
