import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { DEFAULT_PROTOCOL, RELEASED_PROTOCOLS } from 'utils/config/constants'

import useGlobalStore from '../store/useGlobalStore'

const ProtocolInitializer = memo(function ProtocolInitializerComponent() {
  const { setProtocol } = useGlobalStore()
  const protocol = useParsedProtocol()
  useEffect(() => {
    setProtocol(protocol)
  }, [protocol])
  return null
})

export default ProtocolInitializer

export function useParsedProtocol() {
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

  return parsedOldProtocolParam ?? parsedProtocolParam ?? parsedProtocolSearch ?? DEFAULT_PROTOCOL
}
