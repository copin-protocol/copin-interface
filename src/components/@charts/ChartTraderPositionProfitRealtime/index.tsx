import React, { useEffect, useMemo, useRef } from 'react'

import { datafeedFactory as gainsDatafeedFactory } from 'components/@charts/ChartGainsPositionRealtime/datafeed'
import { initWebsocket } from 'components/@charts/ChartGainsPositionRealtime/streaming'
import { datafeedFactory as hyperliquidDatafeedFactory } from 'components/@charts/ChartHLPositionRealtime/datafeed'
import { DEFAULT_CHART_REALTIME_PROPS } from 'components/@charts/configs'
import { OrderData, PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Box } from 'theme/base'
import { GAINS_TRADE_PROTOCOLS, GMX_V1_PROTOCOLS } from 'utils/config/constants'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { getSymbolTradingView } from 'utils/config/trades'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { ChartingLibraryWidgetOptions, ResolutionString } from '../../../../public/static/charting_library'
import datafeed from './datafeed'
import { useChart } from './useChart'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position: PositionData
  orders: OrderData[]
}
function RealtimeChart({ position, orders }: Props) {
  const { getSymbolByIndexToken, getSymbolByIndexTokenMapping } = useMarketsConfig()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: position.protocol })
  const [chartContainer, setChartContainer] = React.useState<HTMLDivElement | null>(null)
  const symbol = position.pair
    ? getSymbolFromPair(position.pair)
    : getSymbolByIndexToken?.({ protocol: position.protocol, indexToken: position.indexToken }) ?? ''
  const decimals = useMemo(() => ((prices?.[symbol] ?? 0) < 1 ? 6 : 4), [symbol, prices])
  const {
    isGains,
    isHyperliquid,
    symbol: symbolTradingView,
  } = getSymbolTradingView({ protocol: position?.protocol, symbol })

  const initiated = useRef(false)
  useEffect(() => {
    if (!isGains || !getSymbolByIndexTokenMapping || initiated.current) return
    const symbolByIndexToken = getSymbolByIndexTokenMapping({ protocol: ProtocolEnum.GNS })
    if (!symbolByIndexToken) return
    initWebsocket({ symbolByIndexToken })
  }, [getSymbolByIndexTokenMapping, isGains])

  const chartOpts = React.useMemo(() => {
    return {
      ...DEFAULT_CHART_REALTIME_PROPS,
      datafeed: position?.protocol
        ? isHyperliquid
          ? hyperliquidDatafeedFactory()
          : isGains
          ? gainsDatafeedFactory(position?.indexToken)
          : datafeed
        : datafeed,
      container: chartContainer,
      interval: (position.durationInSecond < 1800 ? '1' : '5') as ResolutionString,
      symbol: symbolTradingView,
      custom_formatters: {
        priceFormatterFactory: (symbol, minTick) => {
          return {
            format: (price, signPositive) => price.toFixed(decimals),
          }
        },
      },
    } as ChartingLibraryWidgetOptions
  }, [
    position?.protocol,
    position?.indexToken,
    position.durationInSecond,
    isHyperliquid,
    isGains,
    chartContainer,
    symbolTradingView,
    decimals,
  ])

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
      (!GMX_V1_PROTOCOLS.includes(position?.protocol) && e.type === OrderTypeEnum.CLOSE) ||
      e.type === OrderTypeEnum.LIQUIDATE
  )
  // const modifiedMarginList = orders?.filter((e) => e.type === OrderTypeEnum.MARGIN_TRANSFERRED)

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
  // useModifyMarginMarker({
  //   chart,
  //   orders: modifiedMarginList,
  // })

  return (
    <Box height="45svh">
      <div ref={setChartContainer} id="tv_chart_container" style={{ height: '100%' }} />
    </Box>
  )
}

export default RealtimeChart
