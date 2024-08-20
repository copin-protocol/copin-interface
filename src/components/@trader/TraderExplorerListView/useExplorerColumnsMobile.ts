import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { mobileTableSettings } from 'components/@trader/TraderExplorerTableView/configs'

interface HomeCustomizeState {
  columnKeys: string[]
  setColumnKeys: (data: string[]) => void
}

const DEFAULT_LIST = mobileTableSettings.filter((e) => e.visible).map((e) => e.id)

export const useExplorerColumnsMobile = create<HomeCustomizeState>()(
  persist(
    immer((set) => ({
      columnKeys: DEFAULT_LIST,
      setColumnKeys: (data: string[]) =>
        set((state) => {
          state.columnKeys = data
        }),
    })),
    {
      name: 'explorer-column-keys',
      version: 2,
      getStorage: () => localStorage,
      // migrate: (persistedState, version) => {
      //   if (version < 6) {
      //     ;(persistedState as HomeCustomizeState).columnKeys = DEFAULT_LIST
      //     // if the stored value is in version lower, we set state to default
      //   }
      //   return persistedState as HomeCustomizeState
      // },
    }
  )
)
