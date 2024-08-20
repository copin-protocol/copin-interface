import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'

import { CustomizeColumnsState } from './types'

const DEFAULT_LIST = tableSettings.filter((e) => e.visible).map((e) => e.id)

export const useCustomizeColumns = create<CustomizeColumnsState>()(
  persist(
    immer((set) => ({
      visibleColumns: DEFAULT_LIST,
      setVisibleColumns: (data: string[]) =>
        set((state) => {
          state.visibleColumns = data
        }),
    })),
    {
      name: 'home-customize',
      version: 8,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 8) {
          ;(persistedState as CustomizeColumnsState).visibleColumns = DEFAULT_LIST
          // if the stored value is in version lower, we set state to default
        }

        return persistedState as CustomizeColumnsState
      },
    }
  )
)
