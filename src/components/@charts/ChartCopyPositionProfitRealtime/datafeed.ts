import { BUILD_MODE } from 'utils/config/constants'

import { DatafeedConfiguration, IBasicDataFeed } from '../../../../public/static/charting_library'
import { subscribeOnStream, unsubscribeFromStream } from './streaming'

const __log__ = (...args: any[]) => {
  if (BUILD_MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const configurationData: DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  // @ts-ignore
  supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', 'D'],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [
    // { value: "Binance", name: "Binance", desc: "Binance" },
    // { value: "bybit", name: "Bybit", desc: "Bybit" },
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }],
  supports_marks: true,
}

export const _datafeed: IBasicDataFeed = {
  onReady: (callback) => {
    __log__('[onReady]: Method call')
    setTimeout(() => callback(configurationData))
  },
  searchSymbols: async (userInput, exchange, _symbolType, onResultReadyCallback) => {
    __log__('[searchSymbols]: Method call')
    // leave this here in case we ever need it, its helpful code

    // const symbols = await getAllSymbols();
    // const newSymbols = symbols.filter((symbol) => {
    //   const isExchangeValid = exchange === "" || symbol.exchange === exchange;
    //   const isFullSymbolContainsInput =
    //     symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
    //   return isExchangeValid && isFullSymbolContainsInput;
    // });
    onResultReadyCallback([])
  },
  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (a: any) => void,
    _onResolveErrorCallback: (a: any) => void,
    _extension: any
  ) => {
    __log__('[resolveSymbol]: Method call', symbolName)

    const information = {
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
    }

    if (!information) {
      _onResolveErrorCallback('No symbol found')
      return
    }

    const symbol = symbolName.split('-')[0]
    let pricescale = 100
    if (symbol) {
      const precision = 2
      pricescale = 10 ** precision
    }

    if (!information?.baseAsset) {
      return
    }

    // Symbol information object
    const symbolInfo = {
      originalBaseAsset: symbolName,
      name: `${information.baseAsset}`,
      ticker: `${information.baseAsset}${information.quoteAsset}`,
      session: '24x7',
      timezone,
      exchange: '',
      minmov: 1,
      pricescale,
      has_intraday: true,
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
      symbolInformation: information,
    }

    __log__('[resolveSymbol]: Symbol resolved', symbolName)
    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo)
    }, 0)
  },
  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, _onErrorCallback) => {
    // const bars = await getBars(symbolInfo, resolution, periodParams);
    const bars = [] as any[]
    if (!bars.length) {
      onHistoryCallback(bars, { noData: true })
      return
    }
    onHistoryCallback(bars, { noData: false })
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
    __log__('[subscribeBars]: Method call with subscriberUID:', subscriberUID)
  },
  unsubscribeBars: (subscriberUID: string) => {
    __log__('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
  },
}

const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview'

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map()

export const datafeed: IBasicDataFeed = {
  onReady: (callback) => {
    fetch(`${API_ENDPOINT}/config`).then((response) => {
      response.json().then((configurationData) => {
        setTimeout(() => callback(configurationData))
      })
    })
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    const _symbol = symbolName === 'ETHBTC' ? symbolName : `${symbolName}USD`
    fetch(`${API_ENDPOINT}/symbols?symbol=${_symbol}&type=crypto`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          onSymbolResolvedCallback(symbolInfo)
        })
        .catch((error) => {
          console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
          onResolveErrorCallback('Cannot resolve symbol')
          return
        })
    })
  },
  getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, firstDataRequest } = periodParams
    fetch(
      `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${periodParams.from}&to=${periodParams.to}&resolution=${resolution}`
    ).then((response) => {
      response
        .json()
        .then((data) => {
          if (data.t.length === 0) {
            onHistoryCallback([], { noData: true })
            return
          }
          const bars = []
          for (let i = 0; i < data.t.length; ++i) {
            bars.push({
              time: data.t[i] * 1000,
              low: data.l[i],
              high: data.h[i],
              open: data.o[i],
              close: data.c[i],
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
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID)
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
