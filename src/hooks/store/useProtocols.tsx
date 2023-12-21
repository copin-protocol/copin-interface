import { ReactNode, cloneElement, createContext, useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { ProtocolEnum } from 'utils/config/enums'

interface Context {
  protocol: ProtocolEnum
  setProtocol: (protocol: ProtocolEnum) => void
}

const ProtocolContext = createContext<Context>({} as Context)

export function ProtocolProvider({ children }: { children: any }) {
  const { search, pathname } = useLocation()
  const parsedProtocolParam = pathname.split('/')?.[1]
  const protocolParam = Object.values(ProtocolEnum).find((protocol) => parsedProtocolParam === protocol)
  const searchParams = parsedQueryString(search)
  const protocolSearch = searchParams.protocol
  const [protocol, setProtocol] = useState(() => {
    if (protocolParam) return protocolParam as ProtocolEnum
    if (protocolSearch) return protocolSearch as ProtocolEnum
    return ProtocolEnum.GMX
  })

  const values = useMemo(() => ({ protocol, setProtocol }), [protocol])

  return <ProtocolContext.Provider value={values}>{cloneElement(children, { key: protocol })}</ProtocolContext.Provider>
}

type valueof<T> = T[keyof T]

export function useProtocolStore(): Context
export function useProtocolStore(selector?: (context: Context) => valueof<Context>): valueof<Context>
export function useProtocolStore(selector?: (context: Context) => valueof<Context>) {
  const context = useContext(ProtocolContext)
  if (selector) {
    return selector(context)
  }
  return context
}
