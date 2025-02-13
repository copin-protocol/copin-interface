import React, { useMemo } from 'react'

import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Box } from 'theme/base'
import { getSymbolTradingView } from 'utils/config/trades'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { ChartingLibraryWidgetOptions, ResolutionString } from '../../../../public/static/charting_library'
import datafeed from '../ChartTraderPositionProfitRealtime/datafeed'
import { DEFAULT_CHART_REALTIME_PROPS } from '../configs'
import { useChart } from './useChart'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position: PositionData
  orders?: HlOrderData[]
}
function HLRealtimeChart({ position, orders }: Props) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: position.protocol })
  const [chartContainer, setChartContainer] = React.useState<HTMLDivElement | null>(null)
  const symbol = position.pair
    ? getSymbolFromPair(position.pair)
    : getSymbolByIndexToken?.({ protocol: position.protocol, indexToken: position.indexToken }) ?? ''
  const decimals = useMemo(() => ((prices?.[symbol] ?? 0) < 1 ? 6 : 4), [symbol, prices])

  const chartOpts = React.useMemo(() => {
    return {
      ...DEFAULT_CHART_REALTIME_PROPS,
      datafeed,
      container: chartContainer,
      interval: '5' as ResolutionString,
      symbol: symbol ? `${getSymbolTradingView(symbol)}USD` : undefined,
      custom_formatters: {
        priceFormatterFactory: (symbol, minTick) => {
          return {
            format: (price, signPositive) => price.toFixed(decimals),
          }
        },
      },
    } as ChartingLibraryWidgetOptions
  }, [chartContainer, decimals, symbol])

  const chart = useChart(chartOpts)

  usePlotPositionInformation({
    chart,
    position,
  })

  usePlotOrderMarker({
    chart,
    orders,
  })

  return (
    <Box height="45svh">
      <div ref={setChartContainer} id="tv_chart_container" style={{ height: '100%' }} />
    </Box>
  )
}

export default HLRealtimeChart
