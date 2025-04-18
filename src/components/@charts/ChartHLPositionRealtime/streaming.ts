import {
  Bar,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from '../../../../public/static/charting_library'
import { hlIntervalToTvResolution } from './datafeed'

// Import the mapping function

// Define the structure for Hyperliquid candle data from WebSocket
interface HLCandleData {
  t: number // Start time (ms)
  T: number // End time (ms)
  s: string // Symbol (e.g., "BTC")
  i: string // Interval (e.g., "15m")
  o: string // Open price
  c: string // Close price
  h: string // High price
  l: string // Low price
  v: string // Volume
  n: number // Number of trades
}

interface HLWebSocketMessage {
  channel: string
  data: HLCandleData | any // Allow for other message types
}

type Handler = {
  id: string
  callback: SubscribeBarsCallback
}

type SubscriptionItem = {
  subscriberUID: string
  symbolInfo: LibrarySymbolInfo
  resolution: ResolutionString
  handlers: Handler[]
}

const channelToSubscription = new Map<string, SubscriptionItem>()
const HL_WEBSOCKET_URL = 'wss://api-ui.hyperliquid.xyz/ws'

let webSocketInstance: WebSocket | null = null
let connectionCheckInterval: NodeJS.Timeout | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 5000 // 5 seconds

// Keep track of active subscriptions to resubscribe on reconnect
const activeSubscriptions = new Map<string, { coin: string; interval: string }>()

function connectWebSocket() {
  if (webSocketInstance && webSocketInstance.readyState === WebSocket.OPEN) {
    console.log('[HL WebSocket] Already connected.')
    return
  }

  if (webSocketInstance && webSocketInstance.readyState === WebSocket.CONNECTING) {
    console.log('[HL WebSocket] Connection attempt already in progress.')
    return
  }

  console.log('[HL WebSocket] Attempting to connect...')
  webSocketInstance = new WebSocket(HL_WEBSOCKET_URL)

  webSocketInstance.onopen = () => {
    console.log('[HL WebSocket] Connected')
    reconnectAttempts = 0 // Reset reconnect attempts on successful connection
    // Resubscribe to necessary channels upon successful connection/reconnection
    resubscribeToCandles()
    startConnectionCheck()
  }

  webSocketInstance.onclose = (event) => {
    console.log('[HL WebSocket] Disconnected:', event.reason, 'Code:', event.code)
    stopConnectionCheck()
    webSocketInstance = null
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++
      console.log(
        `[HL WebSocket] Attempting reconnect ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${
          RECONNECT_DELAY / 1000
        }s...`
      )
      setTimeout(connectWebSocket, RECONNECT_DELAY)
    } else {
      console.error('[HL WebSocket] Max reconnect attempts reached.')
    }
  }

  webSocketInstance.onerror = (error) => {
    console.error('[HL WebSocket] Error:', error)
    // The onclose event will likely follow, triggering reconnect logic
  }

  webSocketInstance.onmessage = (event) => {
    try {
      const message: HLWebSocketMessage = JSON.parse(event.data)

      if (message.channel === 'candle') {
        handleCandleMessage(message.data as HLCandleData)
      }
      // Handle other message types if needed
    } catch (error) {
      console.error('[HL WebSocket] Error parsing message:', error, event.data)
    }
  }
}

function startConnectionCheck() {
  stopConnectionCheck() // Clear existing interval if any
  connectionCheckInterval = setInterval(() => {
    if (webSocketInstance && webSocketInstance.readyState === WebSocket.OPEN) {
      webSocketInstance.send(JSON.stringify({ method: 'ping' }))
    } else {
      console.warn('[HL WebSocket] Connection check failed, attempting reconnect...')
      stopConnectionCheck() // Prevent multiple reconnect loops
      connectWebSocket() // Attempt to reconnect if ping fails or socket is not open
    }
  }, 30000) // Send ping every 30 seconds
}

function stopConnectionCheck() {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval)
    connectionCheckInterval = null
  }
}

function handleCandleMessage(data: HLCandleData) {
  const symbol = data.s
  const interval = data.i
  const tvResolution = hlIntervalToTvResolution(interval)

  if (!tvResolution) {
    console.warn(`[HL stream] Received candle for unknown interval: ${interval}`)
    return
  }

  // Construct the unique key used in channelToSubscription map
  const subscriptionKey = `${symbol}/${tvResolution}`
  const subscriptionItem = channelToSubscription.get(subscriptionKey)

  if (!subscriptionItem) {
    return
  }

  // Ensure the received candle's resolution matches the subscription
  if (subscriptionItem.resolution !== tvResolution) {
    return
  }

  const bar: Bar = {
    time: data.t, // HL provides ms, TV chart expects ms
    open: parseFloat(data.o),
    high: parseFloat(data.h),
    low: parseFloat(data.l),
    close: parseFloat(data.c),
    volume: parseFloat(data.v),
  }

  // Send data to every subscriber for this symbol and resolution
  subscriptionItem.handlers.forEach((handler) => {
    try {
      handler.callback(bar)
    } catch (error) {
      console.error('[HL stream] Error calling handler callback:', error)
    }
  })
}

function sendSubscription(coin: string, interval: string) {
  if (webSocketInstance && webSocketInstance.readyState === WebSocket.OPEN) {
    const subscriptionMessage = {
      method: 'subscribe',
      subscription: {
        type: 'candle',
        coin,
        interval,
      },
    }
    console.log('[HL WebSocket] Sending subscription:', subscriptionMessage)
    webSocketInstance.send(JSON.stringify(subscriptionMessage))
    activeSubscriptions.set(`${coin}/${interval}`, { coin, interval })
  } else {
    console.warn('[HL WebSocket] Cannot send subscription, socket not open.')
    activeSubscriptions.set(`${coin}/${interval}`, { coin, interval })
  }
}

function sendUnsubscription(coin: string, interval: string) {
  if (webSocketInstance && webSocketInstance.readyState === WebSocket.OPEN) {
    const unsubscriptionMessage = {
      method: 'unsubscribe',
      subscription: {
        type: 'candle',
        coin,
        interval,
      },
    }
    console.log('[HL WebSocket] Sending unsubscription:', unsubscriptionMessage)
    webSocketInstance.send(JSON.stringify(unsubscriptionMessage))
    activeSubscriptions.delete(`${coin}/${interval}`)
  } else {
    console.warn('[HL WebSocket] Cannot send unsubscription, socket not open.')
    activeSubscriptions.delete(`${coin}/${interval}`)
  }
}

function resubscribeToCandles() {
  console.log('[HL WebSocket] Resubscribing to active channels...')
  activeSubscriptions.forEach((sub) => {
    sendSubscription(sub.coin, sub.interval)
  })
}

export function initWebSocket() {
  if (!webSocketInstance) {
    connectWebSocket()
  }
}

export function subscribeOnStream(
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onRealtimeCallback: SubscribeBarsCallback,
  subscriberUID: string,
  onResetCacheNeededCallback: () => void,
  lastDailyBar: Bar | undefined
) {
  initWebSocket()

  const coin = symbolInfo.name
  const interval = tvResolutionToHLInterval(resolution)
  const subscriptionKey = `${coin}/${resolution}`

  const handler: Handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  }

  let subscriptionItem = channelToSubscription.get(subscriptionKey)

  if (subscriptionItem) {
    subscriptionItem.handlers.push(handler)
    console.log(`[HL stream] Added handler ${subscriberUID} to existing subscription ${subscriptionKey}`)
  } else {
    subscriptionItem = {
      subscriberUID,
      symbolInfo,
      resolution,
      handlers: [handler],
    }
    channelToSubscription.set(subscriptionKey, subscriptionItem)
    console.log(`[HL stream] New subscription ${subscriptionKey} with handler ${subscriberUID}`)
    sendSubscription(coin, interval)
  }
}

export function unsubscribeFromStream(subscriberUID: string) {
  let subscriptionKeyToDelete: string | null = null
  channelToSubscription.forEach((subscriptionItem, key) => {
    const handlerIndex = subscriptionItem.handlers.findIndex((handler) => handler.id === subscriberUID)

    if (handlerIndex !== -1) {
      console.log(`[HL stream] Removing handler ${subscriberUID} from subscription ${key}`)
      subscriptionItem.handlers.splice(handlerIndex, 1)

      if (subscriptionItem.handlers.length === 0) {
        subscriptionKeyToDelete = key
        const coin = subscriptionItem.symbolInfo.name
        const interval = tvResolutionToHLInterval(subscriptionItem.resolution)
        sendUnsubscription(coin, interval)
      }
      return
    }
  })

  if (subscriptionKeyToDelete) {
    console.log(`[HL stream] Deleting empty subscription ${subscriptionKeyToDelete}`)
    channelToSubscription.delete(subscriptionKeyToDelete)
  }

  if (channelToSubscription.size === 0) {
    console.log('[HL WebSocket] No active subscriptions left. Disconnecting WebSocket.')
    stopConnectionCheck()
    webSocketInstance?.close()
    webSocketInstance = null
  }
}

// Helper function moved from datafeed.ts to avoid circular dependency if needed elsewhere
// Or potentially keep it in datafeed and import here if preferred.
function tvResolutionToHLInterval(resolution: ResolutionString): string {
  if (resolution === '1D' || resolution === 'D' || resolution === '1440') return '1d'
  if (resolution.includes('W') || resolution.includes('M')) return '1d'
  const minutes = parseInt(resolution, 10)
  if (isNaN(minutes)) return '15m'
  if (minutes >= 60) {
    const hours = minutes / 60
    return `${hours}h`
  }
  return `${minutes}m`
}
