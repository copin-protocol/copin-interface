import { useMemo } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_LOCALE } from 'utils/config/constants'
import { parseLocale } from 'utils/helpers/transform'

// import { parsedQueryString } from "./useParsedQueryString";

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale() {
  if (!navigator.language) return undefined

  const [language, region] = navigator.language.split('-')

  if (region) {
    return parseLocale(`${language}-${region.toUpperCase()}`) ?? parseLocale(language)
  }

  return parseLocale(language)
}
// parseLocale(parsedQueryString().lang) ?? navigatorLocale() ?? DEFAULT_LOCALE;

interface UserLocaleState {
  userLocale: string | null
  setUserLocale: (locale: string) => void
}

export const useUserLocaleStore = create<UserLocaleState>()(
  persist(
    immer((set) => ({
      userLocale: null,

      setUserLocale: (locale) =>
        set((state) => {
          state.userLocale = locale
        }),
    })),
    {
      name: 'locale',
      getStorage: () => localStorage,
    }
  )
)

export function useUserLocale(): string {
  const { userLocale } = useUserLocaleStore()
  return userLocale as string
}

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): string {
  const userLocale = useUserLocale()
  return useMemo(() => userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE, [userLocale])
}
