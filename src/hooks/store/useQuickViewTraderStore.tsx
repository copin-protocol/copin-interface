import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { EventCategory } from 'utils/tracking/types'

export interface QuickViewTraderState {
  address: string
  protocol: ProtocolEnum
  type?: TimeFrameEnum
  eventCategory?: EventCategory
}

interface QuickViewTraderStore {
  trader: QuickViewTraderState | null
  options:
    | {
        disabledActions?: DisabledActionType[]
        disabledLinkAccount?: boolean
      }
    | undefined
  setTrader: (
    state: QuickViewTraderState | null,
    options?: { disabledActions?: DisabledActionType[]; disabledLinkAccount?: boolean }
  ) => void
  resetTrader: () => void
}

const useQuickViewTraderStore = create<QuickViewTraderStore>()(
  immer((set) => ({
    trader: null,
    options: {},
    setTrader: (trader, options) =>
      set((state) => {
        state.trader = trader
        state.options = options
      }),
    resetTrader: () => set({ trader: null }),
  }))
)

export default useQuickViewTraderStore
