import { TOKEN_TRADE_GNS } from 'utils/config/tokenTradeGns'

import { DatafeedConfiguration, IBasicDataFeed, ResolutionString } from '../../../../public/static/charting_library'
import { subscribeOnStream, unsubscribeFromStream } from './streaming'

const API_GAINS_ENDPOINT = 'https://backend-pricing.eu.gains.trade'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

const SUPPORT_RESOLUTIONS = [
  '1',
  '3',
  '5',
  '10',
  '15',
  // '30',
  // '45',
  '60',
  // '120',
  // '180',
  '240',
  '1440',
] as ResolutionString[]

export const datafeed: IBasicDataFeed = {
  onReady: (callback) => {
    callback({
      supported_resolutions: SUPPORT_RESOLUTIONS,
      supports_group_request: false,
      supports_marks: false,
      supports_search: false,
      supports_timescale_marks: false,
    } as DatafeedConfiguration)
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    // @ts-ignore
    onResultReadyCallback([
      {
        symbol: userInput,
        ticker: userInput,
        full_name: userInput,
        description: `${userInput}USD`,
        exchange: 'COPIN',
        type: 'futures',
      },
    ])
  },
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log('[resolveSymbol]: Method call', symbolName)
    onSymbolResolvedCallback({
      name: symbolName,
      description: `${symbolName}USD`,
      session: '24x7',
      ticker: symbolName,
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      daily_multipliers: ['1'],
      weekly_multipliers: ['1'],
      monthly_multipliers: ['1'],
      timezone: 'Etc/UTC',
      minmov: 1,
      pricescale: 10 ** 8,
      supported_resolutions: SUPPORT_RESOLUTIONS,
      exchange: 'COPIN',
      listed_exchange: 'COPIN',
      type: 'futures',
      format: 'price',
    })
  },
  getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, firstDataRequest } = periodParams
    const symbol = symbolInfo.ticker ?? 'BTC'
    const pairIndex = getIndexBySymbol(symbol)
    fetch(`${API_GAINS_ENDPOINT}/charts/${pairIndex}/${from}/${to}/${resolution}`).then((response) => {
      response
        .json()
        .then((data) => {
          if (data.table.length === 0) {
            onHistoryCallback([], { noData: true })
            return
          }
          const bars = []
          for (let i = 0; i < data.table.length; ++i) {
            bars.push({
              time: data.table[i].time,
              low: data.table[i].low,
              high: data.table[i].high,
              open: data.table[i].open,
              close: data.table[i].close,
            })
          }
          if (firstDataRequest) {
            lastBarsCache.set(symbolInfo.ticker, {
              ...bars[bars.length - 1],
            })
          }
          onHistoryCallback(bars, { noData: false })
        })
        .catch((error) => {
          console.log('[getBars]: Get error', error)
          onErrorCallback(error)
        })
    })
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID, symbolInfo)
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.ticker)
    )
  },
  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
    unsubscribeFromStream(subscriberUID)
  },
}

export default datafeed

export const getIndexBySymbol = (symbol: string): number | undefined => {
  for (const [key, value] of Object.entries(TOKEN_TRADE_GNS)) {
    if (value.symbol === symbol) {
      return Number(key.slice(4))
    }
  }
  return 0
}
