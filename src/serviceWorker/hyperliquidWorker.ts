import { UsdPrices } from 'utils/types'
import { WorkerMessage } from 'utils/types'

import { MessageUpdateHandler } from './types'

const CONFIG = {
  MAX_RETRIES: 5,
  RETRY_DELAY: 60_000, // 1 minute in milliseconds
  HEART_INTERVAL: 30_000, // 1 minute in milliseconds
  INTERVAL_TIME: 1_500,
  WS_URL: 'wss://api.hyperliquid.xyz/ws',
}

export class HyperliquidServiceWorker {
  private onPriceUpdate: MessageUpdateHandler
  private updatedPricesData: UsdPrices = {}
  private wsRetryCount = 0
  private ws: WebSocket | null = null
  private isConnected = false
  private syncPriceInterval: NodeJS.Timer | null = null
  private heartInterval: NodeJS.Timer | null = null

  constructor(onPriceUpdate: MessageUpdateHandler) {
    this.onPriceUpdate = onPriceUpdate
    this.iniWebsocket()
  }

  private async iniWebsocket() {
    if (this.wsRetryCount >= CONFIG.MAX_RETRIES) {
      console.error('Max retries reached for gTrade websocket connection. Giving up.')
      return
    }

    // Clean up existing connection if any
    this.cleanup()

    this.ws = new WebSocket(CONFIG.WS_URL)

    this.ws.onopen = () => {
      console.log('Hyperliquid price feed connection opened.')
      this.wsRetryCount = 0 // Reset retry count on successful connection
      this.isConnected = true
      this.ws && this.subscribe(this.ws)
    }

    this.ws.onclose = () => {
      console.log(`Hyperliquid price feed connection closed (attempt ${this.wsRetryCount + 1}/${CONFIG.MAX_RETRIES})`)
      this.isConnected = false
      this.cleanup()
      setTimeout(() => {
        this.wsRetryCount++
        this.iniWebsocket()
      }, CONFIG.RETRY_DELAY)
    }

    this.ws.onmessage = (event: WebSocketEventMap['message']) => {
      try {
        const parsedData = JSON.parse(event.data.toString())
        this.handleMessage(parsedData)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
    this.heart()
  }

  private handleMessage(data: { channel: string; data: { mids: Record<string, string> } }) {
    if (data.channel !== 'allMids') return
    const hlPrices = data.data.mids
    const parsedPrices = Object.entries(hlPrices).reduce((result, [symbol, value]) => {
      if (symbol.match('@')) return result
      const price = parseFloat(value)
      if (isNaN(price)) return result
      return { ...result, [symbol]: price }
    }, {} as UsdPrices)
    this.updatedPricesData = { ...this.updatedPricesData, ...parsedPrices }
    this.onPriceUpdate({ type: 'hl_price', data: this.updatedPricesData })
  }

  private subscribe(ws: WebSocket) {
    // Example subscription message
    const subscribeMsg = {
      method: 'subscribe',
      subscription: {
        type: 'allMids',
      },
    }

    ws.send(JSON.stringify(subscribeMsg))
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

  private heart() {
    // Clear any existing interval first
    if (this.heartInterval) {
      clearInterval(this.heartInterval)
    }
    this.heartInterval = setInterval(() => {
      this.isConnected && this.ws?.send(JSON.stringify({ method: 'ping' }))
    }, CONFIG.HEART_INTERVAL)
  }
}

let instance: BaseServiceWorker
const ports: MessagePort[] = []

//@ts-ignore
self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0]
  ports.push(port)
}

class BaseServiceWorker {
  constructor() {
    if (instance) return instance
    this.init()
  }

  private async init() {
    new HyperliquidServiceWorker(this.broadcastMessageUpdate)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  private broadcastMessageUpdate(message: WorkerMessage): void {
    ports.forEach((port) => {
      port.postMessage(message)
    })
  }
}

new BaseServiceWorker()
