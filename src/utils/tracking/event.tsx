import ReactGA from 'react-ga4'

import { TraderData } from 'entities/trader'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'

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

export const logEventHomeFilter = ({
  filter,
  username,
}: {
  filter: keyof TraderData | TimeFilterByEnum | ProtocolEnum
  username?: string
}) => {
  let action
  switch (filter) {
    case 'pnl':
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_TOP_PNL
      break
    case 'avgRoi':
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_TOP_ROI
      break
    case 'winRate':
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_TOP_WIN_RATE
      break
    case TimeFilterByEnum.S7_DAY:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_D7
      break
    case TimeFilterByEnum.S14_DAY:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_D15
      break
    case TimeFilterByEnum.S30_DAY:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_D30
      break
    case TimeFilterByEnum.S60_DAY:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_D60
      break
    case ProtocolEnum.GMX:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_SOURCE_GMX
      break
    case ProtocolEnum.KWENTA:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_SOURCE_KWENTA
      break
    case ProtocolEnum.POLYNOMIAL:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_SOURCE_POLINOMIAL
      break
    default:
      action = EVENT_ACTIONS[EventCategory.FILTER].HOME_DEFAULT
  }

  logEvent({
    category: EventCategory.FILTER,
    label: getUserForTracking(username),
    action,
  })
}

export const logEventBacktest = ({ event, username }: { event: any; username?: string }) => {
  let action
  switch (event) {
    case EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE
      break
    case EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_REQUEST_SINGLE:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_REQUEST_SINGLE
      break
    case TimeFilterByEnum.S7_DAY:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_BACKTEST_D7
      break
    case TimeFilterByEnum.S14_DAY:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_BACKTEST_D15
      break
    case TimeFilterByEnum.S30_DAY:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_BACKTEST_D30
      break
    case TimeFilterByEnum.S60_DAY:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_BACKTEST_D60
      break
    default:
      action = EVENT_ACTIONS[EventCategory.BACK_TEST].VIEW_RESULT
  }

  logEvent({
    category: EventCategory.BACK_TEST,
    label: getUserForTracking(username),
    action,
  })
}

export const logEventCopyTrade = ({ event, username }: { event: string; username?: string }) => {
  logEvent({
    category: EventCategory.COPY_TRADE,
    label: getUserForTracking(username),
    action: event,
  })
}

export const logEventRoute = ({ event, username }: { event: string; username?: string }) => {
  logEvent({
    category: EventCategory.ROUTES,
    label: getUserForTracking(username),
    action: event,
  })
}
