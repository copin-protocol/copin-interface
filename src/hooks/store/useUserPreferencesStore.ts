import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { STORAGE_KEYS } from 'utils/config/keys'

interface UserPreferences {
  realisedPnl?: number
  totalPnl?: number
  fee?: number
  pnlWithFeeEnabled: boolean
  setPnlWithFeeEnabled: (show: boolean) => void
}

const useUserPreferencesStore = create<UserPreferences>()(
  persist(
    immer((set) => ({
      pnlWithFeeEnabled: false,
      setPnlWithFeeEnabled: (showRealisedWithFee) =>
        set((state) => {
          state.pnlWithFeeEnabled = showRealisedWithFee
        }),
    })),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      version: 1,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 1) {
          ;(persistedState as UserPreferences).setPnlWithFeeEnabled(false)
          // if the stored value is in version lower, we set state to default
        }
        return persistedState as UserPreferences
      },
    }
  )
)

export default useUserPreferencesStore
