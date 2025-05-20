import { useCallback, useMemo } from 'react'

import { ProtocolPermission, ProtocolPermissionConfig } from 'entities/permission'
import { ALLOWED_COPYTRADE_PROTOCOLS, DCP_SUPPORTED_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, ProtocolFilterEnum, SubscriptionPermission } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

import useInternalRole from '../useInternalRole'
import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export const useCopyTradeProtocol = () => {
  const isInternal = useInternalRole()

  const allowedCopyTradeProtocols = isInternal ? Object.values(ProtocolEnum) : ALLOWED_COPYTRADE_PROTOCOLS

  return {
    allowedCopyTradeProtocols,
    allowedCopyTradeDCPProtocols: DCP_SUPPORTED_PROTOCOLS,
  }
}

export default function useProtocolPermission() {
  const isInternal = useInternalRole()
  const { userPermission, pagePermission } = useGetSubscriptionPermission<ProtocolPermission, ProtocolPermissionConfig>(
    {
      section: SubscriptionPermission.PROTOCOL,
    }
  )
  const protocolsAllowed = useMemo(() => userPermission?.protocolAllowed ?? [], [userPermission?.protocolAllowed])
  const allowedSelectProtocols = useMemo(
    () => RELEASED_PROTOCOLS.filter((v) => protocolsAllowed.includes(v)),
    [protocolsAllowed]
  )
  const copyableProtocols = isInternal ? Object.values(ProtocolEnum) : ALLOWED_COPYTRADE_PROTOCOLS
  const releasedProtocols = isInternal ? Object.values(ProtocolEnum) : RELEASED_PROTOCOLS
  const allowedCopyTradeProtocols = useMemo(() => {
    return copyableProtocols.filter((v) => protocolsAllowed.includes(v))
  }, [isInternal, protocolsAllowed])
  const allowedCopyTradeDCPProtocols = useMemo(() => {
    return DCP_SUPPORTED_PROTOCOLS.filter((v) => protocolsAllowed.includes(v))
  }, [protocolsAllowed])

  const convertProtocolToParams = useCallback(
    ({ protocols }: { protocols: ProtocolEnum[] }) => {
      if (protocols.length === 1) {
        return PROTOCOL_OPTIONS_MAPPING[protocols[0]].id
      }
      if (allowedSelectProtocols.length === protocols.length) {
        return ProtocolFilterEnum.ALL
      }
      if (
        protocols.length === allowedCopyTradeProtocols.length &&
        protocols.every((protocol) => allowedCopyTradeProtocols?.includes(protocol))
      ) {
        return ProtocolFilterEnum.ALL_COPYABLE
      }

      return protocols
        .map((protocol) => PROTOCOL_OPTIONS_MAPPING[protocol]?.key)
        .filter((v) => !!v)
        .join('-')
    },
    [allowedCopyTradeProtocols, allowedSelectProtocols.length]
  )

  return {
    allowedSelectProtocols,
    allowedCopyTradeProtocols,
    releasedProtocols,
    copyableProtocols,
    allowedCopyTradeDCPProtocols,
    userPermission,
    pagePermission,
    convertProtocolToParams,
  }
}
