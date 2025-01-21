import { createContext, useContext, useMemo } from 'react'

import useSelectMultipleFactory from 'hooks/helpers/useSelectMultipleFactory'
import { STORAGE_KEYS } from 'utils/config/keys'

import { useLiteContext } from '../useCopinLiteContext'

interface ContextValues {
  selectedTraders: string[] | null
  isSelectedAllTrader: boolean
  handleToggleTrader: (trader: string) => void
  handleToggleAllTrader: (isSelectedAll: boolean) => void
}

export const Context = createContext({} as ContextValues)

export function LiteActivitiesProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { traderAddresses } = useLiteContext()

  const {
    selectedSelections: selectedTraders,
    isSelectedAllSelection: isSelectedAllTrader,
    handleToggleSelection: handleToggleTrader,
    handleToggleAllSelection: handleToggleAllTrader,
  } = useSelectMultipleFactory({
    storageKey: STORAGE_KEYS.LITE_ACTIVITIES_TRADERS,
    listSelection: traderAddresses,
  })

  const contextValue: ContextValues = useMemo(() => {
    return {
      selectedTraders,
      isSelectedAllTrader,
      handleToggleTrader,
      handleToggleAllTrader,
    }
  }, [handleToggleAllTrader, handleToggleTrader, isSelectedAllTrader, selectedTraders])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export const useLiteActivitiesContext = () => {
  const context = useContext(Context)
  if (!Object.keys(context)?.length)
    throw new Error('useLiteActivitiesContext needed to be used inside LiteActivitiesProvider')
  return context
}
