import { MarketsData } from 'entities/markets'
import { ProtocolEnum } from 'utils/config/enums'
import { UsdPrices } from 'utils/types'

import { MessageUpdateHandler } from './types'

const GAINS_TRADE_PRICE_FEED_URL = 'wss://backend-pricing.eu.gains.trade'

export class GainsServiceWorker {
  private readonly config = {
    MAX_RETRIES: 5,
    RETRY_DELAY: 60_000, // 1 minute in milliseconds
    INTERVAL_TIME: 1_500,
  }

  private symbolByIndexTokenMapping: Record<string, string> = {}
  private onPriceUpdate: MessageUpdateHandler
  private updatedPricesData: UsdPrices = {}
  private wsRetryCount = 0
  private ws: WebSocket | null = null
  private syncPriceInterval: NodeJS.Timer | null = null

  constructor(marketsData: MarketsData, onPriceUpdate: MessageUpdateHandler) {
    this.symbolByIndexTokenMapping = this.getSymbolByIndexTokenMapping(marketsData)
    this.onPriceUpdate = onPriceUpdate
    this.initPriceFeeds()
    this.iniWebsocket()
  }

  private async iniWebsocket() {
    if (this.wsRetryCount >= this.config.MAX_RETRIES) {
      console.error('Max retries reached for gTrade websocket connection. Giving up.')
      return
    }

    // Clean up existing connection if any
    this.cleanup()

    this.ws = new WebSocket(GAINS_TRADE_PRICE_FEED_URL)

    this.ws.onopen = () => {
      console.log('gTrade price feed connection opened.')
      this.wsRetryCount = 0 // Reset retry count on successful connection
    }

    this.ws.onclose = () => {
      console.log(`gTrade price feed connection closed (attempt ${this.wsRetryCount + 1}/${this.config.MAX_RETRIES})`)
      this.cleanup()
      setTimeout(() => {
        this.wsRetryCount++
        this.iniWebsocket()
      }, this.config.RETRY_DELAY)
    }

    this.ws.onmessage = (event: WebSocketEventMap['message']) => {
      try {
        // if (!isGains) return
        const data = JSON.parse(event.data)
        if (!data || data.length < 2) return {}
        const pricesData: Record<string, number> = {}
        for (let i = 0; i < data.length; i += 2) {
          const pairIndex = data[i]
          const price = data[i + 1]
          const symbol = this.symbolByIndexTokenMapping[`${ProtocolEnum.GNS}-${pairIndex}`]
          if (!symbol) return
          pricesData[symbol] = price
        }
        this.updatedPricesData = { ...this.updatedPricesData, ...pricesData }
        return
      } catch (error) {
        return
      }
    }
    this.syncPrice()
  }

  private cleanup() {
    if (this.ws) {
      // Remove all listeners before closing to prevent memory leaks
      this.ws.onopen = null
      this.ws.onclose = null
      this.ws.onmessage = null
      this.ws.onerror = null

      // Close the connection if it's still open
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close()
      }
      this.ws = null
    }

    // Clear the sync interval
    if (this.syncPriceInterval) {
      clearInterval(this.syncPriceInterval)
      this.syncPriceInterval = null
    }
  }

  private syncPrice() {
    // Clear any existing interval first
    if (this.syncPriceInterval) {
      clearInterval(this.syncPriceInterval)
    }
    this.syncPriceInterval = setInterval(() => {
      this.onPriceUpdate({ type: 'gains_price', data: this.updatedPricesData })
    }, this.config.INTERVAL_TIME)
  }

  private async initPriceFeeds() {
    const pricesData = {} as UsdPrices
    const initialCache = await fetch('https://backend-pricing.eu.gains.trade/charts').then((res) => res.json())
    if (initialCache && initialCache.closes) {
      initialCache.closes.forEach((price: number, index: number) => {
        const symbol = this.symbolByIndexTokenMapping[`${ProtocolEnum.GNS}-${index}`]
        if (!symbol) return
        pricesData[symbol] = price
      })
      this.onPriceUpdate({ type: 'gains_price', data: pricesData })
    }
  }

  private getSymbolByIndexTokenMapping(marketsData: MarketsData) {
    const gainsData = marketsData.GNS
    if (!gainsData) return {}
    const mapping = gainsData.reduce((result, current) => {
      const newResult = { ...result }
      const symbol = current.symbol
      const indexTokens = current.indexTokens
      indexTokens.forEach((indexToken) => {
        newResult[indexToken] = symbol
      })
      return newResult
    }, {} as Record<string, string>)
    return mapping
  }
}
