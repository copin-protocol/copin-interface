import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import useSearchParams from 'hooks/router/useSearchParams'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { compareTwoArrays } from 'utils/helpers/common'
import { convertProtocolToParams } from 'utils/helpers/graphql'

interface ProtocolFilterState {
  selectedProtocols: ProtocolEnum[]
  setProtocols: (protocols: ProtocolEnum[]) => void
  urlProtocol: ProtocolEnum | undefined
  setUrlProtocol: (protocol: ProtocolEnum | undefined) => void
}

const INIT_PAGE = 1

const createProtocolFilterStore = (defaultSelects: ProtocolEnum[] = [], storageKey = 'protocol-filter') => {
  return create<ProtocolFilterState>()(
    persist(
      immer((set) => ({
        selectedProtocols: defaultSelects,
        urlProtocol: undefined,
        setProtocols: (protocols) =>
          set((state) => {
            state.selectedProtocols = protocols
          }),
        setUrlProtocol: (protocol) =>
          set((state) => {
            state.urlProtocol = protocol
          }),
      })),
      {
        name: storageKey,
        getStorage: () => localStorage,
      }
    )
  )
}

export const useProtocolFilter = ({
  defaultSelects,
  storageKey,
}: { defaultSelects?: ProtocolEnum[]; storageKey?: string } = {}) => {
  const { setSearchParams } = useSearchParams()

  const { selectedProtocols, setProtocols, urlProtocol, setUrlProtocol } = createProtocolFilterStore(
    defaultSelects,
    storageKey
  )()

  const checkIsSelected = (protocol: ProtocolEnum): boolean => {
    return selectedProtocols.includes(protocol)
  }

  const setSelectedProtocols = (protocols: ProtocolEnum[], isClearAll?: boolean): void => {
    // if (!protocols.length) return

    const resetParams: Record<string, string | null> = {}
    if (!compareTwoArrays(protocols, selectedProtocols)) {
      // Reset page to 1 when changing protocols
      resetParams[URL_PARAM_KEYS.HOME_PAGE] = null
    }

    const protocolParams = convertProtocolToParams(protocols)

    if (!isClearAll) {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocolParams, ...resetParams })
    } else {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: null, ...resetParams })
    }

    setProtocols(protocols)
  }

  const handleToggle = (protocol: ProtocolEnum): void => {
    if (selectedProtocols.includes(protocol)) {
      const filtered = selectedProtocols.filter((selected) => selected !== protocol)
      setSelectedProtocols(filtered)
      return
    }

    setSelectedProtocols([...selectedProtocols, protocol])
  }

  return {
    selectedProtocols,
    checkIsSelected,
    handleToggle,
    setSelectedProtocols,
    urlProtocol,
    setUrlProtocol,
  }
}
