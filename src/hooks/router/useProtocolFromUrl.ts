import QueryString from 'qs'
import { useMemo } from 'react'

import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, ProtocolFilterEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { convertProtocolToParams } from 'utils/helpers/protocol'

const useProtocolFromUrl = (searchParams: QueryString.ParsedQs, pathname: string) => {
  const { selectedProtocols } = useProtocolFilter()

  // Old protocol route: /{protocol}/...
  const parsedOldPreProtocolParam = RELEASED_PROTOCOLS.find(
    (protocol) => pathname.split('/')?.[1]?.toUpperCase() === protocol
  )
  // New protocol route: .../{protocol}
  const parsedOldLastProtocolParam = RELEASED_PROTOCOLS.find(
    (protocol) => pathname.split('/')?.at(-1)?.split('-')?.[0]?.toUpperCase() === protocol
  )
  // from search params, use at home page
  const parsedOldProtocolSearch = RELEASED_PROTOCOLS.find(
    (protocol) => (searchParams.protocol as string)?.toUpperCase() === protocol
  )

  // Get all protocols from query params
  const protocolFromQuery = searchParams.protocol as string | undefined

  const parsedNewProtocolOptions = protocolFromQuery
    ? protocolFromQuery === ProtocolFilterEnum.ALL
      ? RELEASED_PROTOCOLS
      : protocolFromQuery === ProtocolFilterEnum.ALL_COPYABLE
      ? ALLOWED_COPYTRADE_PROTOCOLS
      : RELEASED_PROTOCOLS.includes(protocolFromQuery as ProtocolEnum)
      ? [protocolFromQuery as ProtocolEnum]
      : Object.values(PROTOCOL_OPTIONS_MAPPING)
          .filter(({ key }) => protocolFromQuery.split('-').includes(key.toString()))
          .map(({ id }) => id)
    : []

  // Get unique protocols
  const uniqueProtocols = Array.from(
    new Set<ProtocolEnum>(
      [
        parsedOldPreProtocolParam,
        parsedOldLastProtocolParam,
        parsedOldProtocolSearch,
        ...parsedNewProtocolOptions,
      ].filter(Boolean) as ProtocolEnum[]
    )
  )

  // If no protocol found, use protocol from store
  const protocols: ProtocolEnum[] = uniqueProtocols.length
    ? uniqueProtocols
    : selectedProtocols.length
    ? selectedProtocols
    : RELEASED_PROTOCOLS

  const protocolParams = useMemo(() => convertProtocolToParams(protocols), [protocols])

  return { protocols, protocolParams }
}

export default useProtocolFromUrl
