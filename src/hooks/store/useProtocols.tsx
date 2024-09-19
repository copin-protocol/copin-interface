import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { parsedQueryString } from 'hooks/router/useParsedQueryString'
import { DEFAULT_PROTOCOL, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

interface Context {
  protocol: ProtocolEnum
  navProtocol: string | undefined
  setNavProtocol: Dispatch<SetStateAction<string | undefined>>
}

const ProtocolContext = createContext<Context>({} as Context)

export function ProtocolProvider({ children }: { children: any }) {
  // setNavProtocol to select protocol when click on navigation bar => reset when navigated
  const [navProtocol, setNavProtocol] = useState<string>()

  const protocol = useParsedProtocol()

  const values = useMemo(() => ({ protocol, navProtocol, setNavProtocol }), [navProtocol, protocol])

  return <ProtocolContext.Provider value={values}>{children}</ProtocolContext.Provider>
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

export function parseNavProtocol(navProtocol: string | undefined) {
  const [protocol, distinction] = navProtocol?.split('-') ?? []
  return { protocol: protocol as ProtocolEnum | undefined, distinction: distinction as string | undefined }
}
export function getNavProtocol({ protocol, distinction }: { protocol: ProtocolEnum; distinction: string }) {
  return `${protocol}-${distinction}`
}
