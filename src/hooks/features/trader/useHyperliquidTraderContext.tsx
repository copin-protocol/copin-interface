import React, { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import {
  getHlAccountInfo,
  getHlAccountSpotHolding,
  getHlLatestPrices,
  getHlOpenOrders,
  getHlOrderFilled,
  getHlPortfolio,
  getHlSpotMeta,
  getHlTwapOrderFilled,
} from 'apis/hyperliquid'
import {
  groupHLOrderFillsByOid,
  parseHLOrderData,
  parseHLOrderFillData,
  parseHLTwapOrderFillData,
} from 'components/@position/helpers/hyperliquid'
import {
  GroupedFillsData,
  HlAccountData,
  HlAccountSpotData,
  HlOrderData,
  HlOrderFillData,
  HlPortfolioRawData,
  HlTokenMappingData,
  HlTwapOrderData,
} from 'entities/hyperliquid'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export interface HyperliquidTraderContextData {
  address: string
  protocol: ProtocolEnum
  hlAccountData?: HlAccountData
  hlAccountSpotData?: HlAccountSpotData[]
  hlPortfolioData?: HlPortfolioRawData
  openOrders?: HlOrderData[]
  filledOrders?: HlOrderFillData[]
  groupedFilledOrders?: GroupedFillsData[]
  twapOrders?: HlTwapOrderData[]
  totalOpening: number
  totalOpenOrders: number
  totalOrderFilled: number
  totalTwapFilled: number
  isLoading: boolean
  isLoadingPortfolio: boolean
  isLoadingAccountSpot: boolean
  isLoadingSpotMeta: boolean
  isLoadingOpenOders: boolean
  isLoadingFilledOrders: boolean
  isLoadingTwapOders: boolean
  onOpenOrderPageChange: (page: number) => void
  onOrderFilledPageChange: (page: number) => void
  onTwapOrderPageChange: (page: number) => void
}

const HyperliquidTraderContext = createContext<HyperliquidTraderContextData>({} as HyperliquidTraderContextData)
export const HyperliquidTraderProvider = ({
  address,
  protocol,
  children,
}: {
  address: string
  protocol: ProtocolEnum
  children: ReactNode
}) => {
  const isHyperliquid = protocol === ProtocolEnum.HYPERLIQUID
  const { data: hlAccountData, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_DETAIL, address],
    () =>
      getHlAccountInfo({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )

  const { data: hlPortfolioData, isLoading: isLoadingPortfolio } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_PORTFOLIO, address],
    () =>
      getHlPortfolio({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )

  const { data: hlAccountSpotRawData, isLoading: isLoadingAccountSpot } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_SPOT_HOLDING, address],
    () =>
      getHlAccountSpotHolding({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const [hlSpotTokens, setHlSpotTokens] = useState<HlTokenMappingData[]>([])
  const { isLoading: isLoadingSpotMeta } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_SPOT_META, QUERY_KEYS.GET_HYPERLIQUID_LATEST_PRICES],
    () => Promise.all([getHlSpotMeta(), getHlLatestPrices()]),
    {
      onSuccess: (data) => {
        const [spotMeta, prices] = data
        // Build spot token list with price
        if (spotMeta && spotMeta.universe && spotMeta.tokens) {
          const tokensByIndex = Object.fromEntries(spotMeta.tokens.map((t) => [t.index, t]))
          const spotTokens = spotMeta.universe.map((pair) => {
            const [baseIdx, quoteIdx] = pair.tokens
            const base = tokensByIndex[baseIdx]
            const quote = tokensByIndex[quoteIdx]
            const priceKey = pair.name
            return {
              pairName: pair.name,
              displayName: base && quote ? `${base.name}/${quote.name}` : priceKey,
              baseToken: base,
              quoteToken: quote,
              price: prices[priceKey] ?? null,
              index: pair.index,
              isCanonical: pair.isCanonical,
            } as HlTokenMappingData
          })
          setHlSpotTokens(spotTokens)
        }
      },
      enabled: isHyperliquid,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const hlAccountSpotData = useMemo(() => {
    return hlAccountSpotRawData?.balances?.map((balance) => {
      const coin = balance.coin
      const price = coin === 'USDC' ? 1 : hlSpotTokens.find((e) => e.baseToken.name === coin)?.price ?? 0
      const total = Number(balance.total)
      const entryValue = Number(balance.entryNtl)
      const currentValue = total * price
      const unrealizedPnl = coin === 'USDC' ? undefined : currentValue - entryValue
      return {
        coin,
        price,
        total,
        entryValue,
        currentValue,
        unrealizedPnl,
        roe: entryValue && unrealizedPnl ? (unrealizedPnl / entryValue) * 100 : 0,
        token: balance.token,
      } as HlAccountSpotData
    })
  }, [hlAccountSpotRawData?.balances, hlSpotTokens])

  const [enabledRefetchOpenOrder, setEnabledRefetchOpenOrder] = useState(true)
  const { data: openOrders, isLoading: isLoadingOpenOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_OPEN_ORDERS, address],
    () =>
      getHlOpenOrders({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchOpenOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderData({ account: address, data })
      },
    }
  )
  const onOpenOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchOpenOrder(true)
    } else setEnabledRefetchOpenOrder(false)
  }, [])
  openOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  const [enabledRefetchOrderFilled, setEnabledRefetchOrderFilled] = useState(true)
  const { data: filledOrders, isLoading: isLoadingFilledOrders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_FILLED_ORDERS, address],
    () =>
      getHlOrderFilled({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchOrderFilled ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLOrderFillData({ account: address, data })
      },
    }
  )
  const onOrderFilledPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchOrderFilled(true)
    } else setEnabledRefetchOrderFilled(false)
  }, [])

  // Sort filled orders by timestamp
  filledOrders?.sort((a, b) => b.timestamp - a.timestamp)

  // Group the filled orders
  const groupedFilledOrders = useMemo(() => {
    if (!filledOrders) return []
    return groupHLOrderFillsByOid(filledOrders)
  }, [filledOrders])

  const [enabledRefetchTwapOrder, setEnabledRefetchTwapOrder] = useState(true)
  const { data: twapOrders, isLoading: isLoadingTwapOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TWAP_ORDERS, address],
    () =>
      getHlTwapOrderFilled({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchTwapOrder ? 15_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLTwapOrderFillData({ account: address, data })
      },
    }
  )
  const onTwapOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchTwapOrder(true)
    } else setEnabledRefetchTwapOrder(false)
  }, [])
  twapOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  const totalOpening = hlAccountData?.assetPositions?.length ?? 0
  const totalOpenOrders = openOrders?.length ?? 0
  const totalOrderFilled = groupedFilledOrders?.length ?? 0
  const totalTwapFilled = twapOrders?.length ?? 0

  const contextValue: HyperliquidTraderContextData = {
    address,
    protocol,
    hlAccountData,
    hlAccountSpotData,
    hlPortfolioData,
    openOrders,
    filledOrders,
    groupedFilledOrders,
    twapOrders,
    totalOpening,
    totalOpenOrders,
    totalOrderFilled,
    totalTwapFilled,
    isLoading,
    isLoadingPortfolio,
    isLoadingAccountSpot,
    isLoadingSpotMeta,
    isLoadingOpenOders,
    isLoadingFilledOrders,
    isLoadingTwapOders,
    onOpenOrderPageChange,
    onOrderFilledPageChange,
    onTwapOrderPageChange,
  }

  return <HyperliquidTraderContext.Provider value={contextValue}>{children}</HyperliquidTraderContext.Provider>
}

export const useHyperliquidTraderContext = () => {
  return useContext(HyperliquidTraderContext)
}
