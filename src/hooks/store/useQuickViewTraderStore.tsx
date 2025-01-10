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
  setTrader: (state: QuickViewTraderState | null, disabledActions?: DisabledActionType[]) => void
  resetTrader: () => void
  disabledActions: DisabledActionType[] | undefined
}

const useQuickViewTraderStore = create<QuickViewTraderStore>()(
  immer((set) => ({
    trader: null,
    disabledActions: undefined,
    setTrader: (trader, disabledActions) =>
      set((state) => {
        state.trader = trader
        if (!!disabledActions?.length) state.disabledActions = disabledActions
      }),
    resetTrader: () => set({ trader: null }),
  }))
)

export default useQuickViewTraderStore
