import { HermesClient } from '@pythnetwork/hermes-client'

import { MarketsData } from 'entities/markets'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { API_URL, NETWORK } from 'utils/config/constants'
import { PYTH_IDS_MAPPING } from 'utils/config/pythIds'
import { PROTOCOL_PRICE_MULTIPLE_MAPPING } from 'utils/helpers/transform'

interface Config {
  CHUNK_SIZE: number
  MAX_RETRIES: number
  RETRY_DELAY: number
  POLLING_INTERVAL: number
}

interface PriceData {
  symbol: string
  value: number
  publishTime: number
}

interface PriceFeed {
  id: string
  price: {
    price: number
    expo: number
    publish_time: number
  }
}

interface PythPriceMessage {
  type: 'pyth_price'
  data: Record<string, number>
}

interface ErrorMessage {
  type: 'error'
  message: string
}

class PricePollingService {
  private isPolling = false
  private pollingInterval?: NodeJS.Timeout
  private hermesClient: HermesClient = new HermesClient(
    NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
  )

  constructor(
    private config: Config,
    private pythIdsMapping: Record<string, string>,
    private onPriceUpdate: (prices: Record<string, number>) => void,
    private onError: (error: Error) => void
  ) {}

  public startPolling(priceChunks: string[][]): void {
    if (this.isPolling) {
      return
    }

    this.isPolling = true
    this.pollPrices(priceChunks)
    this.pollingInterval = setInterval(() => this.pollPrices(priceChunks), this.config.POLLING_INTERVAL)
  }

  public stopPolling(): void {
    this.isPolling = false
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = undefined
    }
  }

  private async pollPrices(priceChunks: string[][]): Promise<void> {
    try {
      const prices: Record<string, number> = {}

      for (const chunk of priceChunks) {
        await this.fetchAndProcessPriceChunk(chunk, prices)
      }

      this.onPriceUpdate(prices)
    } catch (error) {
      await this.handlePollingError(error)
    }
  }

  private async fetchAndProcessPriceChunk(chunk: string[], prices: Record<string, number>): Promise<void> {
    try {
      const priceUpdates = await this.hermesClient.getLatestPriceUpdates(chunk, { ignoreInvalidPriceIds: true })
      priceUpdates?.parsed?.forEach((update: any) => {
        const priceData = this.parsePriceData(update, this.pythIdsMapping)
        if (!priceData) return
        priceData.forEach((data) => {
          this.updatePrices([data], prices)
        })
      })
    } catch (error) {
      throw new Error(`Failed to fetch price chunk: ${error.message}`)
    }
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

  private async handlePollingError(error: Error): Promise<void> {
    this.onError(error)
    this.stopPolling()
  }
}

class PriceWorker {
  private pollingService?: PricePollingService
  private hermesClient: HermesClient
  private connectedPorts: Set<MessagePort>

  private readonly config: Config = {
    CHUNK_SIZE: 10,
    MAX_RETRIES: 3,
    RETRY_DELAY: 3000,
    POLLING_INTERVAL: 10000,
  }

  constructor() {
    this.connectedPorts = new Set()
    this.hermesClient = new HermesClient(
      NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io'
    )
    this.initializeWorker()
  }

  private initializeWorker(): void {
    // @ts-ignore
    self.onconnect = (event: MessageEvent) => {
      const port = event.ports[0]
      this.handlePortConnection(port)
    }
  }

  private handlePortConnection(port: MessagePort): void {
    port.start()
    this.connectedPorts.add(port)

    if (this.connectedPorts.size === 1) {
      this.initializePriceFeeds()
    }

    port.onmessageerror = () => {
      this.connectedPorts.delete(port)
      if (this.connectedPorts.size === 0) {
        this.cleanup()
      }
    }
  }

  private async initializePriceFeeds(): Promise<void> {
    try {
      const [marketsData, priceFeeds] = await Promise.all([
        this.fetchMarketsData(),
        this.hermesClient.getPriceFeeds({ assetType: 'crypto' }),
      ])

      await this.setupPriceFeeds(marketsData, priceFeeds)
    } catch (error) {
      console.error('Failed to initialize price feeds:', error)
      this.broadcastError('Failed to initialize price feeds')
    }
  }

  private async fetchMarketsData(): Promise<MarketsData> {
    const response = await fetch(`${API_URL}/pairs/tokens`)
    const data = await response.json()
    return data?.data
  }

  private async setupPriceFeeds(marketsData: MarketsData, priceFeeds: any[]): Promise<void> {
    try {
      const pythIdsBySymbol = priceFeeds.reduce((acc, item) => {
        const symbol = item.attributes.base
        const pythId = '0x' + item.id
        return {
          ...acc,
          [symbol]: pythId,
        }
      }, {} as Record<string, string>)
      const pythIdsMapping = { ...PYTH_IDS_MAPPING, ...pythIdsBySymbol }

      const listAllSymbol = Array.from(
        new Set(
          Object.values(marketsData)
            .map((values) => values.map((_v) => _v.symbol))
            .flat(Infinity) as string[]
        )
      ).sort()

      const pythIds = listAllSymbol.map((symbol) => pythIdsMapping[symbol]).filter((v) => !!v)

      //=========================================
      const priceChunks = this.chunkArray(pythIds, this.config.CHUNK_SIZE)

      if (this.pollingService) {
        this.pollingService.stopPolling()
      }

      this.pollingService = new PricePollingService(
        this.config,
        pythIdsMapping,
        (prices) => this.handlePriceUpdate(prices),
        (error) => this.handlePollingError(error)
      )

      this.pollingService.startPolling(priceChunks)
    } catch (error) {
      console.error('Failed to setup price feeds:', error)
      this.broadcastError('Failed to setup price feeds')
    }
  }

  private handlePriceUpdate(prices: Record<string, number>): void {
    this.broadcastPrices(prices)
  }

  private handlePollingError(error: Error): void {
    console.error('Polling error:', error)
    this.broadcastError(error.message)
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, (index + 1) * size)
    )
  }

  private broadcastPrices(prices: Record<string, number>): void {
    const message: PythPriceMessage = {
      type: 'pyth_price',
      data: prices,
    }
    this.broadcast(message)
  }

  private broadcastError(error: string): void {
    const message: ErrorMessage = {
      type: 'error',
      message: error,
    }
    this.broadcast(message)
  }

  private broadcast(message: PythPriceMessage | ErrorMessage): void {
    this.connectedPorts.forEach((port) => {
      try {
        port.postMessage(message)
      } catch (error) {
        console.error('Failed to send message to port:', error)
        this.connectedPorts.delete(port)
      }
    })
  }

  private cleanup(): void {
    if (this.pollingService) {
      this.pollingService.stopPolling()
      this.pollingService = undefined
    }
    console.log('Price polling stopped')
  }
}

new PriceWorker()
