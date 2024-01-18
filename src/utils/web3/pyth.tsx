import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'
import { createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { TOKEN_TRADE_SUPPORT, TokenTrade } from 'utils/config/trades'

export const pyth = new EvmPriceServiceConnection('https://hermes.pyth.network')
export const RealtimeContext = createContext({})

const INTERVAL_TIME = 5 // s
const INCLUDE_PATH = [
  ROUTES.OPEN_INTEREST.path_prefix,
  ROUTES.POSITION_DETAILS.path_prefix,
  ROUTES.TRADER_DETAILS.path_prefix,
  ROUTES.MY_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.MY_HISTORY.path,
]

export default function PythConnection() {
  const { setPrices, setIsReady } = useRealtimeUsdPricesStore()
  const tokenSupports = [
    ...Object.values(TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX]),
    ...Object.values(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  ]
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
          for (let i = 0; i < data.tokenAddresses.length; i++) {
            pricesData = { ...pricesData, [data.tokenAddresses[i]]: data.value }
          }
        })
        setPrices(pricesData)

        setIsReady(true)

        await pyth.subscribePriceFeedUpdates(pythIds, (price) => {
          const data = getPriceData({ tokenSupports, price })
          if (!data) return
          for (let i = 0; i < data.tokenAddresses.length; i++) {
            pricesData = { ...pricesData, [data.tokenAddresses[i]]: data.value }
          }
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
  }, [pathname])

  return null
}

function getPriceData({ tokenSupports, price }: { tokenSupports: TokenTrade[]; price: PriceFeed }) {
  if (!price) return null
  const id = `0x${price.id}`
  const priceData = price.getPriceNoOlderThan(60)
  const tokenAddresses = tokenSupports.filter((e) => e.priceFeedId === id)?.map((e) => e.address)
  if (!priceData || !tokenAddresses || tokenAddresses.length === 0) {
    return null
  }
  return { tokenAddresses, value: Number(priceData.price) * Math.pow(10, priceData.expo) }
}
