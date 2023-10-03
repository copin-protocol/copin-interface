import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export const generateTopOpeningOrdersRoute = (protocol: ProtocolEnum) => `${protocol}${ROUTES.TOP_OPENINGS.path_prefix}`
export const generateTraderDetailsRoute = (protocol: ProtocolEnum, address: string) =>
  `/${protocol}${ROUTES.TRADER_DETAILS.path_prefix}/${address}`
export const generateOpeningPositionRoute = (data: {
  protocol: ProtocolEnum
  account: string
  indexToken: string
  key: string
  blockNumber: number
}) =>
  `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}?account=${data.account}&indexToken=${data.indexToken}&key=${data.key}&blockNumber=${data.blockNumber}`

export const generateMyOpeningPositionRoute = (data: {
  protocol: ProtocolEnum
  copyAccount: string
  indexToken: string
  key: string
}) =>
  `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}?account=${data.copyAccount}&indexToken=${data.indexToken}&key=${data.key}`

export const generateClosedPositionRoute = (
  data: Partial<{ protocol: ProtocolEnum; id: string; nextHours?: number | undefined }>
) =>
  `/${data.protocol}${ROUTES.POSITION_DETAILS.path_prefix}?id=${data.id}${
    data.nextHours ? `&${URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS}=${data.nextHours}` : ''
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
