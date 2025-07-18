import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface ContextValues {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
}

export const HistoricalOrderContext = createContext({} as ContextValues)

export function HistoricalOrderProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
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

  return <HistoricalOrderContext.Provider value={contextValue}>{children}</HistoricalOrderContext.Provider>
}

export const useHistoricalOrderContext = () => {
  const context = useContext(HistoricalOrderContext)
  if (!Object.keys(context)?.length)
    throw new Error('useHistoricalOrderContext needed to be used inside HistoricalOrderProvider')
  return context
}
