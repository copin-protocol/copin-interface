import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { WarningType } from 'components/@backtest/BacktestWarningModal'

interface Store {
  isOpen: boolean
  type: WarningType | null
  confirmFunction: (() => void) | null
  dismissModal: () => void
  openModal: (args: { type: WarningType; confirmFunction: () => void }) => void
}

const useBacktestWarningModal = create<Store>()(
  immer((set) => ({
    isOpen: false,
    type: null,
    confirmFunction: null,
    dismissModal() {
      set((state) => {
        state.isOpen = false
        state.type = null
        state.confirmFunction = null
      })
    },
    openModal({ type, confirmFunction }) {
      set((state) => {
        state.isOpen = true
        state.type = type
        state.confirmFunction = confirmFunction
      })
    },
  }))
)

export default useBacktestWarningModal
