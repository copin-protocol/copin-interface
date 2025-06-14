import { createContext, useCallback, useContext, useMemo } from 'react'

import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { createProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { ProtocolOptionProps } from 'utils/config/protocols'

interface ContextValues {
  selectedProtocols: ProtocolEnum[] | null
  checkIsSelected: (protocol: ProtocolEnum) => boolean
  handleToggle: (protocol: ProtocolEnum) => void
  setProtocols: (protocols: ProtocolEnum[]) => void
  defaultProtocols: ProtocolEnum[]
  defaultProtocolOptions: ProtocolOptionProps[]
  allowList: ProtocolEnum[]
}

export const ProtocolsContext = createContext({} as ContextValues)

export function ProtocolsProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { setSearchParams } = useSearchParams()

  const defaultProtocolOptions = useGetProtocolOptions()
  const defaultProtocols = useMemo(() => defaultProtocolOptions.map((p) => p.id), [defaultProtocolOptions])

  const { allowedCopyTradeProtocols, allowedSelectProtocols, convertProtocolToParams } = useProtocolPermission()

  const { selectedProtocols, checkIsSelected, handleToggle, setProtocols } = createProtocolFilterStore({
    defaultProtocols: allowedSelectProtocols,
    storageKey: 'daily-trade-protocols-filter',
  })()

  const setSelectedProtocols = useCallback(
    (protocols: ProtocolEnum[], isClearAll?: boolean): void => {
      // if (!protocols.length) return

      const resetParams: Record<string, string | null> = {}

      const protocolParams = convertProtocolToParams({ protocols: protocols ?? [] })

      if (!isClearAll) {
        setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocolParams, ...resetParams })
      } else {
        setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: null, ...resetParams })
      }

      setProtocols(protocols)
    },
    [selectedProtocols, convertProtocolToParams]
  )

  const contextValue: ContextValues = useMemo(() => {
    return {
      selectedProtocols,
      checkIsSelected,
      handleToggle,
      setProtocols: setSelectedProtocols,
      defaultProtocols,
      defaultProtocolOptions,
      allowList: allowedCopyTradeProtocols,
    }
  }, [
    allowedCopyTradeProtocols,
    checkIsSelected,
    defaultProtocolOptions,
    defaultProtocols,
    handleToggle,
    selectedProtocols,
    setSelectedProtocols,
  ])

  return <ProtocolsContext.Provider value={contextValue}>{children}</ProtocolsContext.Provider>
}

export const useProtocolsContext = () => {
  const context = useContext(ProtocolsContext)
  if (!Object.keys(context)?.length) throw new Error('useProtocols needed to be used inside ProtocolsContext')
  return context
}
