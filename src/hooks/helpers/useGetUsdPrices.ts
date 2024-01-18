import useUsdPricesStore, { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'

export default function useGetUsdPrices() {
  const { prices: _prices } = useUsdPricesStore()
  const { prices: _realtimePrices, isReady } = useRealtimeUsdPricesStore()
  const prices = isReady ? _realtimePrices : _prices
  return { prices }
}
