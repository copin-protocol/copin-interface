import { createContext, useContext, useMemo } from 'react'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { useProtocolFromUrl } from 'utils/helpers/graphql'

interface ContextValues {
  selectedProtocols: ProtocolEnum[]
  checkIsSelected: (protocol: ProtocolEnum) => boolean
  handleToggle: (protocol: ProtocolEnum) => void
  setProtocols: (protocols: ProtocolEnum[]) => void
  defaultProtocols: ProtocolEnum[]
  defaultProtocolOptions: ProtocolOptionProps[]
  allowList: ProtocolEnum[]
}

export const ProtocolsContext = createContext({} as ContextValues)

export function ProtocolsProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const defaultProtocolOptions = useGetProtocolOptions()
  const defaultProtocols = useMemo(() => defaultProtocolOptions.map((p) => p.id), [defaultProtocolOptions])

  const isInternal = useInternalRole()
  const { searchParams, pathname } = useSearchParams()
  const protocolOptions = useGetProtocolOptions()
  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols } = useProtocolFilter({
    defaultSelects: protocolOptions.map((_p) => _p.id),
    storageKey: 'daily-trade-protocols-filter',
  })

  const contextValue: ContextValues = useMemo(() => {
    return {
      selectedProtocols,
      checkIsSelected,
      handleToggle,
      setProtocols: setSelectedProtocols,
      defaultProtocols,
      defaultProtocolOptions,
      allowList,
    }
  }, [
    allowList,
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
