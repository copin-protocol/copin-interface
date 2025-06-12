import { useEffect, useRef } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum, ProtocolSortByEnum } from 'utils/config/enums'

interface ProtocolFilterState {
  selectedProtocols: ProtocolEnum[]
  setSelectedProtocols: (protocols: ProtocolEnum[]) => void
  protocolSortBy: ProtocolSortByEnum | undefined
  setProtocolSortBy: (data: ProtocolSortByEnum | undefined) => void
}

const createSearchProtocolFilterStore = (initialProtocols: ProtocolEnum[] = []) => {
  return create<ProtocolFilterState>()(
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
    }))
  )
}

export const useSearchProtocolFilter = ({ defaultSelects }: { defaultSelects: ProtocolEnum[] }) => {
  const useProtocolFilterStore = useRef(createSearchProtocolFilterStore(defaultSelects))
  const { selectedProtocols, setSelectedProtocols, protocolSortBy, setProtocolSortBy } =
    useProtocolFilterStore.current()

  useEffect(() => {
    setSelectedProtocols(defaultSelects)
  }, [defaultSelects])

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

  return {
    selectedProtocols,
    checkIsSelected,
    handleToggle,
    setSelectedProtocols,
    protocolSortBy,
    setProtocolSortBy,
  }
}
