import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import ROUTES from 'utils/config/routes'
import { TOKEN_TRADE_SUPPORT, TokenTrade } from 'utils/config/trades'

import { NETWORK } from '../config/constants'

const PYTH_PRICE_FEED_URL = NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
export const pyth = new EvmPriceServiceConnection(PYTH_PRICE_FEED_URL)

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
  '0x73d96307A0B172dd9963C25eB99beD929303c5b8',
  '0x3d6F251203af12A0b858D250E7ae543B8A1bAD84',
  'HMX_ARB-44',
]

const ALL_TOKEN_SUPPORTS = Object.values(TOKEN_TRADE_SUPPORT).reduce<TokenTrade[]>((result, values) => {
  return [...result, ...Object.entries(values).map(([key, _v]) => ({ address: key, ..._v }))]
}, [])

const PYTH_IDS = Array.from(new Set(ALL_TOKEN_SUPPORTS.map((x) => PYTH_IDS_MAPPING[x.symbol]))).filter((e) => !!e)

const SYMBOL_BY_PYTH_ID = Object.entries(PYTH_IDS_MAPPING).reduce<Record<string, string>>((result, [key, value]) => {
  return { ...result, [value]: key }
}, {})

const TOKENS_BY_SYMBOL = ALL_TOKEN_SUPPORTS.reduce<Record<string, string[]>>((result, { symbol, address }) => {
  return { ...result, [symbol]: [...(result[symbol] ?? []), address] }
}, {})

export default function PythConnection() {
  const { setPrices, setIsReady } = useRealtimeUsdPricesStore()
  const { pathname } = useLocation()

  const initiated = useRef(false)
  useEffect(() => {
    const acceptConnection =
      pathname === ROUTES.HOME.path || INCLUDE_PATH.some((path) => !!pathname.match(path)?.length)
    if (acceptConnection) {
      if (initiated.current) return
      initiated.current = true
      let lastUpdate = Math.floor(Date.now() / 1000)
      let pricesData = {} as UsdPrices
      ;(async () => {
        await pyth.startWebSocket()

        const PYTH_IDS_CHUNKS = chunkArray(PYTH_IDS, 100)

        async function fetchAndProcessPriceFeeds() {
          let pricesData = {} as UsdPrices
          for (const pythIds of PYTH_IDS_CHUNKS) {
            const initialCache = await pyth.getLatestPriceFeeds(pythIds)
            initialCache?.forEach((price) => {
              pricesData = processPriceFeed(price, pricesData)
            })
          }
          setPrices(pricesData)
        }

        await fetchAndProcessPriceFeeds()

        setIsReady(true)

        await pyth.subscribePriceFeedUpdates(PYTH_IDS, (price) => {
          const data = getPriceData({ price })
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
  }, [pathname])

  useEffect(() => {
    return () => {
      pyth.closeWebSocket()
      setIsReady(false)
    }
  }, [])

  return null
}

function getPriceData({ price }: { price: PriceFeed }) {
  if (!price) return null
  const id = `0x${price.id}`
  const priceData = price.getPriceNoOlderThan(60)
  const symbol = SYMBOL_BY_PYTH_ID[id]
  const tokenAddresses = TOKENS_BY_SYMBOL[symbol]
  if (!priceData || !tokenAddresses || tokenAddresses.length === 0) {
    return null
  }
  return { tokenAddresses, value: Number(priceData.price) * Math.pow(10, priceData.expo) }
}

const processPriceFeed = (price: PriceFeed, pricesData: UsdPrices) => {
  const data = getPriceData({ price })
  if (!data) return pricesData
  data.tokenAddresses.forEach((address) => {
    pricesData[address] = NORMALIZE_LIST.includes(address) ? data.value * 1000 : data.value
  })
  return pricesData
}

function chunkArray(array: string[], chunkSize: number) {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}
