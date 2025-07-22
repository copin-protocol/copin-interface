import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TimeFilterByEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'

interface HyperliquidMode {
  apiMode: boolean
  isCombined: boolean
  isAccountValue: boolean
  timeframe: TimeFilterByEnum
  setTimeframe: (timeframe: TimeFilterByEnum) => void
  setApiMode: (mode: boolean) => void
  toggleApiMode: () => void
  setIsCombined: (value: boolean) => void
  toggleCombined: () => void
  setIsAccountValue: (value: boolean) => void
  toggleAccountValue: () => void
}

const useHyperliquidModeStore = create<HyperliquidMode>()(
  persist(
    immer((set) => ({
      apiMode: false,
      isCombined: false,
      isAccountValue: false,
      timeframe: TimeFilterByEnum.LAST_24H,
      setTimeframe: (timeframe: TimeFilterByEnum) =>
        set((state) => {
          state.timeframe = timeframe
        }),
      setApiMode: (mode: boolean) =>
        set((state) => {
          state.apiMode = mode
        }),
      toggleApiMode: () =>
        set((state) => {
          state.apiMode = !state.apiMode
        }),
      setIsCombined: (value: boolean) =>
        set((state) => {
          state.isCombined = value
        }),
      toggleCombined: () =>
        set((state) => {
          state.isCombined = !state.isCombined
        }),
      setIsAccountValue: (value: boolean) =>
        set((state) => {
          state.isAccountValue = value
        }),
      toggleAccountValue: () =>
        set((state) => {
          state.isAccountValue = !state.isAccountValue
        }),
    })),
    {
      name: STORAGE_KEYS.HYPERLIQUID_MODE,
      version: 3,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 3) {
          ;(persistedState as HyperliquidMode).setApiMode(false)
          ;(persistedState as HyperliquidMode).setIsCombined(false)
          ;(persistedState as HyperliquidMode).setIsAccountValue(false)
          ;(persistedState as HyperliquidMode).setTimeframe(TimeFilterByEnum.LAST_24H)
          // if the stored value is in version lower, we set state to default
        }
        return persistedState as HyperliquidMode
      },
    }
  )
)

export default useHyperliquidModeStore
