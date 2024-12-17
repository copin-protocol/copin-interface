import { EventDetailsData } from 'entities/event'
import { LINKS, TELEGRAM_BOT_ALERT } from 'utils/config/constants'
import { PositionSideEnum, ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export const generateTraderDetailsRoute = (
  protocol: ProtocolEnum,
  address: string,
  others?: { type?: TimeFrameEnum | TimeFilterByEnum }
) =>
  `/${protocol}${ROUTES.TRADER_DETAILS.path_prefix}/${address}${
    others?.type ? `?${URL_PARAM_KEYS.EXPLORER_TIME_FILTER}=${others.type}` : ''
  }`
export const generateSharedPositionRoute = (data: { protocol: ProtocolEnum; sharedId: string }) => {
  return `/${data.protocol}${ROUTES.SHARED_POSITION_DETAILS.path_prefix}/share/${data.sharedId}`
}

export const generateMyOpeningPositionRoute = (data: {
  protocol: ProtocolEnum
  copyAccount: string
  indexToken: string
  key: string
}) =>
  `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}?account=${data.copyAccount}&indexToken=${data.indexToken}&key=${data.key}`

export const generatePositionDetailsRoute = (
  data: Partial<{
    protocol: ProtocolEnum
    txHash: string
    account: string
    logId: number
    isLong: boolean
    nextHours?: number
    id?: string
  }>,
  others?: {
    highlightTxHash?: string
  }
) =>
  createUrlWithParams({
    url: `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}/${!!data.txHash ? data.txHash : data.id}`,
    params: {
      [URL_PARAM_KEYS.ACCOUNT]: data.account,
      [URL_PARAM_KEYS.LOG_ID]: data.logId,
      [URL_PARAM_KEYS.SIDE]:
        data.isLong != null ? (data.isLong ? PositionSideEnum.LONG : PositionSideEnum.SHORT) : undefined,
      [URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]: data.nextHours,
      [URL_PARAM_KEYS.HIGHLIGHT_TX_HASH]: others?.highlightTxHash,
    },
  })

export const generateParamsUrl = ({
  url,
  key,
  value,
}: {
  url: string
  key: string
  value?: string | undefined | null
}) => {
  if (!value) return url

  return url.indexOf('?') > -1 ? `${url}&${key}=${value}` : `${url}?${key}=${value}`
}

export const generateTelegramBotAlertUrl = (state?: string) => {
  return `${LINKS.baseTelegram}/${TELEGRAM_BOT_ALERT}?${state ? `start=${state}` : ''}`
}

export function createUrlWithParams({ url, params = {} }: { url: string; params?: Record<string, any> }): string {
  let query = ''
  for (const key of Object.keys(params)) {
    if (params[key] !== undefined) {
      query += `&${key}=${encodeURIComponent(params[key])}`
    }
  }
  return url + `${!!query ? `?${query.slice(1)}` : ''}`
}

export function generateOIOverviewRoute(data: { params?: Record<string, any> }) {
  return createUrlWithParams({
    url: ROUTES.OPEN_INTEREST_OVERVIEW.path,
    params: data.params,
  })
}
export function generateOIPositionsRoute(data: { params?: Record<string, any> }) {
  return createUrlWithParams({
    url: ROUTES.OPEN_INTEREST_POSITIONS.path,
    params: data.params,
  })
}

export function generateExplorerRoute(data: { protocols?: string[]; protocol?: string; params?: Record<string, any> }) {
  if (data.protocol) {
    return createUrlWithParams({
      url: `/${data.protocol}${ROUTES.TRADERS_EXPLORER.path_prefix}`,
      params: data.params,
    })
  }

  return createUrlWithParams({
    url: ROUTES.ALL_TRADERS_EXPLORER.path_prefix,
    params: data.params,
  })
}

export function generateFavoriteTradersRoute(data: {
  protocols?: string[]
  protocol?: string
  params?: Record<string, any>
}) {
  return createUrlWithParams({
    url: ROUTES.FAVORITES.path,
    params: data.params,
  })
}

export function generateLeaderboardRoute(data: { protocol: string; params?: Record<string, any> }) {
  return createUrlWithParams({
    url: `/${data.protocol}${ROUTES.LEADERBOARD.path_prefix}`,
    params: data.params,
  })
}

export function generateHomeRoute(data: { params?: Record<string, any> }) {
  if (data.params?.protocol === ProtocolEnum.GMX_V2) return ROUTES.HOME.path
  return createUrlWithParams({
    url: ROUTES.HOME.path,
    params: data.params,
  })
}

export function generateTraderMultiExchangeRoute(data: {
  address: string
  protocol?: ProtocolEnum
  params?: Record<string, any>
}) {
  return createUrlWithParams({
    url: `${ROUTES.TRADER_DETAILS_MULTI_EXCHANGE.path_prefix}/${data.address}/${
      data.protocol?.toLocaleLowerCase?.() || ''
    }`,
    params: data.params,
  })
}

export function generateTraderExchangesStatsRoute(data: {
  address: string
  protocol: ProtocolEnum
  params?: Record<string, any>
}) {
  return createUrlWithParams({
    url: `${ROUTES.TRADER_EXCHANGES_STATS.path_prefix}/${data.address}/${data.protocol}`,
    params: data.params,
  })
}

export function generateEventDetailsRoute(data: EventDetailsData) {
  return createUrlWithParams({ url: `/${ROUTES.EVENT_DETAILS.path_prefix}/${data.slug ?? data.id}` })
}

export function generatePerpDEXDetailsRoute(data: { perpdex: string; params?: Record<string, any> }) {
  return createUrlWithParams({
    url: `${ROUTES.PERP_DEX_DETAILS.path_prefix}/${data.perpdex}`,
    params: data.params,
  })
}
