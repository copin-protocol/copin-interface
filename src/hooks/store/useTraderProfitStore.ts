import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface TraderProfitStore {
  unrealisedPnl: number
  setUnrealisedPnl: (value: number) => void
}

const useTraderProfitStore = create<TraderProfitStore>()(
  immer((set) => ({
    unrealisedPnl: 0,
    setUnrealisedPnl: (value) =>
      set((state) => {
        state.unrealisedPnl = value
      }),
  }))
)
export default useTraderProfitStore
