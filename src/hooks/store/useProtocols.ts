import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum } from 'utils/config/enums'

interface ProtocolState {
  protocol: ProtocolEnum
  setProtocol: (data: ProtocolEnum) => void
}

export const useProtocolStore = create<ProtocolState>()(
  persist(
    immer((set) => ({
      protocol: ProtocolEnum.GMX,
      matchesDarkMode: null,
      setProtocol: (data) =>
        set((state) => {
          state.protocol = data
        }),
    })),
    {
      name: 'protocol',
      getStorage: () => localStorage,
    }
  )
)
