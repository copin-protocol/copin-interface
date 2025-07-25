import { memo, useEffect, useMemo } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getLatestPrices, getOstiumLatestPrices } from 'apis/positionApis'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { ProtocolEnum } from 'utils/config/enums'
import { pollEvery } from 'utils/helpers/pollEvery'
import { UsdPrices } from 'utils/types'

interface BalancesState {
  prices: UsdPrices
  setPrices: (prices: UsdPrices) => void
  setPrice: ({ address, price }: { address: string; price: number }) => void
  gainsPrices: UsdPrices
  setGainsPrices: (prices: UsdPrices) => void
  setGainsPrice: ({ address, price }: { address: string; price: number }) => void
  hlPrices: UsdPrices
  setHlPrices: (prices: UsdPrices) => void
  setHlPrice: ({ address, price }: { address: string; price: number }) => void
  ostiumPrices: UsdPrices
  setOstiumPrices: (prices: UsdPrices) => void
  setOstiumPrice: ({ address, price }: { address: string; price: number }) => void
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
    hlPrices: {},
    setHlPrices: (prices) =>
      set((state) => {
        state.hlPrices = prices
      }),
    setHlPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.hlPrices[address] = price
      }),
    ostiumPrices: {},
    setOstiumPrices: (prices) =>
      set((state) => {
        state.ostiumPrices = prices
      }),
    setOstiumPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.ostiumPrices[address] = price
      }),
  }))
)

export const useRealtimeUsdPricesStore = create<
  BalancesState & { isReady: boolean; setIsReady: (isReady: boolean) => void }
>()(
  immer((set) => ({
    prices: {},
    gainsPrices: {},
    hlPrices: {},
    ostiumPrices: {},
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
    setHlPrices: (prices) =>
      set((state) => {
        state.hlPrices = { ...state.hlPrices, ...prices }
      }),
    setHlPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.hlPrices[address] = price
      }),
    setOstiumPrices: (prices) =>
      set((state) => {
        state.ostiumPrices = { ...state.ostiumPrices, ...prices }
      }),
    setOstiumPrice: ({ address, price }: { address: string; price: number }) =>
      set((state) => {
        state.ostiumPrices[address] = price
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
        const symbol = getSymbolByIndexToken?.({ indexToken })
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

const usePollingOstiumPrice = () => {
  const { getListForexSymbols } = useMarketsConfig()
  const { setOstiumPrices } = useUsdPricesStore()

  const listForexSymbols = useMemo(
    () => (getListForexSymbols ? getListForexSymbols({ protocol: ProtocolEnum.OSTIUM_ARB }) : []),
    [getListForexSymbols]
  )

  useEffect(() => {
    let cancel = false
    const pollBalance = pollEvery((onUpdate: (prices: UsdPrices) => void) => {
      return {
        async request() {
          return getOstiumLatestPrices()
        },
        onResult(result: any) {
          if (cancel || !result) return
          onUpdate(result)
        },
      }
    }, 30_000)

    // start polling balance every x time
    const stopPollingBalance = pollBalance((prices: any[]) => {
      const parsedPrices: UsdPrices = {}
      if (!prices) return
      prices.forEach((price) => {
        const { from, to, mid } = price
        const pair = `${from}-${to}`
        const symbol = listForexSymbols.includes(pair) ? pair : from
        parsedPrices[symbol] = mid
      })
      setOstiumPrices(parsedPrices)
    })

    return () => {
      cancel = true
      stopPollingBalance()
      setOstiumPrices({})
    }
  }, [setOstiumPrices, getListForexSymbols, listForexSymbols])
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
              const symbol = getSymbolByIndexToken?.({
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
  usePollingOstiumPrice()
  return null
})

export default useUsdPricesStore
