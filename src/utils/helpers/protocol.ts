import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, ProtocolFilterEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export const convertProtocolToParams = (protocols: ProtocolEnum[]) => {
  if (protocols.length === 1) return PROTOCOL_OPTIONS_MAPPING[protocols[0]].id
  if (RELEASED_PROTOCOLS.length === protocols.length) return ProtocolFilterEnum.ALL
  if (
    protocols.length === ALLOWED_COPYTRADE_PROTOCOLS.length &&
    protocols.every((protocol) => ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))
  )
    return ProtocolFilterEnum.ALL_COPYABLE
  return protocols
    .map((protocol) => PROTOCOL_OPTIONS_MAPPING[protocol]?.key)
    .filter((v) => !!v)
    .join('-')
}
