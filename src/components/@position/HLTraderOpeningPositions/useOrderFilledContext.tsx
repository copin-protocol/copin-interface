import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { getRangeFilterValues } from 'components/@widgets/TableFilter/helpers'
import useSearchParams from 'hooks/router/useSearchParams'
import { HlDirectionEnum } from 'utils/config/enums'

interface ContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
  sizeRange?: { min?: number; max?: number }
  direction?: HlDirectionEnum
  changeDirection: (direction: HlDirectionEnum | undefined) => void
  sizeInToken?: { min?: number; max?: number }
  avgPrice?: { min?: number; max?: number }
  totalPnl?: { min?: number; max?: number }
  totalFee?: { min?: number; max?: number }
}

export const OrderFilledContext = createContext({} as ContextValues)

export function OrderFilledProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { searchParams, setSearchParams } = useSearchParams()

  const [pairSelected, setPairSelected] = useState<{ pairs: string[]; excludedPairs: string[] }>({
    pairs: [],
    excludedPairs: [],
  })
  const changePairs = useCallback(
    (pairs: string[], excludedPairs: string[]) => setPairSelected({ pairs, excludedPairs }),
    []
  )

  const [direction, setDirection] = useState<HlDirectionEnum | undefined>(undefined)
  const changeDirection = useCallback((direction: HlDirectionEnum | undefined) => {
    setDirection(direction)
  }, [])

  const getRange = useCallback(
    (key: string) => {
      const { gte, lte } = getRangeFilterValues({
        searchParams: searchParams as Record<string, string>,
        urlParamKey: key,
      })
      return {
        min: gte,
        max: lte,
      }
    },
    [searchParams]
  )

  const sizeRange = useMemo(() => getRange('totalSize'), [getRange])
  const sizeInToken = useMemo(() => getRange('totalSizeInToken'), [getRange])
  const avgPrice = useMemo(() => getRange('avgPrice'), [getRange])
  const totalPnl = useMemo(() => getRange('totalPnl'), [getRange])
  const totalFee = useMemo(() => getRange('totalFee'), [getRange])

  const contextValue: ContextValues = useMemo(() => {
    return {
      pairs: pairSelected.pairs,
      excludedPairs: pairSelected.excludedPairs,
      changePairs,
      sizeRange,
      direction,
      changeDirection,
      sizeInToken,
      avgPrice,
      totalPnl,
      totalFee,
    }
  }, [pairSelected, changePairs, direction, changeDirection, sizeRange, sizeInToken, avgPrice, totalPnl, totalFee])

  return <OrderFilledContext.Provider value={contextValue}>{children}</OrderFilledContext.Provider>
}

export const useOrderFilledContext = () => {
  const context = useContext(OrderFilledContext)
  if (!Object.keys(context)?.length)
    throw new Error('useOrderFilledContext needed to be used inside OrderFilledContext')
  return context
}
