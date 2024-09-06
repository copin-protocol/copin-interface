import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'

import { UsdPrices } from 'hooks/store/useUsdPrices'
import { NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { TOKEN_TRADE_SUPPORT, TokenTrade } from 'utils/config/trades'
import { WorkerMessage } from 'utils/types'

const ports: MessagePort[] = []

//@ts-ignore
onconnect = (e: MessageEvent) => {
  const port = e.ports[0]
  ports.push(port)
}

const PYTH_PRICE_FEED_URL = NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
const ALL_TOKEN_SUPPORTS = Object.values(TOKEN_TRADE_SUPPORT).reduce<TokenTrade[]>((result, values) => {
  return [...result, ...Object.entries(values).map(([key, _v]) => ({ address: key, ..._v }))]
}, [])
const PYTH_IDS = Array.from(new Set(ALL_TOKEN_SUPPORTS.map((x) => PYTH_IDS_MAPPING[x.symbol]))).filter((e) => !!e)

const pyth = new EvmPriceServiceConnection(PYTH_PRICE_FEED_URL)

const SYMBOL_BY_PYTH_ID = Object.entries(PYTH_IDS_MAPPING).reduce<Record<string, string>>((result, [key, value]) => {
  return { ...result, [value]: key }
}, {})

const TOKENS_BY_SYMBOL = ALL_TOKEN_SUPPORTS.reduce<Record<string, string[]>>((result, { symbol, address }) => {
  return { ...result, [symbol]: [...(result[symbol] ?? []), address] }
}, {})

const NORMALIZE_LIST = [
  '0xD020364b804f5aDeEB1f0Df9b76d08Ef9eF84C0C',
  '0x32E8C41779fF521aE5688d0F31B32C138bCC85eC',
  '0x43B9cE0394d9AFfc97501359646A410A48c21a11',
  '0x73d96307A0B172dd9963C25eB99beD929303c5b8',
  '0x3d6F251203af12A0b858D250E7ae543B8A1bAD84',
  'HMX_ARB-44',
]

function getPriceData({ priceFeed }: { priceFeed: PriceFeed }) {
  if (!priceFeed) return null
  const id = `0x${priceFeed.id}`
  const priceData = priceFeed.getPriceNoOlderThan(60)
  const symbol = SYMBOL_BY_PYTH_ID[id]
  const tokenAddresses = TOKENS_BY_SYMBOL[symbol]
  if (!priceData || !tokenAddresses || tokenAddresses.length === 0) {
    return null
  }
  return { tokenAddresses, value: Number(priceData.price) * Math.pow(10, priceData.expo) }
}

const processPriceFeed = (priceFeed: PriceFeed, pricesData: UsdPrices) => {
  const data = getPriceData({ priceFeed })
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

async function initPythWebsocket() {
  const allPriceFeedIds = await pyth.getPriceFeedIds()
  const availablePriceFeedIds = PYTH_IDS.filter((id) =>
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

  // if (!isGains) {
  await fetchAndProcessPriceFeeds()

  await pyth.startWebSocket()

  let lastUpdate = Math.floor(Date.now() / 1000)
  const pricesData = {} as UsdPrices
  const INTERVAL_TIME = 3 // s

  await pyth.subscribePriceFeedUpdates(availablePriceFeedIds, (priceFeed) => {
    const data = getPriceData({ priceFeed })
    if (!data) return
    for (let i = 0; i < data.tokenAddresses.length; i++) {
      pricesData[data.tokenAddresses[i]] = NORMALIZE_LIST.includes(data.tokenAddresses[i])
        ? data.value * 1000
        : data.value
    }
    const publishTime = priceFeed?.getPriceNoOlderThan?.(60)?.publishTime ?? 0
    if (publishTime >= lastUpdate + INTERVAL_TIME) {
      lastUpdate = publishTime
      ports.forEach((port) => {
        const msg: WorkerMessage = { type: 'pyth_price', data: { ...pricesData } }
        port.postMessage(msg)
      })
    }
  })
}
initPythWebsocket()
