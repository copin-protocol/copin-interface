import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { useDarkModeStore } from 'hooks/store/useDarkMode'
import { useUserLocaleStore } from 'hooks/store/useLocale'
import useUserReferralStore from 'hooks/store/useReferral'
import { parseLocale } from 'utils/helpers/transform'

export default function QSReader() {
  const { setUserDarkMode } = useDarkModeStore()
  const { setUserLocale } = useUserLocaleStore()
  const { setUserReferral } = useUserReferralStore()
  const { search } = useLocation()

  const setDarkModeFromQuery = useCallback(
    (theme: any) => {
      if (typeof theme !== 'string') return
      if (theme.toLowerCase() === 'light') {
        setUserDarkMode(false)
      } else if (theme.toLowerCase() === 'dark') {
        setUserDarkMode(true)
      }
    },
    [setUserDarkMode]
  )

  const setLocaleFromQuery = useCallback(
    (locale: any) => {
      if (typeof locale !== 'string') return
      const parsedLocale = parseLocale(locale)
      if (parsedLocale) {
        setUserLocale(parsedLocale)
      }
    },
    [setUserLocale]
  )

  const setReferralFromQuery = useCallback(
    (ref: any) => {
      if (typeof ref !== 'string') return
      if (ref) {
        setUserReferral(ref)
      }
    },
    [setUserReferral]
  )

  useEffect(() => {
    const parsed = parsedQueryString(search)
    setDarkModeFromQuery(parsed.theme)
    setLocaleFromQuery(parsed.lang)
    setReferralFromQuery(((parsed?.ref as string) ?? '').toUpperCase())
  }, [search, setDarkModeFromQuery, setLocaleFromQuery])

  return null
}
