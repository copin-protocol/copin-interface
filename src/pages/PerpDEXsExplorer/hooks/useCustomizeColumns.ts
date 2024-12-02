import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_COLUMN_KEYS } from 'pages/PerpDEXsExplorer/constants/column'

type State = {
  visibleColumns: string[]
  toggleVisibleColumn: (key: string) => void
  setVisibleColumns: (key: string[]) => void
  resetDefault: () => void
}

export const useCustomizeColumns = create<State>()(
  persist(
    immer((set) => ({
      visibleColumns: DEFAULT_COLUMN_KEYS,
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
      resetDefault: () => {
        set((state) => {
          state.visibleColumns = DEFAULT_COLUMN_KEYS
        })
      },
    })),
    {
      name: 'perp-dex-explorer-customize',
      version: 2,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 2) {
          ;(persistedState as State).visibleColumns = DEFAULT_COLUMN_KEYS
          // if the stored value is in version lower, we set state to default
        }

        return persistedState as State
      },
    }
  )
)
