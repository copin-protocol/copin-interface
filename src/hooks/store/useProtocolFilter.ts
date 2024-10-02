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

const createProtocolFilterStore = (defaultSelects: ProtocolEnum[] = []) => {
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
        name: 'protocol-filter',
        getStorage: () => localStorage,
      }
    )
  )
}

export const useProtocolFilter = ({ defaultSelects }: { defaultSelects?: ProtocolEnum[] } = {}) => {
  const { setSearchParams } = useSearchParams()
  const changeCurrentPage = (page: number) => setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: page.toString() })

  const { selectedProtocols, setProtocols, urlProtocol, setUrlProtocol } = createProtocolFilterStore(defaultSelects)()

  const checkIsSelected = (protocol: ProtocolEnum): boolean => {
    return selectedProtocols.includes(protocol)
  }

  const setSelectedProtocols = (protocols: ProtocolEnum[], isClearAll?: boolean): void => {
    // if (!protocols.length) return

    if (!compareTwoArrays(protocols, selectedProtocols)) {
      // Reset page to 1 when changing protocols
      changeCurrentPage(INIT_PAGE)
    }

    const protocolParams = convertProtocolToParams(protocols)

    if (!isClearAll) {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocolParams })
    } else {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: null })
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
