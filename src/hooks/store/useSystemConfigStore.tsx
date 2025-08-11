import { useQuery } from 'react-query'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getListEvent } from 'apis/event'
import { getHlPerpMeta } from 'apis/hyperliquid'
import { getMarketData } from 'apis/markets'
import { getPermissionsApi } from 'apis/permissionApis'
import { getSystemConfigApi } from 'apis/systemApis'
import { convertPairHL } from 'components/@position/helpers/hyperliquid'
import { EventDetailsData } from 'entities/event'
import { HlPerpMetaData } from 'entities/hyperliquid'
import { PermissionData } from 'entities/permission'
import { SubscriptionLimitData, SystemAlertData, VolumeLimitData } from 'entities/system'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

interface SystemConfigState {
  systemAlert: SystemAlertData[]
  volumeLimit: VolumeLimitData | undefined
  subscriptionLimit: SubscriptionLimitData | undefined
  eventId: string | undefined
  events: EventDetailsData[] | undefined
  permission: PermissionData | undefined
  hlPerpMeta: HlPerpMetaData | undefined
  marketConfigs: {
    getSymbolByIndexToken?: ({
      protocol,
      indexToken,
    }: {
      protocol?: ProtocolEnum
      indexToken: string | undefined
    }) => string | undefined
    getListSymbol?: (args?: { protocol: ProtocolEnum | undefined }) => string[]
    getListForexSymbols?: (args?: { protocol: ProtocolEnum | undefined }) => string[]

    getListSymbolOptions?: (args?: { protocol?: ProtocolEnum }) => {
      id: string
      label: string
      value: string
    }[]

    getListSymbolByListIndexToken?: ({
      protocol,
      listIndexToken,
    }: {
      protocol: ProtocolEnum | undefined
      listIndexToken: string[] | undefined
    }) => string[]

    getListIndexTokenByListSymbols?: ({
      protocol,
      listSymbol,
    }: {
      protocol: ProtocolEnum | undefined
      listSymbol: string[] | undefined
    }) => string[]
    getListIndexToken?: ({ protocol }: { protocol: ProtocolEnum }) => string[]
    getSymbolByIndexTokenMapping?: ({ protocol }: { protocol: ProtocolEnum }) => Record<string, string> | undefined
    getHlSzDecimalsByPair?: (pair: string | undefined) => number | undefined
  }
}
interface SystemConfigModifier {
  setState: (state: Partial<SystemConfigState>) => void
}

export function SystemConfigInitializer() {
  const setState = useSystemConfigStore((s) => s.setState)
  useQuery(
    [QUERY_KEYS.GET_MARKET_DATA, QUERY_KEYS.GET_HYPERLIQUID_PERP_META],
    () => Promise.all([getMarketData(), getHlPerpMeta()]),
    {
      retry: 0,
      onSuccess: (data) => {
        const [markets, hlPerpMeta] = data

        // Market data processing logic
        //========================
        const map = (() => {
          const symbolByIndexTokenMapping: Partial<Record<ProtocolEnum, Record<string, string>>> = {}
          const indexTokensBySymbolMapping: Partial<Record<ProtocolEnum, Record<string, string[]>>> = {}
          const listSymbolByProtocol: Partial<Record<ProtocolEnum, string[]>> = {}
          const listIndexTokenByProtocol: Partial<Record<ProtocolEnum, string[]>> = {}
          const listForexSymbolByProtocol: Partial<Record<ProtocolEnum, string[]>> = {}
          let listAllSymbol: string[] = []
          if (!markets)
            return {
              symbolByIndexTokenMapping,
              indexTokensBySymbolMapping,
              listSymbolByProtocol,
              listAllSymbol,
              listIndexTokenByProtocol,
              listForexSymbolByProtocol,
            }
          //
          const filteredMarkets = Object.entries(markets)
            .filter(([protocol]) => RELEASED_PROTOCOLS.includes(protocol as ProtocolEnum))
            .reduce((acc, [protocol, marketConfig]) => {
              acc[protocol] = marketConfig.map(({ symbol, indexTokens, isForex }) => ({ symbol, indexTokens, isForex }))
              return acc
            }, {} as Record<string, { symbol: string; indexTokens: string[]; isForex?: boolean }[]>)

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
            listForexSymbolByProtocol[protocol] = []
            marketConfig.forEach((config) => {
              const symbol = config.symbol
              const indexTokens = [...config.indexTokens]
              indexTokens.forEach((indexToken) => {
                listIndexTokenByProtocol[protocol]!.push(indexToken)
                symbolByIndexTokenMapping[protocol]![indexToken] = symbol
              })
              indexTokensBySymbolMapping[protocol]![symbol] = indexTokens
              listSymbolByProtocol[protocol]!.push(symbol)
              if (config.isForex) {
                listForexSymbolByProtocol[protocol]!.push(symbol)
              }
            })
            listSymbolByProtocol[protocol]!.sort()
            listForexSymbolByProtocol[protocol]!.sort()
          })
          return {
            symbolByIndexTokenMapping,
            indexTokensBySymbolMapping,
            listSymbolByProtocol,
            listAllSymbol,
            listIndexTokenByProtocol,
            listForexSymbolByProtocol,
          }
        })()

        const getSymbolByIndexTokenMapping = ({ protocol }: { protocol: ProtocolEnum }) => {
          return map.symbolByIndexTokenMapping[protocol]
        }
        const getSymbolByIndexToken = ({
          protocol,
          indexToken,
        }: {
          protocol?: ProtocolEnum
          indexToken: string | undefined
        }) => {
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
        }
        /**
         * if not pass protocol, return all symbol of all protocols
         */
        const getListSymbol = (args?: { protocol: ProtocolEnum | undefined }) => {
          const { protocol } = args ?? {}
          if (!protocol) {
            return map.listAllSymbol.filter((v) => !!v)
          } else {
            return (map.listSymbolByProtocol[protocol] ?? []).filter((v) => !!v)
          }
        }

        const getListForexSymbols = (args?: { protocol: ProtocolEnum | undefined }) => {
          const { protocol } = args ?? {}
          if (!protocol) {
            return Object.values(map.listForexSymbolByProtocol)
              .flat()
              .filter((v) => !!v)
          } else {
            return (map.listForexSymbolByProtocol[protocol] ?? []).filter((v) => !!v)
          }
        }

        const getListIndexToken = ({ protocol }: { protocol: ProtocolEnum }) => {
          return map.listIndexTokenByProtocol[protocol] ?? []
        }

        const getListSymbolOptions = (args?: { protocol?: ProtocolEnum }) => {
          const { protocol } = args ?? {}
          const allOptions = getListSymbol({ protocol }).map((symbol) => ({
            id: symbol,
            label: symbol,
            value: symbol,
          }))
          return allOptions
        }

        const getListSymbolByListIndexToken = ({
          protocol,
          listIndexToken,
        }: {
          protocol: ProtocolEnum | undefined
          listIndexToken: string[] | undefined
        }) => {
          if (!listIndexToken?.length || !protocol) return [] as string[]
          return Array.from(
            new Set(
              listIndexToken
                .map((indexToken) => map.symbolByIndexTokenMapping[protocol]?.[indexToken])
                .filter((v) => !!v) as string[]
            )
          )
        }
        const getListIndexTokenByListSymbols = ({
          protocol,
          listSymbol,
        }: {
          protocol: ProtocolEnum | undefined
          listSymbol: string[] | undefined
        }) => {
          if (!listSymbol?.length || !protocol || !markets) return [] as string[]
          return Array.from(
            new Set(
              listSymbol
                .map((symbol) => map.indexTokensBySymbolMapping[protocol]?.[symbol])
                .filter((v) => !!v)
                .flat(Infinity) as string[]
            )
          )
        }

        // Hyperliquid perp metadata
        const getHlSzDecimalsByPair = (pair: string | undefined) => {
          if (!pair || !hlPerpMeta?.universe) return undefined
          const universe = hlPerpMeta.universe.find((item) => convertPairHL(item.name) === pair)
          return universe?.szDecimals
        }
        //=======================================

        const contextValue: Partial<SystemConfigState> = {
          hlPerpMeta,
          marketConfigs: {
            getSymbolByIndexTokenMapping,
            getSymbolByIndexToken,
            getListSymbol,
            getListForexSymbols,
            getListSymbolByListIndexToken,
            getListIndexTokenByListSymbols,
            getListSymbolOptions,
            getListIndexToken,
            getHlSzDecimalsByPair,
          },
        }
        setState(contextValue)
      },
    }
  )

  useQuery(
    [QUERY_KEYS.GET_SYSTEM_CONFIG, QUERY_KEYS.GET_ALL_EVENTS, QUERY_KEYS.GET_PLANS_LIMIT, QUERY_KEYS.GET_PERMISSIONS],
    () => Promise.all([getSystemConfigApi(), getListEvent(), getPermissionsApi()]),
    {
      retry: 0,
      onSuccess: (data) => {
        const [systemConfig, events, permissions] = data
        const subscriptionLimit = systemConfig.planSubscriptionLimitConfig.reduce((acc, item) => {
          acc[item.plan] = item
          return acc
        }, {} as SubscriptionLimitData)

        const contextValue: Partial<SystemConfigState> = {
          volumeLimit: systemConfig.copyTradeVolumeConfig,
          systemAlert: systemConfig.systemAlert,
          subscriptionLimit,
          events,
          eventId: events?.[0]?.id,
          permission: permissions,
        }
        setState(contextValue)
      },
    }
  )

  return null
}

export const useSystemConfigStore = create<SystemConfigState & SystemConfigModifier>()(
  immer((set) => ({
    systemAlert: [],
    volumeLimit: undefined,
    subscriptionLimit: undefined,
    eventId: undefined,
    events: undefined,
    hlPerpMeta: undefined,
    marketConfigs: {},
    permission: undefined,
    setState(newState) {
      set((state) => {
        state = { ...state, ...newState }
        return state
      })
    },
  }))
)

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
  if (plan === SubscriptionPlanEnum.ELITE) return volumeLimitData.volumeVipReferral
  if (plan === SubscriptionPlanEnum.PRO) return volumeLimitData.volumePremiumReferral
  return volumeLimitData.volumeWoReferral
  // }
}
