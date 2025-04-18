import React, { useEffect, useMemo } from 'react'

import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Box } from 'theme/base'
import { getSymbolFromPair } from 'utils/helpers/transform'

import {
  ChartingLibraryWidgetOptions,
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
} from '../../../../public/static/charting_library'
import { DEFAULT_CHART_REALTIME_PROPS } from '../configs'
import { datafeedFactory } from './datafeed'
import { initWebSocket } from './streaming'
import { useChart } from './useChart'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position: PositionData
  orders?: HlOrderData[]
}

// Create a minimal default datafeed to satisfy initial options
const defaultDatafeed: IBasicDataFeed = {
  onReady: (cb: OnReadyCallback) => {
    setTimeout(() => cb({ supported_resolutions: [] }), 0)
  },
  resolveSymbol: (symbolName: string, onSymbolResolvedCallback: ResolveCallback) => {
    setTimeout(() => onSymbolResolvedCallback({} as LibrarySymbolInfo), 0)
  },
  getBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    setTimeout(() => onResult([], { noData: true }), 0)
  },
  searchSymbols: (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: SearchSymbolsCallback
  ) => {
    onResultReadyCallback([])
  },
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string
  ) => {
    // Empty implementation for default
  },
  unsubscribeBars: (listenerGuid: string) => {
    // Empty implementation for default
  },
}

function HLRealtimeChart({ position, orders }: Props) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  const { getPricesData } = useGetUsdPrices()

  // Initialize WebSocket connection
  useEffect(() => {
    initWebSocket()
  }, [])

  const prices = getPricesData({ protocol: position.protocol })
  const [chartContainer, setChartContainer] = React.useState<HTMLDivElement | null>(null)

  // Symbol should be the base asset (e.g., BTC, ETH)
  const symbol = position.pair
    ? getSymbolFromPair(position.pair)
    : getSymbolByIndexToken?.({ protocol: position.protocol, indexToken: position.indexToken }) ?? ''

  const decimals = useMemo(() => ((prices?.[symbol] ?? 0) < 1 ? 6 : 4), [symbol, prices])

  const chartOpts = React.useMemo((): ChartingLibraryWidgetOptions => {
    // Return defaults if required info is missing
    const containerId = 'tv_chart_container_hl'
    if (!symbol || !chartContainer) {
      return {
        ...DEFAULT_CHART_REALTIME_PROPS,
        container: containerId,
        interval: '5' as ResolutionString,
        symbol: symbol ?? 'DEFAULT',
        datafeed: defaultDatafeed,
        disabled_features: ['header_widget'], // Disable features until ready
        custom_formatters: {
          priceFormatterFactory: (symbolInfo, minTick) => ({
            format: (price) => price.toFixed(decimals),
          }),
        },
      } as ChartingLibraryWidgetOptions
    }

    // Return full options when ready
    return {
      ...DEFAULT_CHART_REALTIME_PROPS,
      datafeed: datafeedFactory(),
      container: chartContainer,
      interval: '5' as ResolutionString,
      symbol,
      custom_formatters: {
        priceFormatterFactory: (symbolInfo, minTick) => ({
          format: (price) => price.toFixed(decimals),
        }),
      },
    } as ChartingLibraryWidgetOptions
  }, [chartContainer, decimals, symbol])

  // Always call useChart
  const chartWidget = useChart(chartOpts)

  // The plotting hooks already check if chart is ready
  usePlotPositionInformation({
    chart: chartWidget,
    position,
  })

  usePlotOrderMarker({
    chart: chartWidget,
    orders,
  })

  return (
    <Box height="45svh">
      {/* Use the same unique ID */}
      <div ref={setChartContainer} id="tv_chart_container_hl" style={{ height: '100%' }} />
    </Box>
  )
}

export default HLRealtimeChart
