import { useLocation } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'

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

export const getProtocolFromUrl = () => {
  const { search, pathname } = useLocation()
  const searchParams = parsedQueryString(search)

  // Old protocol route: /{protocol}/...
  const parsedOldProtocolParam = RELEASED_PROTOCOLS.find(
    (protocol) => pathname.split('/')?.[1]?.toUpperCase() === protocol
  )
  // New protocol route: .../{protocol}
  const parsedProtocolParam = RELEASED_PROTOCOLS.find(
    (protocol) => pathname.split('/')?.at(-1)?.split('-')?.[0]?.toUpperCase() === protocol
  )
  // from search params, use at home page
  const parsedProtocolSearch = RELEASED_PROTOCOLS.find(
    (protocol) => (searchParams.protocol as string)?.toUpperCase() === protocol
  )

  return parsedOldProtocolParam ?? parsedProtocolParam ?? parsedProtocolSearch
}
