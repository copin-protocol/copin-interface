import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'
import { createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import ROUTES from 'utils/config/routes'
import { TOKEN_TRADE_SUPPORT, TokenTrade } from 'utils/config/trades'

import { NETWORK } from '../config/constants'

const PYTH_PRICE_FEED_URL = NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
export const pyth = new EvmPriceServiceConnection(PYTH_PRICE_FEED_URL)
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
// TODO: Check when add new pair as the same 1000BONK, 1000PEPE
const NORMALIZE_LIST = [
  '0xD020364b804f5aDeEB1f0Df9b76d08Ef9eF84C0C',
  '0x32E8C41779fF521aE5688d0F31B32C138bCC85eC',
  '0x43B9cE0394d9AFfc97501359646A410A48c21a11',
]
// TODO: Check when add new protocol
export default function PythConnection() {
  const { setPrices, setIsReady } = useRealtimeUsdPricesStore()
  const tokenSupports = Object.values(TOKEN_TRADE_SUPPORT).reduce((result, values) => {
    return [...result, ...Object.values(values).filter((value) => !!value.priceFeedId)]
  }, [] as TokenTrade[])
  const pythIds = Array.from(new Set(tokenSupports.map((x) => x.priceFeedId)))
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
            pricesData = {
              ...pricesData,
              [data.tokenAddresses[i]]: NORMALIZE_LIST.includes(data.tokenAddresses[i])
                ? data.value * 1000
                : data.value,
            }
          }
        })
        setPrices(pricesData)

        setIsReady(true)

        await pyth.subscribePriceFeedUpdates(pythIds, (price) => {
          const data = getPriceData({ tokenSupports, price })
          if (!data) return
          for (let i = 0; i < data.tokenAddresses.length; i++) {
            pricesData = {
              ...pricesData,
              [data.tokenAddresses[i]]: NORMALIZE_LIST.includes(data.tokenAddresses[i])
                ? data.value * 1000
                : data.value,
            }
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
