import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import dayjs from 'dayjs'
import { en } from 'make-plural/plurals'
import { ReactNode, useEffect } from 'react'

import { useActiveLocale, useUserLocaleStore } from 'hooks/store/useLocale'
import { messages as DEFAULT_MESSAGES } from 'locales/en/messages'
import { DEFAULT_LOCALE } from 'utils/config/constants'

const plurals = {
  en,
}

export async function dynamicActivate(locale: string) {
  // @ts-ignore
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale as 'en'] })
  const { messages } =
    locale === DEFAULT_LOCALE ? { messages: DEFAULT_MESSAGES } : await import(`./locales/${locale}/messages.ts`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}

// dynamicActivate(initialLocale)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale()
  const { userLocale, setUserLocale } = useUserLocaleStore()

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => {
        document.documentElement.setAttribute('lang', locale)
        dayjs.locale(locale)
        if (!userLocale) {
          setUserLocale(locale)
          dayjs.locale(locale)
        }
      })
      .catch(() => {
        // console.error('Failed to activate locale', locale, error)
      })
  }, [locale, setUserLocale, userLocale])

  return (
    <I18nProvider forceRenderOnLocaleChange={false} i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
