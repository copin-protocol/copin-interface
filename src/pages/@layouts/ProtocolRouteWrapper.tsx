import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useProtocolStore } from 'hooks/store/useProtocols'
import { ProtocolEnum } from 'utils/config/enums'

export default function ProtocolRouteWrapper({ children }: { children: any }) {
  const { protocol: paramProtocol } = useParams<{ protocol: string }>()
  const { setProtocol, protocol } = useProtocolStore()
  useEffect(() => {
    if (!!paramProtocol && protocol !== paramProtocol) setProtocol(paramProtocol as ProtocolEnum)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramProtocol])
  return children
}
