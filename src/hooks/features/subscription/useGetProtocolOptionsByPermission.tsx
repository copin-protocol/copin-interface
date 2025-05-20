import { useMemo } from 'react'

import { getProtocolOptions } from 'components/@copyTrade/configs'

import useProtocolPermission from './useProtocolPermission'

export default function useGetProtocolOptionsByPermission() {
  const { userPermission: userProtocolPermission, pagePermission: pageProtocolPermission } = useProtocolPermission()
  const protocolOptions = useMemo(() => {
    return getProtocolOptions({
      userPermission: userProtocolPermission,
      pagePermission: pageProtocolPermission,
    })
  }, [userProtocolPermission, pageProtocolPermission])
  return protocolOptions
}
