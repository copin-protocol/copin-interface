import { memo, useEffect } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getLatestPrices } from 'apis/positionApis'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { ProtocolEnum } from 'utils/config/enums'
import { pollEvery } from 'utils/helpers/pollEvery'

export interface UsdPrices {
  [key: string]: number | undefined
}
interface BalancesState {
  prices: UsdPrices
  setPrices: (prices: UsdPrices) => void
  setPrice: ({ address, price }: { address: string; price: number }) => void
  gainsPrices: UsdPrices
  setGainsPrices: (prices: UsdPrices) => void
  setGainsPrice: ({ address, price }: { address: string; price: number }) => void
}

const useUsdPricesStore = create<BalancesState>()(
  immer((set) => ({
    prices: {},
    setPrices: (prices) =>
      set((state) => {
        state.prices = prices
      }),
    setPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.prices[address] = price
      }),
    gainsPrices: {},
    setGainsPrices: (prices) =>
      set((state) => {
        state.gainsPrices = prices
      }),
    setGainsPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.gainsPrices[address] = price
      }),
  }))
)
export const useRealtimeUsdPricesStore = create<
  BalancesState & { isReady: boolean; setIsReady: (isReady: boolean) => void }
>()(
  immer((set) => ({
    prices: {},
    gainsPrices: {},
    isReady: false,
    setIsReady: (isReady) =>
      set((state) => {
        state.isReady = isReady
      }),
    setPrices: (prices) =>
      set((state) => {
        state.prices = { ...state.prices, ...prices }
      }),
    setPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.prices[address] = price
      }),
    setGainsPrices: (prices) =>
      set((state) => {
        state.gainsPrices = { ...state.gainsPrices, ...prices }
      }),
    setGainsPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.gainsPrices[address] = price
      }),
  }))
)
const usePollingUsdPrice = () => {
  const { setPrices } = useUsdPricesStore()
  const { getSymbolByIndexToken } = useMarketsConfig()
  useEffect(() => {
    let cancel = false
    const pollBalance = pollEvery((onUpdate: (prices: UsdPrices) => void) => {
      return {
        async request() {
          return getLatestPrices()
        },
        onResult(result: any) {
          if (cancel || !result) return
          onUpdate(result as UsdPrices)
        },
      }
    }, 30_000)

    // start polling balance every x time
    const stopPollingBalance = pollBalance((prices: UsdPrices) => {
      const parsedPrices: UsdPrices = {}
      if (!prices) return
      Object.entries(prices).forEach(([indexToken, price]) => {
        const symbol = getSymbolByIndexToken({ indexToken })
        if (symbol) {
          parsedPrices[symbol] = price
        }
      })
      setPrices(parsedPrices)
    })

    return () => {
      cancel = true
      stopPollingBalance()
      setPrices({})
    }
  }, [getSymbolByIndexToken, setPrices])
}

const usePollingGainsUsdPrice = () => {
  const { setGainsPrices } = useUsdPricesStore()
  const { getSymbolByIndexToken } = useMarketsConfig()
  useEffect(() => {
    let cancel = false
    const pollBalance = pollEvery((onUpdate: (prices: UsdPrices) => void) => {
      return {
        async request() {
          const pricesData = {} as UsdPrices
          const initialCache = await fetch('https://backend-pricing.eu.gains.trade/charts').then((res) => res.json())
          if (initialCache && initialCache.closes) {
            initialCache.closes.map((price: number, index: number) => {
              const symbol = getSymbolByIndexToken({
                protocol: ProtocolEnum.GNS,
                indexToken: `${ProtocolEnum.GNS}-${index}`,
              })
              if (!symbol) return
              pricesData[symbol] = price
            })
          }
          return pricesData
        },
        onResult(result: any) {
          if (cancel || !result) return
          onUpdate(result as UsdPrices)
        },
      }
    }, 30_000)

    // start polling balance every x time
    const stopPollingBalance = pollBalance(setGainsPrices)

    return () => {
      cancel = true
      stopPollingBalance()
      setGainsPrices({})
    }
  }, [getSymbolByIndexToken, setGainsPrices])
}

export const PollingUsdPrice = memo(function PollingUsdPriceMemo() {
  usePollingUsdPrice()
  usePollingGainsUsdPrice()
  return null
})

export default useUsdPricesStore
