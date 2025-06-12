import useUsdPricesStore, { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'

export default function useGetUsdPrices() {
  const { prices: _prices, gainsPrices: _gainsPrices, ostiumPrices: _ostiumPrices } = useUsdPricesStore()
  const {
    prices: _realtimePrices,
    gainsPrices: _realtimeGainsPrices,
    hlPrices,
    ostiumPrices: _realtimeOstiumPrices,
    isReady,
  } = useRealtimeUsdPricesStore()

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

  const newRealtimeOstiumPrices = { ..._realtimeOstiumPrices }
  for (const key in newRealtimeOstiumPrices) {
    const value = newRealtimeOstiumPrices[key]
    if (value == null) delete newRealtimeOstiumPrices[key]
  }
  const ostiumPrices = { ..._ostiumPrices, ...(isReady ? newRealtimeOstiumPrices : {}) }

  const getPricesData = (args?: { protocol?: ProtocolEnum; exchange?: CopyTradePlatformEnum }) => {
    if (args?.exchange === CopyTradePlatformEnum.HYPERLIQUID) return hlPrices
    if (args?.exchange === CopyTradePlatformEnum.GNS_V8) return gainsPrices
    if (args?.protocol === ProtocolEnum.HYPERLIQUID) return hlPrices
    if (args?.protocol && GAINS_TRADE_PROTOCOLS.includes(args.protocol)) return gainsPrices
    if (args?.protocol === ProtocolEnum.OSTIUM_ARB) return ostiumPrices
    return prices
  }
  return { prices, gainsPrices, ostiumPrices, getPricesData }
}
