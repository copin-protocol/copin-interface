import dayjs from 'dayjs'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { datafeedFactory as gainsDatafeedFactory } from 'components/@charts/ChartGainsPositionRealtime/datafeed'
import { datafeedFactory as hyperliquidDatafeedFactory } from 'components/@charts/ChartHLPositionRealtime/datafeed'
import { DEFAULT_CHART_REALTIME_PROPS } from 'components/@charts/configs'
import { CopyOrderData, CopyPositionData } from 'entities/copyTrade'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Box } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { getSymbolTradingView } from 'utils/config/trades'
import { getSymbolFromPair, getTimeframeFromTimeRange } from 'utils/helpers/transform'

import { ChartingLibraryWidgetOptions, ResolutionString } from '../../../../public/static/charting_library'
import { initWebsocket } from '../ChartGainsPositionRealtime/streaming'
import datafeed from './datafeed'
import { useChart } from './useChart'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position: CopyPositionData
  orders: CopyOrderData[]
}
function CopyRealtimeChart({ position, orders }: Props) {
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null)
  const { getSymbolByIndexToken, getSymbolByIndexTokenMapping } = useMarketsConfig()
  const symbol = position.pair
    ? getSymbolFromPair(position.pair)
    : getSymbolByIndexToken?.({ protocol: position.protocol, indexToken: position.indexToken }) ?? ''
  const openBlockTime = useMemo(() => (position ? dayjs(position.createdAt).utc().valueOf() : 0), [position])
  const closeBlockTime = useMemo(() => (position ? dayjs(position.lastOrderAt).utc().valueOf() : 0), [position])
  const isOpening = position?.status === PositionStatusEnum.OPEN
  const from = openBlockTime
  const to = useMemo(() => (isOpening ? dayjs().utc().valueOf() : closeBlockTime), [closeBlockTime, isOpening])
  const timeframe = useMemo(() => getTimeframeFromTimeRange(from, to), [from, to])
  const durationInSecond = (to - from) / 1000
  const decimals = 4
  const {
    isGains,
    isHyperliquid,
    symbol: symbolTradingView,
  } = getSymbolTradingView({ protocol: position.protocol, exchange: position.exchange, symbol })

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
      symbol: symbolTradingView,
      interval: (durationInSecond < 1800 ? '1' : timeframe.toString()) as ResolutionString,
      custom_formatters: {
        priceFormatterFactory: (symbol, minTick) => {
          return {
            format: (price, signPositive) => price.toFixed(decimals),
          }
        },
      },
      overrides: {},
    } as ChartingLibraryWidgetOptions
  }, [
    chartContainer,
    durationInSecond,
    isGains,
    isHyperliquid,
    position?.indexToken,
    position?.protocol,
    symbolTradingView,
    timeframe,
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

  usePlotPositionInformation({
    chart,
    position,
    orders,
  })

  usePlotOrderMarker({
    chart,
    position,
    orders,
  })

  return (
    <Box height={400}>
      <div ref={setChartContainer} id="tv_chart_container" style={{ height: '100%' }} />
    </Box>
  )
}

export default CopyRealtimeChart
