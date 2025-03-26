import { HermesClient, PriceUpdate } from '@pythnetwork/hermes-client'

import { MarketsData } from 'entities/markets'
import { NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/price'
import { UsdPrices } from 'utils/types'

import { MessageUpdateHandler, PythPriceData, PythPriceFeed } from './types'

export class PythServiceWorker {
  private readonly config = {
    PYTH_PRICE_FEED_URL: NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io',
    CHUNK_SIZE: 50,
    UPDATE_INTERVAL: 3_000,
  }

  private lastUpdatedAt = Date.now()
  private marketsData: MarketsData
  private onPriceUpdate: MessageUpdateHandler
  private readonly pythClient: HermesClient = new HermesClient(this.config.PYTH_PRICE_FEED_URL)
  private updatedPricesData: UsdPrices = {}

  constructor(marketsData: MarketsData, onPriceUpdate: MessageUpdateHandler) {
    this.marketsData = marketsData
    this.onPriceUpdate = onPriceUpdate
    this.initializePriceFeeds()
  }
  public getPrices() {
    return this.updatedPricesData
  }

  private async initializePriceFeeds(): Promise<void> {
    try {
      const priceFeeds = await this.pythClient.getPriceFeeds({ assetType: 'crypto' })

      const pythIdsMapping = this.processSymbolMapping(priceFeeds)
      const uniqueSymbols = Array.from(
        new Set(Object.values(this.marketsData).flatMap((values) => values.map((v) => v.symbol)))
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
    try {
      for (const chunk of priceChunks) {
        const initialPrices = await this.pythClient.getLatestPriceUpdates(chunk)
        initialPrices?.parsed?.forEach((priceFeed: any) => {
          const priceData = this.parsePriceData(priceFeed, pythIdsMapping)
          if (priceData) {
            this.updatePrices(priceData)
          }
        })

        const priceStream = await this.pythClient.getPriceUpdatesStream(chunk, {
          ignoreInvalidPriceIds: true,
        })

        priceStream.onmessage = (event) => this.handlePriceStreamUpdate(event, pythIdsMapping)
        priceStream.onerror = (error) => {
          console.error('Price stream error:', error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  private handlePriceStreamUpdate(event: MessageEvent, pythIdsMapping: Record<string, string>): void {
    const now = Date.now()
    if (now < this.lastUpdatedAt + this.config.UPDATE_INTERVAL) {
      return
    }
    this.lastUpdatedAt = now
    try {
      const priceUpdate = JSON.parse(event.data) as PriceUpdate
      if (!priceUpdate?.parsed?.length) return

      priceUpdate.parsed?.forEach((priceFeed: any) => {
        const priceData = this.parsePriceData(priceFeed, pythIdsMapping)
        if (!priceData) return

        priceData.forEach((data) => {
          this.updatePrices([data])
        })
      })
      this.onPriceUpdate({ type: 'pyth_price', data: this.updatedPricesData })
    } catch (error) {
      console.log(error)
    }
  }

  private updatePrices(priceData: PythPriceData[]) {
    priceData.forEach(({ symbol, value }) => {
      const multipleRatio = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol]?.multiple ?? 1
      this.updatedPricesData[symbol] = value * multipleRatio
    })
  }

  private parsePriceData(priceFeed: PythPriceFeed, pythIdsMapping: Record<string, string>): PythPriceData[] | null {
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

  private processSymbolMapping(priceFeeds: any[]): Record<string, string> {
    const pythIdsBySymbol = priceFeeds
      .filter((e) => e.attributes.quote_currency === 'USD')
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.attributes.base]: '0x' + item.id,
        }),
        {} as Record<string, string>
      )
    return { ...PYTH_IDS_MAPPING, ...pythIdsBySymbol }
  }
}
