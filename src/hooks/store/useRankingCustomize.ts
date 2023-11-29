import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { TraderData } from 'entities/trader'
import { STORAGE_KEYS } from 'utils/config/keys'

interface StatsCustomizeState {
  customizedRanking: (keyof TraderData)[]
  setVisibleRanking: (keys: (keyof TraderData)[]) => void
}
export const RANKING_FIELD_NAMES: (keyof TraderData)[] = [
  'avgVolume',
  'avgRoi',
  'maxDrawdown',
  'totalTrade',
  'winRate',
  'avgDuration',
  'pnl',
  'maxRoi',
  'profitRate',
  'winLoseRatio',
  'orderPositionRatio',
  'profitLossRatio',
]
const DEFAULT_LIST = RANKING_FIELD_NAMES.slice(0, 6)
export const RANKING_FIELDS_COUNT = 6
export const useRankingCustomizeStore = create<StatsCustomizeState>()(
  persist(
    immer((set) => ({
      customizedRanking: DEFAULT_LIST,
      setVisibleRanking: (keys) =>
        set((state) => {
          state.customizedRanking = keys
        }),
    })),
    {
      name: STORAGE_KEYS.TRADER_RANKING_FIELDS,
      version: 2,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 2) {
          ;(persistedState as StatsCustomizeState).customizedRanking = DEFAULT_LIST
          // if the stored value is in version lower, we set state to default
        }
        return persistedState as StatsCustomizeState
      },
    }
  )
)
