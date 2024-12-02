import useUsdPricesStore, { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

export default function useGetUsdPrices() {
  const { prices: _prices, gainsPrices: _gainsPrices } = useUsdPricesStore()
  const { prices: _realtimePrices, gainsPrices: _realtimeGainsPrices, isReady } = useRealtimeUsdPricesStore()

  const newRealtimePrices = { ..._realtimePrices }
  for (const key in newRealtimePrices) {
    const value = newRealtimePrices[key]
    if (value == null) delete newRealtimePrices[key]
  }
  const prices = { ..._prices, ...(isReady ? newRealtimePrices : {}) }

  const newRealtimeGainsPrices = { ..._realtimeGainsPrices }
  for (const key in newRealtimeGainsPrices) {
    const value = newRealtimeGainsPrices[key]
    if (value == null) delete newRealtimeGainsPrices[key]
  }
  const gainsPrices = { ..._gainsPrices, ...(isReady ? newRealtimeGainsPrices : {}) }
  const getPricesData = (args?: { protocol?: ProtocolEnum }) => {
    if (!!args?.protocol) {
      return GAINS_TRADE_PROTOCOLS.includes(args.protocol) ? gainsPrices : prices
    }
    return prices
  }
  return { prices, gainsPrices, getPricesData }
}
