import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'

export interface QuickViewTraderState {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
}

interface QuickViewTraderStore {
  trader: QuickViewTraderState | null
  setTrader: (state: QuickViewTraderState | null) => void
  resetTrader: () => void
}

const useQuickViewTraderStore = create<QuickViewTraderStore>()(
  immer((set) => ({
    trader: null,
    setTrader: (trader: QuickViewTraderState | null) => set({ trader }),
    resetTrader: () => set({ trader: null }),
  }))
)

export default useQuickViewTraderStore
