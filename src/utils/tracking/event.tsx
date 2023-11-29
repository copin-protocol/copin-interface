import ReactGA from 'react-ga4'

import { ProtocolEnum } from 'utils/config/enums'

import { EVENT_ACTIONS, EventCategory, EventGoogleAnalytic } from './types'

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

export const logEventSwitchProtocol = ({ protocol, username }: { protocol: ProtocolEnum; username?: string }) => {
  let action
  switch (protocol) {
    case ProtocolEnum.GMX:
      action = EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_GMX
      break
    case ProtocolEnum.KWENTA:
      action = EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_KWENTA
      break
    case ProtocolEnum.POLYNOMIAL:
      action = EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_POLYNOMIAL
      break
    default:
      action = EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_GMX
  }

  logEvent({
    category: EventCategory.MULTI_CHAIN,
    label: getUserForTracking(username),
    action,
  })
}
