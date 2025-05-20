import { memo, useLayoutEffect } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useSearchParams from 'hooks/router/useSearchParams'
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
  const { searchParams, setSearchParams } = useSearchParams()
  const { allowedCopyTradeProtocols, allowedSelectProtocols, convertProtocolToParams } = useProtocolPermission()

  useLayoutEffect(() => {
    const storedSelectedProtocols = parseStorageData<ProtocolEnum[]>({
      storageKey: STORAGE_KEYS.GLOBAL_PROTOCOLS,
      storage: localStorage,
    })

    // from search params, use at home page
    const parsedOldProtocolSearch = allowedSelectProtocols.find(
      (protocol) => (searchParams.protocol as string)?.toUpperCase() === protocol
    )

    // Get all protocols from query params
    const protocolFromQuery = searchParams.protocol as string | undefined

    const parsedNewProtocolOptions = protocolFromQuery
      ? protocolFromQuery === ProtocolFilterEnum.ALL
        ? allowedSelectProtocols
        : protocolFromQuery === ProtocolFilterEnum.ALL_COPYABLE
        ? allowedCopyTradeProtocols
        : allowedSelectProtocols.includes(protocolFromQuery as ProtocolEnum)
        ? [protocolFromQuery as ProtocolEnum]
        : Object.values(PROTOCOL_OPTIONS_MAPPING)
            .filter(({ key }) => protocolFromQuery.split('-').includes(key.toString()))
            .map(({ id }) => id)
            .filter((p) => allowedSelectProtocols.includes(p))
      : []

    // Get unique protocols
    const uniqueProtocols = Array.from(
      new Set<ProtocolEnum>([parsedOldProtocolSearch, ...parsedNewProtocolOptions].filter(Boolean) as ProtocolEnum[])
    )

    // If no protocol found, use protocol from store
    const protocols: ProtocolEnum[] = uniqueProtocols.length
      ? uniqueProtocols
      : storedSelectedProtocols?.length
      ? storedSelectedProtocols
      : allowedSelectProtocols
    setProtocols(protocols)
    setSearchParams({ protocol: convertProtocolToParams({ protocols }) })
  }, [allowedSelectProtocols, convertProtocolToParams])

  return null
})
