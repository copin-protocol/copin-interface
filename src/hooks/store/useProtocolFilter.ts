import { memo, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import useSearchParams from 'hooks/router/useSearchParams'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, ProtocolFilterEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { parseStorageData } from 'utils/helpers/transform'

type ProtocolFilterState = {
  selectedProtocols: ProtocolEnum[] | null
  setProtocols: (protocols: ProtocolEnum[] | null) => void
  urlProtocol: ProtocolEnum | null
  setUrlProtocol: (protocol: ProtocolEnum | null) => void
  handleToggle: (protocol: ProtocolEnum | null) => void
  checkIsSelected: (protocol: ProtocolEnum) => boolean
}
type ProtocolFilterStateModifier = {
  setState: (state: ProtocolFilterState) => void
}
type Store = ProtocolFilterState & ProtocolFilterStateModifier

export const createProtocolFilterStore = (args?: { storageKey?: string; defaultProtocols?: ProtocolEnum[] }) => {
  return create<Store>()(
    persist(
      immer((set, get) => ({
        selectedProtocols: args?.defaultProtocols ?? null,
        urlProtocol: null,
        setProtocols: (protocols) =>
          set((state) => {
            state.selectedProtocols = protocols
          }),
        setUrlProtocol: (protocol) =>
          set((state) => {
            state.urlProtocol = protocol
          }),
        handleToggle: (protocol) =>
          set((state) => {
            if (!protocol) return
            state.selectedProtocols = state.selectedProtocols?.includes(protocol)
              ? state.selectedProtocols.filter((v) => v === protocol)
              : [...(state.selectedProtocols ?? []), protocol]
          }),
        checkIsSelected: (protocol) => !!protocol && !!get().selectedProtocols?.includes(protocol),
        setState(newState) {
          set((state) => {
            state = { ...state, ...newState }
            return state
          })
        },
      })),
      args?.storageKey
        ? {
            name: args.storageKey,
            getStorage: () => localStorage,
          }
        : undefined
    )
  )
}

export const useGlobalProtocolFilterStore = createProtocolFilterStore() // global store not store data in local, manual handle it to make sure default is null

export const ProtocolFilterStoreInitializer = memo(function InitializerMemo() {
  const setProtocols = useGlobalProtocolFilterStore((s) => s.setProtocols)
  const { pathname } = useLocation()
  const { searchParams } = useSearchParams()

  useLayoutEffect(() => {
    const storedSelectedProtocols = parseStorageData<ProtocolEnum[]>({
      storageKey: STORAGE_KEYS.GLOBAL_PROTOCOLS,
      storage: localStorage,
    })
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
      : storedSelectedProtocols?.length
      ? storedSelectedProtocols
      : RELEASED_PROTOCOLS
    setProtocols(protocols)
  }, [])

  return null
})
