import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'
import { createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useProtocolStore } from 'hooks/store/useProtocols'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { TOKEN_TRADE_SUPPORT, TokenTrade } from 'utils/config/trades'

export const pyth = new EvmPriceServiceConnection('https://xc-mainnet.pyth.network')
export const RealtimeContext = createContext({})

const INTERVAL_TIME = 5 // s
const INCLUDE_PATH = [
  ROUTES.TOP_OPENINGS.path_prefix,
  ROUTES.POSITION_DETAILS.path_prefix,
  ROUTES.TRADER_DETAILS.path_prefix,
]

export default function PythConnection() {
  const { setPrices, setIsReady } = useRealtimeUsdPricesStore()
  const { protocol } = useProtocolStore()
  const tokenSupports = Object.values(TOKEN_TRADE_SUPPORT[protocol ?? ProtocolEnum.KWENTA])
  const pythIds = tokenSupports.map((x) => x.priceFeedId)
  const { pathname } = useLocation()

  useEffect(() => {
    let lastUpdate = Math.floor(Date.now() / 1000)
    let pricesData = {} as UsdPrices
    const acceptConnection =
      pathname === ROUTES.HOME.path || INCLUDE_PATH.some((path) => !!pathname.match(path)?.length)
    if (acceptConnection) {
      ;(async () => {
        await pyth.startWebSocket()
        const initialCache = await pyth.getLatestPriceFeeds(pythIds)
        initialCache?.forEach((price) => {
          const data = getPriceData({ tokenSupports, price })
          if (!data) return
          pricesData = { ...pricesData, [data.tokenAddress]: data.value }
        })
        setPrices(pricesData)

        setIsReady(true)

        await pyth.subscribePriceFeedUpdates(pythIds, (price) => {
          const data = getPriceData({ tokenSupports, price })
          if (!data) return
          pricesData = { ...pricesData, [data.tokenAddress]: data.value }
          const publishTime = price?.getPriceNoOlderThan?.(60)?.publishTime ?? 0
          if (publishTime >= lastUpdate + INTERVAL_TIME) {
            lastUpdate = publishTime
            setPrices(pricesData)
          }
        })
      })()
    }

    return () => {
      setIsReady(false)
      // pyth.unsubscribePriceFeedUpdates(pythIds)
      pyth.closeWebSocket()
    }
  }, [pathname, protocol])

  return null
}

function getPriceData({ tokenSupports, price }: { tokenSupports: TokenTrade[]; price: PriceFeed }) {
  if (!price) return null
  const id = `0x${price.id}`
  const priceData = price.getPriceNoOlderThan(60)
  const tokenAddress = tokenSupports.find((e) => e.priceFeedId === id)?.address
  if (!priceData || !tokenAddress) {
    return null
  }
  return { tokenAddress, value: Number(priceData.price) * Math.pow(10, priceData.expo) }
}
