import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface DarkModeState {
  userDarkMode: boolean | null
  matchesDarkMode: boolean | null
  setUserDarkMode: (bool: boolean) => void
  setMatchesDarkMode: (bool: boolean) => void
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    immer((set) => ({
      userDarkMode: null,
      matchesDarkMode: null,
      setUserDarkMode: (bool) =>
        set((state) => {
          state.userDarkMode = bool
        }),
      setMatchesDarkMode: (bool) =>
        set((state) => {
          state.userDarkMode = bool
        }),
    })),
    {
      name: 'dark-mode',
      getStorage: () => localStorage,
    }
  )
)

export const useIsDarkMode = () => {
  const { userDarkMode, matchesDarkMode } = useDarkModeStore()
  return (userDarkMode === null ? matchesDarkMode : userDarkMode) as boolean
}
