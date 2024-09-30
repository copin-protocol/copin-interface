import QueryString from 'qs'

import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, ProtocolFilterEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export const transformGraphqlFilters = (filters: { fieldName: string; [key: string]: any }[]) => {
  return filters.map(({ fieldName, ...rest }) => {
    // Convert all values in rest to strings
    const convertedRest = Object.fromEntries(
      Object.entries(rest)
        .filter(([_, value]) => Boolean(value))
        .map(([key, value]) => {
          // check if value is an array, keep it as an array
          if (Array.isArray(value)) {
            return [key, value]
          }
          return [key, String(value)]
        })
    )

    // Return new object with 'field' instead of 'fieldName'
    return {
      field: fieldName,
      ...convertedRest,
    }
  })
}

export const useProtocolFromUrl = (searchParams: QueryString.ParsedQs, pathname: string) => {
  const { selectedProtocols } = useProtocolFilter()
  console.log('🚀 ~ useProtocolFromUrl ~ selectedProtocols:', selectedProtocols)

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

  // If no protocol found, use default protocol
  const foundProtocolInUrl: ProtocolEnum[] = uniqueProtocols.length
    ? uniqueProtocols
    : selectedProtocols.length
    ? selectedProtocols
    : RELEASED_PROTOCOLS

  return foundProtocolInUrl
}

export const convertProtocolToParams = (protocols: ProtocolEnum[]) => {
  if (protocols.length === 1) return PROTOCOL_OPTIONS_MAPPING[protocols[0]].id
  if (RELEASED_PROTOCOLS.length === protocols.length) return ProtocolFilterEnum.ALL
  if (
    protocols.length === ALLOWED_COPYTRADE_PROTOCOLS.length &&
    protocols.every((protocol) => ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))
  )
    return ProtocolFilterEnum.ALL_COPYABLE
  return protocols.map((protocol) => PROTOCOL_OPTIONS_MAPPING[protocol].key).join('-')
}
