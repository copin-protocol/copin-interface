import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_GNS } from 'utils/config/tokenTradeGns'

import {
  Bar,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from '../../../../public/static/charting_library'

type SubscriptionItem = {
  subscriberUID: string
  resolution: string
  lastDailyBar: Bar
  handlers: {
    id: string
    callback: (bar: Bar) => void
  }[]
}

const channelToSubscription = new Map<string, SubscriptionItem>()

class WebSocketSingleton {
  private static instance: WebSocketSingleton
  private socket: WebSocket

  private constructor(url: string) {
    this.socket = new WebSocket(url)

    this.socket.addEventListener('open', () => {
      console.log('[socket] Connected')
    })

    this.socket.addEventListener('close', (reason) => {
      console.log('[socket] Disconnected:', reason)
    })

    this.socket.addEventListener('error', (error) => {
      console.log('[socket] Error:', error)
    })

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      const parsedData = processPriceData(data)
      handleStreamingDataWs(parsedData)
    })
  }

  public static getInstance(url: string): WebSocketSingleton {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocketSingleton(url)
    }
    return WebSocketSingleton.instance
  }

  public getSocket(): WebSocket {
    return this.socket
  }
}

const streamingUrl = 'wss://backend-pricing.eu.gains.trade'
const webSocketInstance = WebSocketSingleton.getInstance(streamingUrl)
const socket = webSocketInstance.getSocket()

function handleStreamingDataWs(data: Record<string, number>) {
  Object.entries(data).forEach(([symbol, price]) => {
    const tradePrice = price
    const tradeTime = new Date().getTime()

    const channelString = symbol
    const subscriptionItem = channelToSubscription.get(channelString)

    if (!subscriptionItem) {
      return
    }

    const lastDailyBar = subscriptionItem.lastDailyBar
    const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time)

    let bar: Bar
    if (tradeTime >= nextDailyBarTime) {
      bar = {
        time: nextDailyBarTime,
        open: tradePrice,
        high: tradePrice,
        low: tradePrice,
        close: tradePrice,
      }
    } else {
      bar = {
        ...lastDailyBar,
        high: Math.max(lastDailyBar.high, tradePrice),
        low: Math.min(lastDailyBar.low, tradePrice),
        close: tradePrice,
      }
    }

    subscriptionItem.lastDailyBar = bar

    // Send data to every subscriber of that symbol
    subscriptionItem.handlers.forEach((handler) => handler.callback(bar))
    channelToSubscription.set(channelString, subscriptionItem)
  })
}

function getNextDailyBarTime(barTime: number) {
  const date = new Date(barTime * 1000)
  date.setDate(date.getDate() + 1)
  return date.getTime() / 1000
}

// symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void
export function subscribeOnStream(
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onRealtimeCallback: SubscribeBarsCallback,
  subscriberUID: string,
  onResetCacheNeededCallback: () => void,
  lastDailyBar: Bar
) {
  const channelString = symbolInfo.ticker
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  }
  if (!channelString) {
    return
  }
  let subscriptionItem = channelToSubscription.get(channelString)
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  }
  channelToSubscription.set(channelString, subscriptionItem)
  console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString)
}

export function unsubscribeFromStream(subscriberUID: string) {
  // Find a subscription with id === subscriberUID
  // @ts-ignore
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem?.handlers.findIndex((handler) => handler.id === subscriberUID)

    if (handlerIndex !== -1) {
      // Unsubscribe from the channel if it is the last handler
      console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString)
      channelToSubscription.delete(channelString)
      break
    }
  }
}

function processPriceData(data: number[]): Record<string, number> {
  if (!data || data.length < 2) return {}
  const result: Record<string, number> = {}
  for (let i = 0; i < data.length; i += 2) {
    const pairIndex = data[i]
    const price = data[i + 1]
    const symbol = TOKEN_TRADE_GNS[`${ProtocolEnum.GNS}-${pairIndex}`]?.symbol
    if (symbol) {
      result[symbol] = price
    }
  }
  return result
}
