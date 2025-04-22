import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'

import { MarketsData } from 'entities/markets'
import { NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { UsdPrices } from 'utils/types'

import { MessageUpdateHandler } from './types'
import { fetchPythPriceIds } from './utils'

export class PythServiceWorker {
  private readonly config = {
    PYTH_PRICE_FEED_URL: NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io',
    CHUNK_SIZE: 50,
    UPDATE_INTERVAL: 2_000,
  }

  private lastUpdatedAt = Date.now()
  private marketsData: MarketsData
  private onPriceUpdate: MessageUpdateHandler
  private updatedPricesData: UsdPrices = {}
  private syncPriceInterval: NodeJS.Timer | null = null
  private pyth = new EvmPriceServiceConnection(this.config.PYTH_PRICE_FEED_URL)
  private symbolByPythId: Record<string, string[]> = Object.entries(PYTH_IDS_MAPPING).reduce<Record<string, string[]>>(
    (result, [key, value]) => {
      return { ...result, [value]: [...(result[value] ?? []), key] }
    },
    {}
  )

  constructor(marketsData: MarketsData, onPriceUpdate: MessageUpdateHandler) {
    this.marketsData = marketsData
    this.onPriceUpdate = onPriceUpdate
    this.updateSymbolByPythId()
    this.initPythWebsocket()
    this.syncPrice()
  }

  private async syncPrice() {
    if (this.syncPriceInterval) {
      clearInterval(this.syncPriceInterval)
    }
    this.syncPriceInterval = setInterval(() => {
      this.onPriceUpdate({ type: 'pyth_price', data: this.updatedPricesData })
    }, this.config.UPDATE_INTERVAL)
  }
  private async updateSymbolByPythId() {
    try {
      const listPriceIdData = await fetchPythPriceIds()
      listPriceIdData.forEach((data) => {
        if (data.attributes.generic_symbol === 'ETHBTC') {
          this.symbolByPythId[data.id] = [data.attributes.generic_symbol]
        } else {
          this.symbolByPythId[data.id] = [data.attributes.base]
        }
      })
    } catch (error) {}
  }

  async initPythWebsocket() {
    try {
      const listAllSymbol = Array.from(
        new Set(
          Object.values(this.marketsData)
            .map((values) => values.map((_v) => _v.symbol))
            .flat(Infinity) as string[]
        )
      ).sort()

      const pythIds = listAllSymbol.map((symbol) => PYTH_IDS_MAPPING[symbol]).filter((v) => !!v)

      //=========================================

      const allPriceFeedIds = await this.pyth.getPriceFeedIds()
      const availablePriceFeedIds = pythIds.filter((id) =>
        !!allPriceFeedIds?.length ? allPriceFeedIds?.includes(id.split('0x')?.[1]) : true
      )

      const PYTH_IDS_CHUNKS = this.chunkArray(availablePriceFeedIds, 100)

      for (const pythIds of PYTH_IDS_CHUNKS) {
        const initialCache = await this.pyth.getLatestPriceFeeds(pythIds)
        initialCache?.forEach((price) => {
          this.processPriceFeed(price)
        })
      }

      await this.pyth.startWebSocket()

      await this.pyth.subscribePriceFeedUpdates(availablePriceFeedIds, (priceFeed) => {
        this.processPriceFeed(priceFeed)
      })
    } catch (error) {
      // console.log(error)
    }
  }
  getPriceData({ priceFeed }: { priceFeed: PriceFeed }) {
    if (!priceFeed) return null
    const id = `0x${priceFeed.id}`
    const priceData = priceFeed.getPriceNoOlderThan(60)
    const symbols = this.symbolByPythId[id]
    if (!priceData || !symbols?.length) {
      return null
    }
    return symbols.map((symbol) => ({ symbol, value: Number(priceData.price) * Math.pow(10, priceData.expo) }))
  }

  processPriceFeed(priceFeed: PriceFeed) {
    const data = this.getPriceData({ priceFeed })
    if (!data?.length) return
    data.forEach((parsedData) => {
      const symbol = parsedData.symbol
      this.updatedPricesData[symbol] = parsedData.value
    })
  }
  private chunkArray<T>(array: T[], size: number): T[][] {
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size)
      ;(chunks[chunkIndex] = chunks[chunkIndex] || []).push(item)
      return chunks
    }, [] as T[][])
  }
}
