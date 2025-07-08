import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { STORAGE_KEYS } from 'utils/config/keys'

interface HyperliquidMode {
  apiMode: boolean
  setApiMode: (mode: boolean) => void
  toggleApiMode: () => void
}

const useHyperliquidModeStore = create<HyperliquidMode>()(
  persist(
    immer((set) => ({
      apiMode: false,
      setApiMode: (mode: boolean) =>
        set((state) => {
          state.apiMode = mode
        }),
      toggleApiMode: () =>
        set((state) => {
          state.apiMode = !state.apiMode
        }),
    })),
    {
      name: STORAGE_KEYS.HYPERLIQUID_MODE,
      version: 1,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 1) {
          ;(persistedState as HyperliquidMode).setApiMode(false)
          // if the stored value is in version lower, we set state to default
        }
        return persistedState as HyperliquidMode
      },
    }
  )
)

export default useHyperliquidModeStore
