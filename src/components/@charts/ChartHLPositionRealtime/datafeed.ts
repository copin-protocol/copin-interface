import {
  Bar,
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  Timezone,
} from '../../../../public/static/charting_library'
import { subscribeOnStream, unsubscribeFromStream } from './streaming'

const API_HL_ENDPOINT = 'https://api-ui.hyperliquid.xyz/info'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map<string, Bar>()

// Supported resolutions for Hyperliquid (adjust as needed based on API)
const SUPPORTED_RESOLUTIONS = ['1', '5', '15', '30', '60', '240', '1440'] as ResolutionString[]

const configurationData: DatafeedConfiguration = {
  supported_resolutions: SUPPORTED_RESOLUTIONS,
  supports_marks: false,
  supports_timescale_marks: false,
  exchanges: [],
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
}

// Map TradingView resolution to Hyperliquid interval
function tvResolutionToHLInterval(resolution: ResolutionString): string {
  if (resolution === '1D' || resolution === 'D' || resolution === '1440') return '1d'
  if (resolution.includes('W') || resolution.includes('M')) return '1d' // Assuming 1d is max
  const minutes = parseInt(resolution, 10)
  if (isNaN(minutes)) return '15m' // Default fallback
  if (minutes >= 60) {
    const hours = minutes / 60
    return `${hours}h`
  }
  return `${minutes}m`
}

// Map Hyperliquid interval to TradingView resolution (for streaming check)
export function hlIntervalToTvResolution(interval: string): ResolutionString | undefined {
  if (interval === '1d') return '1440' as ResolutionString // Or 'D' depending on preference
  if (interval.endsWith('h')) {
    const hours = parseInt(interval.replace('h', ''), 10)
    if (!isNaN(hours)) return (hours * 60).toString() as ResolutionString
  }
  if (interval.endsWith('m')) {
    const minutes = parseInt(interval.replace('m', ''), 10)
    if (!isNaN(minutes)) return minutes.toString() as ResolutionString
  }
  return undefined // Fallback if interval format is unknown
}

export const datafeedFactory = (): IBasicDataFeed => {
  return {
    onReady: (callback: OnReadyCallback) => {
      console.log('[HL datafeed onReady]')
      setTimeout(() => callback(configurationData), 0)
    },

    searchSymbols: (
      userInput: string,
      exchange: string,
      symbolType: string,
      onResultReadyCallback: SearchSymbolsCallback
    ) => {
      console.log('[HL searchSymbols]: Method call - Not implemented for HL')
      onResultReadyCallback([])
    },

    resolveSymbol: (
      symbolName: string,
      onSymbolResolvedCallback: ResolveCallback,
      onResolveErrorCallback: ErrorCallback
    ) => {
      console.log('[HL resolveSymbol]: Method call', symbolName)

      if (!symbolName) {
        console.error('[HL resolveSymbol]: Invalid symbol name provided')
        onResolveErrorCallback('Invalid symbol name')
        return
      }

      const symbolInfo: LibrarySymbolInfo = {
        ticker: symbolName,
        name: symbolName,
        description: `${symbolName}/USD`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC' as Timezone,
        exchange: 'Hyperliquid',
        listed_exchange: 'Hyperliquid',
        minmov: 1,
        pricescale: 10000,
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: false,
        supported_resolutions: SUPPORTED_RESOLUTIONS,
        volume_precision: 2,
        data_status: 'streaming',
        format: 'price',
      }

      setTimeout(() => {
        console.log('[HL resolveSymbol]: Symbol resolved', symbolName)
        onSymbolResolvedCallback(symbolInfo)
      }, 0)
    },

    getBars: async (
      symbolInfo: LibrarySymbolInfo,
      resolution: ResolutionString,
      periodParams: PeriodParams,
      onHistoryCallback: HistoryCallback,
      onErrorCallback: ErrorCallback
    ) => {
      const { from, to, firstDataRequest } = periodParams
      const interval = tvResolutionToHLInterval(resolution)
      const coin = symbolInfo.name

      if (!coin) {
        onErrorCallback('Invalid symbol name in getBars')
        return
      }

      console.log(
        `[HL getBars]: Requesting ${interval} bars for ${coin} from ${new Date(from * 1000)} to ${new Date(to * 1000)}`
      )

      const requestBody = {
        type: 'candleSnapshot',
        req: {
          coin,
          interval,
          startTime: from * 1000,
          endTime: to * 1000,
        },
      }

      try {
        const response = await fetch(API_HL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          onErrorCallback(`Failed to fetch bars: ${response.statusText}`)
          return
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          console.warn('[HL getBars]: Unexpected format received (not an array)', data)
          onHistoryCallback([], { noData: true })
          return
        }
        if (data.length === 0 || !data[0] || typeof data[0].t === 'undefined') {
          console.warn('[HL getBars]: No data or unexpected candle format received', data)
          onHistoryCallback([], { noData: true })
          return
        }

        const bars: Bar[] = data.map((bar: any) => ({
          time: bar.t,
          open: parseFloat(bar.o),
          high: parseFloat(bar.h),
          low: parseFloat(bar.l),
          close: parseFloat(bar.c),
          volume: parseFloat(bar.v),
        }))

        const ticker = symbolInfo.ticker
        if (firstDataRequest && bars.length > 0 && ticker) {
          const lastBar = bars[bars.length - 1]
          lastBarsCache.set(ticker, lastBar)
          console.log('[HL getBars]: Set lastBarCache for', ticker, lastBar)
        }

        console.log(`[HL getBars]: Received ${bars.length} bars for ${coin}`)
        onHistoryCallback(bars, { noData: false })
      } catch (error) {
        console.error('[HL getBars]: Error fetching history for', coin, error)
        onErrorCallback('Failed to fetch history')
      }
    },

    subscribeBars: (
      symbolInfo: LibrarySymbolInfo,
      resolution: ResolutionString,
      onRealtimeCallback: SubscribeBarsCallback,
      subscriberUID: string,
      onResetCacheNeededCallback: () => void
    ) => {
      const ticker = symbolInfo.ticker
      if (!ticker) {
        console.error('[HL subscribeBars]: Cannot subscribe without a ticker', symbolInfo)
        return
      }
      console.log(`[HL subscribeBars]: UID ${subscriberUID} Subscribing to ${ticker} ${resolution}`)
      const lastBar = lastBarsCache.get(ticker)
      subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, lastBar)
    },

    unsubscribeBars: (subscriberUID: string) => {
      console.log(`[HL unsubscribeBars]: UID ${subscriberUID} Unsubscribing`)
      unsubscribeFromStream(subscriberUID)
    },
  }
}

export default datafeedFactory()
