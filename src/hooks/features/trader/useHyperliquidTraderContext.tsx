import React, { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import {
  getHlAccountFees,
  getHlAccountInfo,
  getHlAccountSpotHolding,
  getHlAccountStaking,
  getHlAccountVault,
  getHlHistoricalOrders,
  getHlLatestPrices,
  getHlOpenOrders,
  getHlOrderFilled,
  getHlPortfolio,
  getHlSpotMeta,
  getHlSubAccounts,
  getHlTwapOrderFilled,
} from 'apis/hyperliquid'
import {
  groupHLOrderFillsByOid,
  parseHLHistoricalOrderData,
  parseHLOrderData,
  parseHLOrderFillData,
  parseHLTwapOrderFillData,
} from 'components/@position/helpers/hyperliquid'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { HYPERLIQUID_API_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import {
  GroupedFillsData,
  HlAccountData,
  HlAccountSpotData,
  HlAccountStakingData,
  HlAccountVaultData,
  HlFeesRawData,
  HlHistoricalOrderData,
  HlOrderData,
  HlOrderFillData,
  HlPortfolioRawData,
  HlSubAccountData,
  HlTokenMappingData,
  HlTwapOrderData,
} from 'entities/hyperliquid'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useHyperliquidModeStore from 'hooks/store/useHyperliquidMode'
import { parseHlSpotData } from 'pages/TraderDetails/HyperliquidApiMode/helpers'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export interface HyperliquidTraderContextData {
  address: string
  protocol: ProtocolEnum
  hlAccountData?: HlAccountData
  hlAccountSpotData?: HlAccountSpotData[]
  hlAccountVaultData?: HlAccountVaultData[]
  hlPortfolioData?: HlPortfolioRawData
  hlFeesData?: HlFeesRawData
  hlStakingData?: HlAccountStakingData
  hlSubAccounts?: HlSubAccountData[]
  hlSpotTokens?: HlTokenMappingData[]
  openOrders?: HlOrderData[]
  filledOrders?: HlOrderFillData[]
  groupedFilledOrders?: GroupedFillsData[]
  twapOrders?: HlTwapOrderData[]
  historicalOrders?: HlHistoricalOrderData[]
  totalOpening: number
  totalOpenOrders: number
  totalOrderFilled: number
  totalTwapFilled: number
  totalHistoricalOrders: number
  isLoading: boolean
  isLoadingSubAccounts: boolean
  isLoadingPortfolio: boolean
  isLoadingFees: boolean
  isLoadingStaking: boolean
  isLoadingAccountSpot: boolean
  isLoadingAccountVault: boolean
  isLoadingSpotMeta: boolean
  isLoadingOpenOders: boolean
  isLoadingFilledOrders: boolean
  isLoadingTwapOders: boolean
  isLoadingHistoricalOders: boolean
  isCombined: boolean
  isAccountValue: boolean
  timeOption: TimeFilterProps
  changeTimeOption: (option: TimeFilterProps) => void
  setIsCombined: (value: boolean) => void
  setIsAccountValue: (value: boolean) => void
  onOpenOrderPageChange: (page: number) => void
  onOrderFilledPageChange: (page: number) => void
  onTwapOrderPageChange: (page: number) => void
  onHistoricalOrderPageChange: (page: number) => void
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
  const { timeframe, setTimeframe, isCombined, isAccountValue, setIsCombined, setIsAccountValue } =
    useHyperliquidModeStore()
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'hlTime',
    options: HYPERLIQUID_API_FILTER_OPTIONS,
    defaultOption: (timeframe ?? TimeFilterByEnum.LAST_24H).toString(),
    optionNameToBeDelete: ['hlTime'],
  })

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

  const { data: hlSubAccounts, isLoading: isLoadingSubAccounts } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_SUB_ACCOUNTS, address],
    () =>
      getHlSubAccounts({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 60_000,
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
      refetchInterval: 60_000,
      keepPreviousData: true,
    }
  )

  const { data: hlFeesData, isLoading: isLoadingFees } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_FEES, address],
    () =>
      getHlAccountFees({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 60_000,
      keepPreviousData: true,
    }
  )

  const { data: hlStakingData, isLoading: isLoadingStaking } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_STAKING, address],
    () =>
      getHlAccountStaking({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 60_000,
      keepPreviousData: true,
    }
  )

  const { data: hlAccountVaultData, isLoading: isLoadingAccountVault } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_VAULT_EQUITIES, address],
    () =>
      getHlAccountVault({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: 60_000,
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
      refetchInterval: 60_000,
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
      refetchInterval: 60_000,
      keepPreviousData: true,
    }
  )

  const hlAccountSpotData = useMemo(
    () => parseHlSpotData(hlAccountSpotRawData, hlSpotTokens),
    [hlAccountSpotRawData, hlSpotTokens]
  )

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
      refetchInterval: enabledRefetchTwapOrder ? 30_000 : undefined,
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

  const [enabledRefetchHistoricalOrder, setEnabledRefetchHistoricalOrder] = useState(true)
  const { data: historicalOrders, isLoading: isLoadingHistoricalOders } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_HISTORICAL_ORDERS, address],
    () =>
      getHlHistoricalOrders({
        user: address,
      }),
    {
      enabled: !!address && isHyperliquid,
      retry: 0,
      refetchInterval: enabledRefetchHistoricalOrder ? 30_000 : undefined,
      keepPreviousData: true,
      select: (data) => {
        return parseHLHistoricalOrderData({ account: address, data })
      },
    }
  )
  const onHistoricalOrderPageChange = useCallback((page: number) => {
    if (page === 1) {
      setEnabledRefetchHistoricalOrder(true)
    } else setEnabledRefetchHistoricalOrder(false)
  }, [])
  historicalOrders?.sort((a, b) => {
    return (b.timestamp ?? 0) - (a.timestamp ?? 0)
  })

  const changeTimeOption = useCallback(
    (option: TimeFilterProps) => {
      changeCurrentOption(option)
      setTimeframe(option.id)
    },
    [changeCurrentOption, setTimeframe]
  )

  const totalOpening = hlAccountData?.assetPositions?.length ?? 0
  const totalOpenOrders = openOrders?.length ?? 0
  const totalOrderFilled = groupedFilledOrders?.length ?? 0
  const totalTwapFilled = twapOrders?.length ?? 0
  const totalHistoricalOrders = historicalOrders?.length ?? 0

  const contextValue: HyperliquidTraderContextData = {
    address,
    protocol,
    hlAccountData,
    hlAccountSpotData,
    hlAccountVaultData,
    hlPortfolioData,
    hlFeesData,
    hlStakingData,
    hlSubAccounts,
    hlSpotTokens,
    openOrders,
    filledOrders,
    groupedFilledOrders,
    twapOrders,
    historicalOrders,
    totalOpening,
    totalOpenOrders,
    totalOrderFilled,
    totalTwapFilled,
    totalHistoricalOrders,
    isLoading,
    isLoadingSubAccounts,
    isLoadingPortfolio,
    isLoadingFees,
    isLoadingStaking,
    isLoadingAccountSpot,
    isLoadingAccountVault,
    isLoadingSpotMeta,
    isLoadingOpenOders,
    isLoadingFilledOrders,
    isLoadingTwapOders,
    isLoadingHistoricalOders,
    isCombined,
    isAccountValue,
    timeOption: currentOption,
    changeTimeOption,
    setIsCombined,
    setIsAccountValue,
    onOpenOrderPageChange,
    onOrderFilledPageChange,
    onTwapOrderPageChange,
    onHistoricalOrderPageChange,
  }

  return <HyperliquidTraderContext.Provider value={contextValue}>{children}</HyperliquidTraderContext.Provider>
}

export const useHyperliquidTraderContext = () => {
  return useContext(HyperliquidTraderContext)
}
