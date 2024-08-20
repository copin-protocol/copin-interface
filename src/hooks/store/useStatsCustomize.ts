import { Draft } from 'immer'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'

interface StatsCustomizeState {
  customizeView: 'LIST' | 'GRID'
  currentStatOnly: boolean
  customizeStats: string[]
  toogleCurrentStatOnly: (bool: boolean) => void
  changeView: (view: 'LIST' | 'GRID') => void
  toggleVisibleStat: (key: string) => void
  moveStatToTop: (key: string) => void
}

export const IGNORE_FIELDS = ['account', 'runTimeDays', 'lastTradeAtTs']

const DEFAULT_LIST = tableSettings.filter((settings) => !IGNORE_FIELDS.includes(settings.id)).map((e) => e.id)

export const useStatsCustomizeStore = create<StatsCustomizeState>()(
  persist(
    immer((set) => ({
      customizeStats: DEFAULT_LIST,
      customizeView: 'LIST',
      currentStatOnly: true,
      toogleCurrentStatOnly: (bool: boolean) =>
        set((state) => {
          state.currentStatOnly = bool
        }),
      changeView: (view: 'LIST' | 'GRID') =>
        set((state) => {
          state.customizeView = view
        }),
      toggleVisibleStat: (key) =>
        set((state) => {
          if (state.customizeStats.includes(key as Draft<string>)) {
            state.customizeStats = state.customizeStats.filter((columnKey) => columnKey !== key)
          } else {
            state.customizeStats.push(key as Draft<string>)
          }
        }),
      moveStatToTop: (key) =>
        set((state) => {
          state.customizeStats = state.customizeStats.filter((columnKey) => columnKey !== key)
          state.customizeStats.unshift(key as Draft<string>)
        }),
    })),
    {
      name: 'stats-customize',
      version: 4,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 4) {
          ;(persistedState as StatsCustomizeState).customizeStats = DEFAULT_LIST
          // if the stored value is in version lower, we set state to default
        }

        return persistedState as StatsCustomizeState
      },
    }
  )
)
