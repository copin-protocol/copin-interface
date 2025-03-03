import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface ContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
}

export const OrderFilledContext = createContext({} as ContextValues)

export function OrderFilledProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [pairSelected, setPairSelected] = useState<{ pairs: string[]; excludedPairs: string[] }>({
    pairs: [],
    excludedPairs: [],
  })
  const changePairs = useCallback(
    (pairs: string[], excludedPairs: string[]) => setPairSelected({ pairs, excludedPairs }),
    []
  )
  const contextValue: ContextValues = useMemo(() => {
    return { pairs: pairSelected.pairs, excludedPairs: pairSelected.excludedPairs, changePairs }
  }, [pairSelected])

  return <OrderFilledContext.Provider value={contextValue}>{children}</OrderFilledContext.Provider>
}

export const useOrderFilledContext = () => {
  const context = useContext(OrderFilledContext)
  if (!Object.keys(context)?.length)
    throw new Error('useOrderFilledContext needed to be used inside OrderFilledContext')
  return context
}
