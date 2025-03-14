import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum, ProtocolSortByEnum } from 'utils/config/enums'

interface ProtocolFilterState {
  selectedProtocols: ProtocolEnum[]
  setSelectedProtocols: (protocols: ProtocolEnum[]) => void
  protocolSortBy: ProtocolSortByEnum | undefined
  setProtocolSortBy: (data: ProtocolSortByEnum | undefined) => void
}

const createProtocolFilterStore = (initialProtocols: ProtocolEnum[] = []) =>
  create<ProtocolFilterState>()(
    persist(
      immer((set) => ({
        selectedProtocols: initialProtocols,
        setSelectedProtocols: (protocols) =>
          set((state) => {
            state.selectedProtocols = protocols
          }),
        protocolSortBy: ProtocolSortByEnum.ALPHABET,
        setProtocolSortBy: (data) =>
          set((state) => {
            state.protocolSortBy = data
          }),
      })),
      {
        name: 'search-protocol-filter',
        getStorage: () => localStorage,
      }
    )
  )

export const useSearchProtocolFilter = ({ defaultSelects }: { defaultSelects: ProtocolEnum[] }) => {
  const useProtocolFilterStore = createProtocolFilterStore(defaultSelects)
  const { selectedProtocols, setSelectedProtocols, protocolSortBy, setProtocolSortBy } = useProtocolFilterStore()

  // const isToggledAll = selectedProtocols.length === defaultSelects.length

  const checkIsSelected = (protocol: ProtocolEnum): boolean => {
    return selectedProtocols.includes(protocol)
  }

  const handleToggle = (protocol: ProtocolEnum): void => {
    if (selectedProtocols.includes(protocol)) {
      const filtered = selectedProtocols.filter((selected) => selected !== protocol)
      setSelectedProtocols(filtered)
      return
    }

    setSelectedProtocols([...selectedProtocols, protocol])
  }

  // const set = (options: ProtocolEnum[]): void => {
  //   setSelectedProtocols(options)
  // }

  return {
    selectedProtocols,
    checkIsSelected,
    handleToggle,
    setSelectedProtocols,
    protocolSortBy,
    setProtocolSortBy,
  }
}
