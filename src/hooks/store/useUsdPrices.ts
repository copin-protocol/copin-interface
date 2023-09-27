import { useEffect } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { getLatestPrices } from 'apis/positionApis'
import { pollEvery } from 'utils/helpers/pollEvery'

export interface UsdPrices {
  [key: string]: number | undefined
}
interface BalancesState {
  prices: UsdPrices
  setPrices: (prices: UsdPrices) => void
}

const useUsdPricesStore = create<BalancesState>()(
  immer((set) => ({
    prices: {},
    setPrices: (prices) =>
      set((state) => {
        state.prices = prices
      }),
  }))
)
export const usePollingUsdPrice = () => {
  const { setPrices } = useUsdPricesStore()
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
    const stopPollingBalance = pollBalance(setPrices)

    return () => {
      cancel = true
      stopPollingBalance()
      setPrices({})
    }
  }, [setPrices])
}

export default useUsdPricesStore
