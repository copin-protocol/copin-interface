import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { tableSettings } from 'components/Tables/TraderListTable/dataConfig'

interface HomeCustomizeState {
  userTraderList: string[]
  setUserTraderList: (data: string[]) => void
}

const DEFAULT_LIST = tableSettings.filter((e) => e.visible).map((e) => e.id)

export const useHomeCustomizeStore = create<HomeCustomizeState>()(
  persist(
    immer((set) => ({
      userTraderList: DEFAULT_LIST,
      setUserTraderList: (data: string[]) =>
        set((state) => {
          state.userTraderList = data
        }),
    })),
    {
      name: 'home-customize',
      version: 8,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 8) {
          ;(persistedState as HomeCustomizeState).userTraderList = DEFAULT_LIST
          // if the stored value is in version lower, we set state to default
        }

        return persistedState as HomeCustomizeState
      },
    }
  )
)
