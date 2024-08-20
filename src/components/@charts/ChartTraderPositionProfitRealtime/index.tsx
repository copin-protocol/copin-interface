import React, { useMemo } from 'react'

import { OrderData, PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box } from 'theme/base'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { getSymbolTradingView, getTokenTradeSupport } from 'utils/config/trades'

import { ChartingLibraryWidgetOptions } from '../../../../public/static/charting_library'
import { DEFAULT_CHART_REALTIME_PROPS } from '../configs'
import datafeed from './datafeed'
import { useChart } from './useChart'
import { useModifyMarginMarker } from './useModifyMarginMarker'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position: PositionData
  orders: OrderData[]
}
function RealtimeChart({ position, orders }: Props) {
  const { prices } = useGetUsdPrices()
  const [chartContainer, setChartContainer] = React.useState<HTMLDivElement | null>(null)
  const tokensSupport = getTokenTradeSupport(position.protocol)
  const symbol = tokensSupport[position.indexToken]?.symbol ?? ''
  const decimals = useMemo(() => ((prices?.[position.indexToken] ?? 0) < 1 ? 6 : 4), [position.indexToken, prices])

  const chartOpts = React.useMemo(() => {
    return {
      ...DEFAULT_CHART_REALTIME_PROPS,
      datafeed,
      container: chartContainer,
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

  // const pos = positions.find((x) => x.ticker === symbol)
  // const pnl = +formatNumber(pos?.pnl || 0)
  //
  // const entry = pos?.entry ? +pos.entry.toFixed(decimals) : undefined

  // const _positionInfo = pos
  //   ? {
  //       direction: pos.direction,
  //       openedAt: pos.openedAt,
  //       entry,
  //       pnl,
  //       stop,
  //       takeProfit,
  //       size: +pos.size,
  //       symbol: pos.ticker,
  //     }
  //   : undefined

  // const positionInfo = React.useMemo(() => {
  //   return _positionInfo
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [JSON.stringify(_positionInfo)])
  //

  const increaseList = orders?.filter((e) => e.type === OrderTypeEnum.INCREASE || e.type === OrderTypeEnum.OPEN)
  const decreaseList = orders?.filter(
    (e) =>
      e.type === OrderTypeEnum.DECREASE ||
      (position?.protocol !== ProtocolEnum.GMX && e.type === OrderTypeEnum.CLOSE) ||
      e.type === OrderTypeEnum.LIQUIDATE
  )
  const modifiedMarginList = orders?.filter((e) => e.type === OrderTypeEnum.MARGIN_TRANSFERRED)

  usePlotPositionInformation({
    chart,
    position,
  })

  usePlotOrderMarker({
    chart,
    orders: increaseList,
  })
  usePlotOrderMarker({
    chart,
    orders: decreaseList,
  })
  useModifyMarginMarker({
    chart,
    orders: modifiedMarginList,
  })

  return (
    <Box height="45svh">
      <div ref={setChartContainer} id="tv_chart_container" style={{ height: '100%' }} />
    </Box>
  )
}

export default RealtimeChart
