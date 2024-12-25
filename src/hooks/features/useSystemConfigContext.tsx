import { ReactNode, createContext, useCallback, useContext, useMemo } from 'react'
import { useQuery } from 'react-query'

import { getListEvent } from 'apis/event'
import { getMarketData } from 'apis/markets'
import { getVolumeLimit } from 'apis/systemApis'
import { EventDetailsData } from 'entities/event'
import { VolumeLimitData } from 'entities/system'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ValueOf } from 'utils/types'

export interface SystemConfigContext {
  volumeLimit: VolumeLimitData | undefined
  eventId: string | undefined
  events: EventDetailsData[] | undefined
  marketConfigs: {
    getSymbolByIndexToken: ({
      protocol,
      indexToken,
    }: {
      protocol?: ProtocolEnum
      indexToken: string | undefined
    }) => string | undefined
    getListSymbol: (args?: { protocol: ProtocolEnum | undefined }) => string[]

    getListSymbolOptions: (args?: { protocol?: ProtocolEnum }) => {
      id: string
      label: string
      value: string
    }[]

    getListSymbolByListIndexToken: ({
      protocol,
      listIndexToken,
    }: {
      protocol: ProtocolEnum | undefined
      listIndexToken: string[] | undefined
    }) => string[]

    getListIndexTokenByListSymbols: ({
      protocol,
      listSymbol,
    }: {
      protocol: ProtocolEnum | undefined
      listSymbol: string[] | undefined
    }) => string[]
    getListIndexToken: ({ protocol }: { protocol: ProtocolEnum }) => string[]
    getSymbolByIndexTokenMapping: ({ protocol }: { protocol: ProtocolEnum }) => Record<string, string> | undefined
  }
}

const SystemConfigContext = createContext<SystemConfigContext>({} as SystemConfigContext)

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const { data: volumeLimit } = useQuery([QUERY_KEYS.GET_SYSTEM_CONFIG], () => getVolumeLimit(), {
    retry: 0,
  })
  const { data: events } = useQuery([QUERY_KEYS.GET_ALL_EVENTS], getListEvent)
  const { data: markets } = useQuery([QUERY_KEYS.GET_MARKET_DATA], getMarketData)

  //========================
  const map = useMemo(() => {
    const symbolByIndexTokenMapping: Partial<Record<ProtocolEnum, Record<string, string>>> = {}
    const indexTokensBySymbolMapping: Partial<Record<ProtocolEnum, Record<string, string[]>>> = {}
    const listSymbolByProtocol: Partial<Record<ProtocolEnum, string[]>> = {}
    const listIndexTokenByProtocol: Partial<Record<ProtocolEnum, string[]>> = {}
    let listAllSymbol: string[] = []
    if (!markets)
      return {
        symbolByIndexTokenMapping,
        indexTokensBySymbolMapping,
        listSymbolByProtocol,
        listAllSymbol,
        listIndexTokenByProtocol,
      }
    //
    const filteredMarkets = Object.entries(markets)
      .filter(([protocol]) => RELEASED_PROTOCOLS.includes(protocol as ProtocolEnum))
      .reduce((acc, [protocol, marketConfig]) => {
        acc[protocol] = marketConfig.map(({ symbol, indexTokens }) => ({ symbol, indexTokens }))
        return acc
      }, {} as Record<string, { symbol: string; indexTokens: string[] }[]>)

    listAllSymbol = Array.from(
      new Set(
        Object.values(filteredMarkets)
          .map((values) => values.map((_v) => _v.symbol))
          .flat(Infinity) as string[]
      )
    ).sort()

    Object.entries(filteredMarkets).forEach(([_protocol, marketConfig]) => {
      const protocol = _protocol as ProtocolEnum
      symbolByIndexTokenMapping[protocol] = {}
      indexTokensBySymbolMapping[protocol] = {}
      listSymbolByProtocol[protocol] = []
      listIndexTokenByProtocol[protocol] = []
      marketConfig.forEach((config) => {
        const symbol = config.symbol
        const indexTokens = [...config.indexTokens]
        indexTokens.forEach((indexToken) => {
          listIndexTokenByProtocol[protocol]!.push(indexToken)
          symbolByIndexTokenMapping[protocol]![indexToken] = symbol
        })
        indexTokensBySymbolMapping[protocol]![symbol] = indexTokens
        listSymbolByProtocol[protocol]!.push(symbol)
      })
      listSymbolByProtocol[protocol]!.sort()
    })
    return {
      symbolByIndexTokenMapping,
      indexTokensBySymbolMapping,
      listSymbolByProtocol,
      listAllSymbol,
      listIndexTokenByProtocol,
    }
  }, [markets])
  const getSymbolByIndexTokenMapping = useCallback(
    ({ protocol }: { protocol: ProtocolEnum }) => {
      return map.symbolByIndexTokenMapping[protocol]
    },
    [map.symbolByIndexTokenMapping]
  )
  const getSymbolByIndexToken = useCallback(
    ({ protocol, indexToken }: { protocol?: ProtocolEnum; indexToken: string | undefined }) => {
      if (!indexToken) return undefined
      if (!!protocol) {
        return map.symbolByIndexTokenMapping[protocol]?.[indexToken]
      }
      const listSymbolMapping = Object.values(map.symbolByIndexTokenMapping)
      let symbol: string | undefined = undefined
      for (const mapping of listSymbolMapping) {
        const foundSymbol = mapping[indexToken]
        if (foundSymbol) {
          symbol = foundSymbol
          break
        }
      }
      return symbol
    },
    [map.symbolByIndexTokenMapping]
  )
  /**
   * if not pass protocol, return all symbol of all protocols
   */
  const getListSymbol = useCallback(
    (args?: { protocol: ProtocolEnum | undefined }) => {
      const { protocol } = args ?? {}
      if (!protocol) {
        return map.listAllSymbol
      } else {
        return map.listSymbolByProtocol[protocol] ?? []
      }
    },
    [map.listAllSymbol, map.listSymbolByProtocol]
  )
  const getListIndexToken = useCallback(
    ({ protocol }: { protocol: ProtocolEnum }) => {
      return map.listIndexTokenByProtocol[protocol] ?? []
    },
    [map.listIndexTokenByProtocol]
  )

  const getListSymbolOptions = useCallback(
    (args?: { protocol?: ProtocolEnum }) => {
      const { protocol } = args ?? {}
      const allOptions = getListSymbol({ protocol }).map((symbol) => ({ id: symbol, label: symbol, value: symbol }))
      return allOptions
    },
    [getListSymbol]
  )

  const getListSymbolByListIndexToken = useCallback(
    ({ protocol, listIndexToken }: { protocol: ProtocolEnum | undefined; listIndexToken: string[] | undefined }) => {
      if (!listIndexToken?.length || !protocol) return [] as string[]
      return Array.from(
        new Set(
          listIndexToken
            .map((indexToken) => map.symbolByIndexTokenMapping[protocol]?.[indexToken])
            .filter((v) => !!v) as string[]
        )
      )
    },
    [map.symbolByIndexTokenMapping]
  )
  const getListIndexTokenByListSymbols = useCallback(
    ({ protocol, listSymbol }: { protocol: ProtocolEnum | undefined; listSymbol: string[] | undefined }) => {
      if (!listSymbol?.length || !protocol || !markets) return [] as string[]
      return Array.from(
        new Set(
          listSymbol
            .map((symbol) => map.indexTokensBySymbolMapping[protocol]?.[symbol])
            .filter((v) => !!v)
            .flat(Infinity) as string[]
        )
      )
    },
    [map.indexTokensBySymbolMapping, markets]
  )
  //=======================================

  const contextValue: SystemConfigContext = {
    volumeLimit,
    events,
    eventId: events?.[0]?.id,
    marketConfigs: {
      getSymbolByIndexTokenMapping,
      getSymbolByIndexToken,
      getListSymbol,
      getListSymbolByListIndexToken,
      getListIndexTokenByListSymbols,
      getListSymbolOptions,
      getListIndexToken,
    },
  }

  return <SystemConfigContext.Provider value={contextValue}>{children}</SystemConfigContext.Provider>
}

export function useSystemConfigContext(): SystemConfigContext
export function useSystemConfigContext<T = ValueOf<SystemConfigContext>>(
  selector?: (context: SystemConfigContext) => T
): T
export function useSystemConfigContext<T = ValueOf<SystemConfigContext>>(
  selector?: (context: SystemConfigContext) => T
): T | SystemConfigContext {
  const context = useContext(SystemConfigContext)
  if (selector) {
    return selector(context)
  }
  return context
}

export function getMaxVolumeCopy({
  plan,
  isRef,
  volumeLimitData,
}: {
  plan: SubscriptionPlanEnum | undefined
  isRef: boolean
  volumeLimitData: VolumeLimitData | undefined
}) {
  if (!volumeLimitData || plan == null) return 0
  // if (isRef) {
  //   if (plan === SubscriptionPlanEnum.VIP) return volumeLimitData.volumeVipReferral
  //   if (plan === SubscriptionPlanEnum.PREMIUM) return volumeLimitData.volumePremiumReferral
  //   return volumeLimitData.volumeReferral
  // } else {
  if (plan === SubscriptionPlanEnum.VIP) return volumeLimitData.volumeVipReferral
  if (plan === SubscriptionPlanEnum.PREMIUM) return volumeLimitData.volumePremiumReferral
  return volumeLimitData.volumeWoReferral
  // }
}
