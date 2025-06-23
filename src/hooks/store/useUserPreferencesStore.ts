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
      getStorage: () => localStorage,
    }
  )
)

export default useUserPreferencesStore
