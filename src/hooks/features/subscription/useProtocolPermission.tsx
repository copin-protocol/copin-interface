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
  const copyableProtocols = useMemo(() => {
    return isInternal ? Object.values(ProtocolEnum) : ALLOWED_COPYTRADE_PROTOCOLS
  }, [isInternal])
  const releasedProtocols = useMemo(() => {
    return isInternal ? Object.values(ProtocolEnum) : RELEASED_PROTOCOLS
  }, [isInternal])
  const allowedCopyTradeProtocols = useMemo(() => {
    return copyableProtocols.filter((v) => protocolsAllowed.includes(v))
  }, [isInternal, protocolsAllowed])
  const allowedCopyTradeDCPProtocols = useMemo(() => {
    return DCP_SUPPORTED_PROTOCOLS.filter((v) => protocolsAllowed.includes(v))
  }, [protocolsAllowed])

  const convertProtocolToParams = useCallback(
    ({ protocols, ignorePermission }: { protocols: ProtocolEnum[]; ignorePermission?: boolean }) => {
      const _allowedSelectProtocols = ignorePermission ? RELEASED_PROTOCOLS : allowedSelectProtocols
      const _allowedCopyTradeProtocols = ignorePermission ? ALLOWED_COPYTRADE_PROTOCOLS : allowedCopyTradeProtocols
      if (protocols.length === 1) {
        return PROTOCOL_OPTIONS_MAPPING[protocols[0]].id
      }
      if (_allowedSelectProtocols.length === protocols.length) {
        return ProtocolFilterEnum.ALL
      }
      if (
        protocols.length === _allowedCopyTradeProtocols.length &&
        protocols.every((protocol) => _allowedCopyTradeProtocols?.includes(protocol))
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

  const convertParamsToProtocol = useCallback(
    (protocolFromQuery: string | undefined, ignorePermission = false) => {
      const _allowedSelectProtocols = ignorePermission ? RELEASED_PROTOCOLS : allowedSelectProtocols
      const _allowedCopyTradeProtocols = ignorePermission ? ALLOWED_COPYTRADE_PROTOCOLS : allowedCopyTradeProtocols
      if (!protocolFromQuery) return _allowedSelectProtocols
      const parsedNewProtocolOptions = protocolFromQuery
        ? protocolFromQuery === ProtocolFilterEnum.ALL
          ? _allowedSelectProtocols
          : protocolFromQuery === ProtocolFilterEnum.ALL_COPYABLE
          ? _allowedCopyTradeProtocols
          : _allowedSelectProtocols.includes(protocolFromQuery as ProtocolEnum)
          ? [protocolFromQuery as ProtocolEnum]
          : Object.values(PROTOCOL_OPTIONS_MAPPING)
              .filter(({ key }) => protocolFromQuery.split('-').includes(key.toString()))
              .map(({ id }) => id)
              .filter((p) => _allowedSelectProtocols.includes(p))
        : []
      return parsedNewProtocolOptions
    },
    [allowedCopyTradeProtocols, allowedSelectProtocols]
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
    convertParamsToProtocol,
  }
}
