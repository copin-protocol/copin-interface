import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_COLUMN_KEYS_MOBILE } from 'pages/PerpDEXsExplorer/constants/column'

type State = {
  visibleColumns: string[]
  toggleVisibleColumn: (key: string) => void
  setVisibleColumns: (key: string[]) => void
}

export const useCustomizeColumnsMobile = create<State>()(
  persist(
    immer((set) => ({
      visibleColumns: DEFAULT_COLUMN_KEYS_MOBILE,
      toggleVisibleColumn: (key: string) => {
        set((state) => {
          if (state.visibleColumns.includes(key)) {
            state.visibleColumns = state.visibleColumns.filter((v) => v !== key)
          } else {
            state.visibleColumns.push(key)
          }
        })
      },
      setVisibleColumns: (keys) => {
        set((state) => {
          state.visibleColumns = keys
        })
      },
    })),
    {
      name: 'perp-dex-explorer-customize-mobile',
      version: 2,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 2) {
          ;(persistedState as State).visibleColumns = DEFAULT_COLUMN_KEYS_MOBILE
          // if the stored value is in version lower, we set state to default
        }

        return persistedState as State
      },
    }
  )
)
