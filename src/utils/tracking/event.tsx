import ReactGA from 'react-ga4'

import { EventGoogleAnalytic } from './types'

export function logEvent(options: EventGoogleAnalytic, params?: any) {
  if (import.meta.env.VITE_NETWORK_ENV === 'mainnet') {
    ReactGA.event(
      {
        category: options.category,
        action: options.action,
        label: options.label,
      },
      {
        ...params,
      }
    )
  }
}

export const getUserForTracking = (username?: string) => {
  if (!username) return 'guest'
  if (username.includes('@')) return username.split('@')[0]
  return username
}
