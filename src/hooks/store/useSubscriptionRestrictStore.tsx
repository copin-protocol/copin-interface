import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

export enum RestrictState {
  EXCEED_QUOTA = 'EXCEED_QUOTA',
  PREMIUM_FEATURE = 'PREMIUM_FEATURE',
}

interface SubscriptionRestrictStore {
  state: RestrictState | null
  setRestrictState: (state: RestrictState | null) => void
  resetRestrictState: () => void
}

const useSubscriptionRestrictStore = create<SubscriptionRestrictStore>()(
  immer((set) => ({
    state: null,
    setRestrictState: (state: RestrictState | null) => set({ state }),
    resetRestrictState: () => set({ state: null }),
  }))
)

export default useSubscriptionRestrictStore
