import useUsdPricesStore, { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'

export default function useGetUsdPrices() {
  const { prices: _prices } = useUsdPricesStore()
  const { prices: _realtimePrices, isReady } = useRealtimeUsdPricesStore()
  const newRealtimePrices = { ..._realtimePrices }
  for (const key in newRealtimePrices) {
    const value = newRealtimePrices[key]
    if (value == null) delete newRealtimePrices[key]
  }
  const prices = { ..._prices, ...(isReady ? newRealtimePrices : {}) }
  return { prices }
}
