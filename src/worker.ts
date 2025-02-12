import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'
import axios from 'axios'
import axiosRetry from 'axios-retry'

import { MarketsData } from 'entities/markets'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/transform'
import { WorkerMessage } from 'utils/types'

const ports: MessagePort[] = []

//@ts-ignore
onconnect = (e: MessageEvent) => {
  const port = e.ports[0]
  ports.push(port)
}

const requester = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 300000,
  headers: {
    'Access-Control-Max-Age': 600,
  },
})
axiosRetry(requester, { retries: 10, retryDelay: (retryCount) => retryCount * 5_000, retryCondition: () => true })

const PYTH_PRICE_FEED_URL = NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
const pyth = new EvmPriceServiceConnection(PYTH_PRICE_FEED_URL)

const SYMBOLS_BY_PYTH_ID = Object.entries(PYTH_IDS_MAPPING).reduce<Record<string, string[]>>((result, [key, value]) => {
  return { ...result, [value]: [...(result[value] ?? []), key] }
}, {})

function getPriceData({ priceFeed }: { priceFeed: PriceFeed }) {
  if (!priceFeed) return null
  const id = `0x${priceFeed.id}`
  const priceData = priceFeed.getPriceNoOlderThan(60)
  const symbols = SYMBOLS_BY_PYTH_ID[id]
  if (!priceData || !symbols?.length) {
    return null
  }
  return symbols.map((symbol) => ({ symbol, value: Number(priceData.price) * Math.pow(10, priceData.expo) }))
}

const processPriceFeed = (priceFeed: PriceFeed, pricesData: UsdPrices) => {
  const data = getPriceData({ priceFeed })
  if (!data?.length) return pricesData
  data.forEach((parsedData) => {
    const symbol = parsedData.symbol
    const multipleRatio = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol]?.multiple ?? 1
    pricesData[symbol] = parsedData.value * multipleRatio
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

async function initPythWebsocket() {
  try {
    const data = await requester.get(`/pairs/tokens`).then((res: any) => res.data?.data as MarketsData)
    const listAllSymbol = Array.from(
      new Set(
        Object.values(data)
          .map((values) => values.map((_v) => _v.symbol))
          .flat(Infinity) as string[]
      )
    ).sort()

    const pythIds = listAllSymbol.map((symbol) => PYTH_IDS_MAPPING[symbol]).filter((v) => !!v)

    //=========================================

    const allPriceFeedIds = await pyth.getPriceFeedIds()
    const availablePriceFeedIds = pythIds.filter((id) =>
      !!allPriceFeedIds?.length ? allPriceFeedIds?.includes(id.split('0x')?.[1]) : true
    )

    const PYTH_IDS_CHUNKS = chunkArray(availablePriceFeedIds, 100)

    async function fetchAndProcessPriceFeeds() {
      let pricesData = {} as UsdPrices
      for (const pythIds of PYTH_IDS_CHUNKS) {
        const initialCache = await pyth.getLatestPriceFeeds(pythIds)
        initialCache?.forEach((price) => {
          pricesData = processPriceFeed(price, pricesData)
        })
      }
      ports.forEach((port) => {
        const msg: WorkerMessage = { type: 'pyth_price', data: pricesData }
        port.postMessage(msg)
      })
    }

    await fetchAndProcessPriceFeeds()

    await pyth.startWebSocket()

    let lastUpdate = Math.floor(Date.now() / 1000)
    const pricesData = {} as UsdPrices
    const INTERVAL_TIME = 3 // s

    await pyth.subscribePriceFeedUpdates(availablePriceFeedIds, (priceFeed) => {
      const data = getPriceData({ priceFeed })
      if (!data?.length) return
      data.forEach((parsedData) => {
        const symbol = parsedData.symbol
        const multipleRatio = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol]?.multiple ?? 1
        pricesData[symbol] = parsedData.value * multipleRatio
        const publishTime = priceFeed?.getPriceNoOlderThan?.(60)?.publishTime ?? 0
        if (publishTime >= lastUpdate + INTERVAL_TIME) {
          lastUpdate = publishTime
          ports.forEach((port) => {
            const msg: WorkerMessage = { type: 'pyth_price', data: { ...pricesData } }
            port.postMessage(msg)
          })
        }
      })
    })
  } catch (error) {
    // console.log(error)
  }
}
initPythWebsocket()
