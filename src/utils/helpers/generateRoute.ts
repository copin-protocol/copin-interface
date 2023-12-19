import { LINKS, TELEGRAM_BOT_ALERT } from 'utils/config/constants'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export const generateTraderDetailsRoute = (
  protocol: ProtocolEnum,
  address: string,
  others?: { type?: TimeFrameEnum }
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
  data: Partial<{ protocol: ProtocolEnum; id: string; nextHours?: number | undefined }>
) =>
  `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}/${data.id}${
    data.nextHours ? `?${URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS}=${data.nextHours}` : ''
  }`

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
