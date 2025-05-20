import { Draft } from 'immer'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { TraderData } from 'entities/trader'
import { useAuthContext } from 'hooks/web3/useAuth'
import { STORAGE_KEYS } from 'utils/config/keys'

export const RANKING_FIELD_NAMES = [
  'avgRoi',
  'avgVolume',
  'winRate',
  'maxDrawdown',
  'totalTrade',
  'avgDuration',
  'pnl',
  'maxRoi',
  'profitRate',
  'avgLeverage',
  'orderPositionRatio',
  'profitLossRatio',
]
export const RANKING_FIELDS_COUNT = 6
export const DEFAULT_RANKING_LIST = RANKING_FIELD_NAMES.slice(0, 6)

// Default stats fields values from useStatsCustomizeStore
export const IGNORE_FIELDS = ['account', 'runTimeDays', 'lastTradeAtTs']
export const DEFAULT_STATS_LIST = tableSettings
  .filter((settings) => !IGNORE_FIELDS.includes(settings.id))
  .map((e) => e.id)

// Default values for a new user profile
const getDefaultUserProfile = () => ({
  traderStats: {
    customizeView: 'LIST' as const,
    currentStatOnly: true,
    customizeStats: DEFAULT_STATS_LIST,
  },
  traderRanking: {
    customizedRanking: DEFAULT_RANKING_LIST,
  },
})

// Store interface
interface UserCustomizeState {
  profiles: {
    [username: string]: {
      traderStats: {
        customizeView: 'LIST' | 'GRID'
        currentStatOnly: boolean
        customizeStats: string[]
      }
      traderRanking: {
        customizedRanking: string[]
      }
    }
  }
  // Actions
  setUserRankingFields: (userId: string, fields: string[]) => void
  resetUserRankingFields: (userId: string) => void
  setUserStatsView: (userId: string, view: 'LIST' | 'GRID') => void
  setUserCurrentStatOnly: (userId: string, value: boolean) => void
  toggleUserStatField: (userId: string, key: string) => void
  moveUserStatToTop: (userId: string, key: string) => void
  resetUserStats: (userId: string) => void
}

// Create the store
export const useUserCustomizeStore = create<UserCustomizeState>()(
  persist(
    immer((set) => ({
      profiles: {
        anonymous: getDefaultUserProfile(),
      },

      // Ranking-related actions
      setUserRankingFields: (userId, fields) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          state.profiles[userId].traderRanking.customizedRanking = fields as Draft<(keyof TraderData)[]>
        }),

      resetUserRankingFields: (userId) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          state.profiles[userId].traderRanking.customizedRanking = DEFAULT_RANKING_LIST as Draft<(keyof TraderData)[]>
        }),

      // Stats-related actions
      setUserStatsView: (userId, view) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          state.profiles[userId].traderStats.customizeView = view
        }),

      setUserCurrentStatOnly: (userId, value) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          state.profiles[userId].traderStats.currentStatOnly = value
        }),

      toggleUserStatField: (userId, key) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          const stats = state.profiles[userId].traderStats.customizeStats
          if (stats.includes(key as Draft<string>)) {
            state.profiles[userId].traderStats.customizeStats = stats.filter((item) => item !== key)
          } else {
            state.profiles[userId].traderStats.customizeStats.push(key as Draft<string>)
          }
        }),

      moveUserStatToTop: (userId, key) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          const stats = state.profiles[userId].traderStats.customizeStats
          state.profiles[userId].traderStats.customizeStats = stats.filter((item) => item !== key)
          state.profiles[userId].traderStats.customizeStats.unshift(key as Draft<string>)
        }),

      resetUserStats: (userId) =>
        set((state) => {
          if (!state.profiles[userId]) {
            state.profiles[userId] = getDefaultUserProfile()
          }
          state.profiles[userId].traderStats.customizeStats = DEFAULT_STATS_LIST as Draft<string[]>
        }),
    })),
    {
      name: STORAGE_KEYS.USER_CUSTOMIZE_STORE,
      version: 1,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version < 1) {
          ;(persistedState as UserCustomizeState).resetUserStats('anonymous')
          ;(persistedState as UserCustomizeState).resetUserRankingFields('anonymous')
          // if the stored value is in version lower, we set state to default
        }
        return persistedState as UserCustomizeState
      },
    }
  )
)

// Hook to get current user's ranking configuration
export const useUserRankingConfig = () => {
  const { profiles, setUserRankingFields, resetUserRankingFields } = useUserCustomizeStore()
  const { profile } = useAuthContext()
  const userId = !!profile?.username ? `${profile?.username}-${profile?.subscription?.plan}` : 'anonymous'
  const userProfile = profiles[userId] || getDefaultUserProfile()
  return {
    customizedRanking: userProfile.traderRanking.customizedRanking,
    setVisibleRanking: (fields: string[]) => setUserRankingFields(userId, fields),
    reset: () => resetUserRankingFields(userId),
  }
}

// Hook to get current user's stats configuration
export const useUserStatsConfig = () => {
  const { profiles, setUserStatsView, setUserCurrentStatOnly, toggleUserStatField, moveUserStatToTop, resetUserStats } =
    useUserCustomizeStore()
  const { profile } = useAuthContext()
  const userId = !!profile?.username ? `${profile?.username}-${profile?.subscription?.plan}` : 'anonymous'
  const userProfile = profiles[userId] || getDefaultUserProfile()
  return {
    customizeView: userProfile.traderStats.customizeView,
    currentStatOnly: userProfile.traderStats.currentStatOnly,
    customizeStats: userProfile.traderStats.customizeStats,
    toogleCurrentStatOnly: (value: boolean) => setUserCurrentStatOnly(userId, value),
    changeView: (view: 'LIST' | 'GRID') => setUserStatsView(userId, view),
    toggleVisibleStat: (key: string) => toggleUserStatField(userId, key),
    moveStatToTop: (key: string) => moveUserStatToTop(userId, key),
    reset: () => resetUserStats(userId),
  }
}
