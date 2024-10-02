import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ProtocolSortByEnum } from 'utils/config/enums'

interface ProtocolSortByState {
  protocolSortBy: ProtocolSortByEnum | undefined
  setProtocolSortBy: (data: ProtocolSortByEnum | undefined) => void
}

export const useProtocolSortByStore = create<ProtocolSortByState>()(
  persist(
    immer((set) => ({
      protocolSortBy: ProtocolSortByEnum.ALPHABET,
      setProtocolSortBy: (sortBy) =>
        set((state) => {
          state.protocolSortBy = sortBy
        }),
    })),
    {
      name: 'protocol-sort-by',
      getStorage: () => localStorage,
    }
  )
)
