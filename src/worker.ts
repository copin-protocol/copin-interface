import { HermesClient, PriceUpdate } from '@pythnetwork/hermes-client'

import { MarketsData } from 'entities/markets'
import { API_URL, NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/price'

interface UsdPrices {
  [key: string]: number | undefined
}

interface PriceConfig {
  PYTH_PRICE_FEED_URL: string
  CHUNK_SIZE: number
  UPDATE_INTERVAL: number
  REQUEST_TIMEOUT: number
  MAX_RETRIES: number
  RETRY_DELAY_MULTIPLIER: number
  API_BASE_URL: string
}

interface PriceData {
  symbol: string
  value: number
  publishTime: number
}

interface WorkerMessage {
  type: 'pyth_price'
  data: UsdPrices
}

interface PriceFeed {
  id: string
  price: {
    price: number
    expo: number
    publish_time: number
  }
}

class PriceManager {
  private readonly config: PriceConfig = {
    PYTH_PRICE_FEED_URL: NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io',
    CHUNK_SIZE: 100,
    UPDATE_INTERVAL: 3000,
    REQUEST_TIMEOUT: 300000,
    MAX_RETRIES: 3,
    RETRY_DELAY_MULTIPLIER: 5000,
    API_BASE_URL: API_URL,
  }

  private readonly ports: MessagePort[] = []
  private readonly pythClient: HermesClient = new HermesClient(this.config.PYTH_PRICE_FEED_URL)

  constructor() {
    this.setupWorkerConnection()
  }

  private async fetchWithRetry(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.REQUEST_TIMEOUT)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Access-Control-Max-Age': '600',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      if (retryCount < this.config.MAX_RETRIES) {
        const delay = retryCount * this.config.RETRY_DELAY_MULTIPLIER
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.fetchWithRetry(url, options, retryCount + 1)
      }
      throw error
    }
  }

  private async fetchMarketsData(): Promise<MarketsData> {
    const response = await this.fetchWithRetry(`${this.config.API_BASE_URL}/pairs/tokens`)
    const json = await response.json()
    return json.data as MarketsData
  }

  private setupWorkerConnection(): void {
    // @ts-ignore
    onconnect = (e: MessageEvent) => this.ports.push(e.ports[0])
  }

  private processSymbolMapping(priceFeeds: any[]): Record<string, string> {
    const pythIdsBySymbol = priceFeeds.reduce(
      (acc, item) => ({
        ...acc,
        [item.attributes.base]: '0x' + item.id,
      }),
      {} as Record<string, string>
    )
    return { ...PYTH_IDS_MAPPING, ...pythIdsBySymbol }
  }

  private parsePriceData(priceFeed: PriceFeed, pythIdsMapping: Record<string, string>): PriceData[] | null {
    if (!priceFeed) return null

    const id = `0x${priceFeed.id}`
    const priceData = priceFeed.price
    const symbolByIds = Object.entries(pythIdsMapping).reduce<Record<string, string[]>>(
      (result, [key, value]) => ({
        ...result,
        [value]: [...(result[value] ?? []), key],
      }),
      {}
    )

    const symbols = symbolByIds[id]
    if (!priceData || !symbols?.length) return null

    return symbols.map((symbol) => ({
      symbol,
      value: Number(priceData.price) * Math.pow(10, priceData.expo),
      publishTime: priceData.publish_time * 1000,
    }))
  }

  private updatePrices(priceData: PriceData[], currentPrices: UsdPrices): UsdPrices {
    priceData.forEach(({ symbol, value }) => {
      const multipleRatio = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol]?.multiple ?? 1
      currentPrices[symbol] = value * multipleRatio
    })
    return currentPrices
  }

  private broadcastPriceUpdate(prices: UsdPrices): void {
    const message: WorkerMessage = { type: 'pyth_price', data: prices }
    this.ports.forEach((port) => port.postMessage(message))
  }

  private handlePriceStreamUpdate(
    event: MessageEvent,
    pythIdsMapping: Record<string, string>,
    lastUpdate: Record<string, number>,
    prices: UsdPrices
  ): void {
    const priceUpdate = JSON.parse(event.data) as PriceUpdate
    if (!priceUpdate?.parsed?.length) return

    priceUpdate.parsed.forEach((priceFeed: any) => {
      const priceData = this.parsePriceData(priceFeed, pythIdsMapping)
      if (!priceData) return

      priceData.forEach((data) => {
        const publishTime = data.publishTime
        if (lastUpdate[data.symbol] && publishTime < lastUpdate[data.symbol] + this.config.UPDATE_INTERVAL) {
          return
        }
        lastUpdate[data.symbol] = publishTime
        this.updatePrices([data], prices)
        this.broadcastPriceUpdate(prices)
      })
    })
  }

  public async initializePriceFeeds(): Promise<void> {
    try {
      const [marketsData, priceFeeds] = await Promise.all([
        this.fetchMarketsData(),
        this.pythClient.getPriceFeeds({ assetType: 'crypto' }),
      ])

      const pythIdsMapping = this.processSymbolMapping(priceFeeds)
      const uniqueSymbols = Array.from(
        new Set(Object.values(marketsData).flatMap((values) => values.map((v) => v.symbol)))
      ).sort()

      const availablePythIds = uniqueSymbols
        .map((symbol) => pythIdsMapping[symbol])
        .filter(Boolean)
        .filter((id) => priceFeeds.map((feed) => feed.id).includes(id.split('0x')[1]))

      const priceChunks = this.chunkArray(availablePythIds, this.config.CHUNK_SIZE)
      await this.startPriceFeeds(priceChunks, pythIdsMapping)
    } catch (error) {
      console.error('Failed to initialize price feeds:', error)
      setTimeout(() => this.initializePriceFeeds(), 5000)
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size)
      ;(chunks[chunkIndex] = chunks[chunkIndex] || []).push(item)
      return chunks
    }, [] as T[][])
  }

  private async startPriceFeeds(priceChunks: string[][], pythIdsMapping: Record<string, string>): Promise<void> {
    const prices: UsdPrices = {}
    const lastUpdate: Record<string, number> = {}

    for (const chunk of priceChunks) {
      const initialPrices = await this.pythClient.getLatestPriceUpdates(chunk)
      initialPrices?.parsed?.forEach((priceFeed: any) => {
        const priceData = this.parsePriceData(priceFeed, pythIdsMapping)
        if (priceData) {
          this.updatePrices(priceData, prices)
        }
      })

      const priceStream = await this.pythClient.getPriceUpdatesStream(chunk, {
        ignoreInvalidPriceIds: true,
      })

      priceStream.onmessage = (event) => this.handlePriceStreamUpdate(event, pythIdsMapping, lastUpdate, prices)
      priceStream.onerror = (error) => {
        console.error('Price stream error:', error)
        priceStream.close()
      }
    }

    this.broadcastPriceUpdate(prices)
  }
}

new PriceManager().initializePriceFeeds()
