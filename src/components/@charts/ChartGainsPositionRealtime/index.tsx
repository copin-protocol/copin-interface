import dayjs from 'dayjs'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { CopyOrderData } from 'entities/copyTrade'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { OnchainPositionData } from 'pages/MyProfile/OpeningPositions/schema'
import { Box } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { getTimeframeFromTimeRange } from 'utils/helpers/transform'

import { ChartingLibraryWidgetOptions, ResolutionString } from '../../../../public/static/charting_library'
import { DEFAULT_CHART_REALTIME_PROPS } from '../configs'
import { datafeedFactory } from './datafeed'
import { initWebsocket } from './streaming'
import { useChart } from './useChart'
import { usePlotOrderMarker } from './usePlotOrderMarker'
import { usePlotPositionInformation } from './usePlotPositionInformation'

interface Props {
  position?: OnchainPositionData
  orders?: CopyOrderData[]
}
function ChartGainsPositionRealtime({ position, orders }: Props) {
  const { getSymbolByIndexToken, getSymbolByIndexTokenMapping } = useMarketsConfig()
  const initiated = useRef(false)
  useEffect(() => {
    if (!getSymbolByIndexTokenMapping || initiated.current) return
    const symbolByIndexToken = getSymbolByIndexTokenMapping({ protocol: ProtocolEnum.GNS })
    if (!symbolByIndexToken) return
    initWebsocket({ symbolByIndexToken })
  }, [getSymbolByIndexTokenMapping])
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null)
  const symbol = getSymbolByIndexToken({ protocol: position?.protocol, indexToken: position?.indexToken }) ?? 'BTC'
  const openBlockTime = useMemo(() => (position ? dayjs(position.createdAt).utc().valueOf() : 0), [position])
  const closeBlockTime = useMemo(() => (position ? dayjs(position.lastOrderAt).utc().valueOf() : 0), [position])
  const isOpening = position?.status === PositionStatusEnum.OPEN
  const from = openBlockTime
  const to = useMemo(() => (isOpening ? dayjs().utc().valueOf() : closeBlockTime), [closeBlockTime, isOpening])
  const timeframe = useMemo(() => getTimeframeFromTimeRange(from, to), [from, to])
  const durationInSecond = (to - from) / 1000
  const decimals = 4

  const chartOpts = React.useMemo(() => {
    return {
      ...DEFAULT_CHART_REALTIME_PROPS,
      // datafeedFactory(position.indexToken),
      datafeed: datafeedFactory(position?.indexToken),
      container: chartContainer,
      symbol: symbol ? `${symbol}` : undefined,
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
  }, [chartContainer, durationInSecond, symbol, timeframe])

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
    <Box height={350}>
      <div ref={setChartContainer} id="tv_chart_container" style={{ height: '100%' }} />
    </Box>
  )
}

export default ChartGainsPositionRealtime
