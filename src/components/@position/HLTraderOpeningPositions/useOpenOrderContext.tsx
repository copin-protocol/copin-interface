import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface ContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
}

export const OrderContext = createContext({} as ContextValues)

export function OpenOrderProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
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

  return <OrderContext.Provider value={contextValue}>{children}</OrderContext.Provider>
}

export const useOpenOrderContext = () => {
  const context = useContext(OrderContext)
  if (!Object.keys(context)?.length) throw new Error('useOrderContext needed to be used inside OrderProvider')
  return context
}
