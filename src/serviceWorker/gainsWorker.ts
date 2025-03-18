import { MarketsData } from 'entities/markets'
import { ProtocolEnum } from 'utils/config/enums'
import { UsdPrices } from 'utils/types'

import { MessageUpdateHandler } from './types'

const GAINS_TRADE_PRICE_FEED_URL = 'wss://backend-pricing.eu.gains.trade'

const INTERVAL_TIME = 1_500 // 1s

export class GainsServiceWorker {
  private symbolByIndexTokenMapping: Record<string, string> = {}
  private onPriceUpdate: MessageUpdateHandler
  private updatedPricesData: UsdPrices = {}

  constructor(marketsData: MarketsData, onPriceUpdate: MessageUpdateHandler) {
    this.symbolByIndexTokenMapping = this.getSymbolByIndexTokenMapping(marketsData)
    this.onPriceUpdate = onPriceUpdate
    this.initPriceFeeds()
    this.iniWebsocket()
  }

  private async iniWebsocket() {
    const ws = new WebSocket(GAINS_TRADE_PRICE_FEED_URL)
    ws.onopen = () => console.log('gTrade price feed connection opened.')
    ws.onclose = () => console.log('gTrade price feed connection closed.')
    ws.onmessage = (event: WebSocketEventMap['message']) => {
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
  private syncPrice() {
    setInterval(() => {
      this.onPriceUpdate({ type: 'gains_price', data: this.updatedPricesData })
    }, INTERVAL_TIME)
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
