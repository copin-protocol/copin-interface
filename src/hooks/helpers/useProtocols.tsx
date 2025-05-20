import { memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { parsedQueryString } from 'hooks/router/useParsedQueryString'

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
  const { allowedSelectProtocols } = useProtocolPermission()
  const { search, pathname } = useLocation()
  const searchParams = parsedQueryString(search)

  // Old protocol route: /{protocol}/...
  const parsedOldProtocolParam = allowedSelectProtocols.find(
    (protocol) => pathname.split('/')?.[1]?.toUpperCase() === protocol
  )
  // New protocol route: .../{protocol}
  const parsedProtocolParam = allowedSelectProtocols.find(
    (protocol) => pathname.split('/')?.at(-1)?.split('-')?.[0]?.toUpperCase() === protocol
  )
  // from search params, use at home page
  const parsedProtocolSearch = allowedSelectProtocols.find(
    (protocol) => (searchParams.protocol as string)?.toUpperCase() === protocol
  )

  return parsedOldProtocolParam ?? parsedProtocolParam ?? parsedProtocolSearch ?? allowedSelectProtocols[0]
}
