import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import {
  CandlestickData,
  ColorType,
  CrosshairMode,
  LineData,
  LineStyle,
  PriceScaleMode,
  SeriesMarker,
  Time,
  createChart,
} from 'lightweight-charts'
import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import { PositionData, TickPosition } from 'entities/trader.d'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useSearchParams from 'hooks/router/useSearchParams'
import { useWhatIfStore } from 'hooks/store/useWhatIf'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { TIMEFRAME_NAMES, TOKEN_COLLATERAL_SUPPORT, TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcLiquidatePrice, calcOpeningPnL, calcPnL } from 'utils/helpers/calculate'
import { formatNumber, formatPrice } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { getTimeframeFromTimeRange } from 'utils/helpers/transform'

import OrderTooltip from './OrderTooltip'

const ChartProfitComponent = memo(function ChartProfitComponent({
  position,
  isOpening,
  openBlockTime,
  closeBlockTime,
  setCrossMove,
  chartId,
}: {
  position: PositionData
  isOpening: boolean
  openBlockTime: number
  closeBlockTime: number
  setCrossMove: (value?: { pnl?: number; time?: number; pnlInToken?: number }) => void
  chartId: string
}) {
  const protocol = position.protocol

  const { sm } = useResponsive()
  const CHART_HEIGHT = sm ? 250 : 150
  const { prices } = useGetUsdPrices()
  const { nextHours } = useWhatIfStore()
  const { searchParams } = useSearchParams()
  const nextHoursParam = searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
    ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
    : undefined
  const tokenSymbol = TOKEN_TRADE_SUPPORT[position.protocol][position.indexToken]?.symbol
  const from = useMemo(() => openBlockTime * 1000, [openBlockTime])
  const to = useMemo(() => (isOpening ? dayjs().utc().valueOf() : closeBlockTime * 1000), [closeBlockTime, isOpening])
  const timeframe = useMemo(() => getTimeframeFromTimeRange(from, to), [from, to])
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, tokenSymbol, from, to, timeframe, nextHours, nextHoursParam],
    () =>
      getChartDataV2({
        symbol: tokenSymbol,
        timeframe,
        from: dayjs(from).utc().subtract(timeframe, 'minutes').valueOf(),
        to: dayjs(to)
          .utc()
          .add(isOpening ? 0 : timeframe, 'minutes')
          .add(nextHoursParam ? nextHoursParam : nextHours ? nextHours : 0, 'hours')
          .valueOf(),
      }),
    {
      enabled: !!tokenSymbol && ((isOpening && openBlockTime > 0) || (!isOpening && closeBlockTime > 0)),
      retry: 0,
    }
  )

  const [markerId, setMarkerId] = useState<string | undefined>()
  const orders = position.orders
  const openOrder = orders.find((e) => e.isOpen || e.type === OrderTypeEnum.OPEN) ?? position.orders?.[0]
  const closeOrder = orders.find((e) => e.isClose) ?? orders?.[0]
  const increaseList = orders.filter((e) => e.type === OrderTypeEnum.INCREASE || e.type === OrderTypeEnum.OPEN)
  const openPrice = openOrder?.priceNumber ?? position.averagePrice
  const closePrice = closeOrder?.priceNumber ?? position.averagePrice

  // TODO: Check when add new protocol
  const decreaseList = orders.filter(
    (e) =>
      e.type === OrderTypeEnum.DECREASE ||
      (position.protocol !== ProtocolEnum.GMX && e.type === OrderTypeEnum.CLOSE) ||
      e.type === OrderTypeEnum.LIQUIDATE
  )
  const modifiedMarginList = orders.filter((e) => e.type === OrderTypeEnum.MARGIN_TRANSFERRED)

  const hasLiquidate = (position.orders.filter((e) => e.type === OrderTypeEnum.LIQUIDATE) ?? []).length > 0

  // Todo: Check when add new protocol
  const useSizeNumber = [
    ProtocolEnum.KWENTA,
    ProtocolEnum.POLYNOMIAL,
    ProtocolEnum.DEXTORO,
    ProtocolEnum.CYBERDEX,
    ProtocolEnum.COPIN,
  ].includes(protocol)
  const tickPositions = useMemo(() => {
    const positions: TickPosition[] = []
    if (!position) return []
    if (orders.length) {
      let totalTokenSize = 0
      let totalSize = 0
      let collateral = 0
      let collateralInToken = 0
      let averagePrice = 0
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].type === OrderTypeEnum.MARGIN_TRANSFERRED) {
          continue
        }
        const isDecrease =
          orders[i].type === OrderTypeEnum.DECREASE ||
          orders[i].type === OrderTypeEnum.CLOSE ||
          orders[i].type === OrderTypeEnum.LIQUIDATE
        const sign = isDecrease ? -1 : 1
        const sizeDeltaInToken = orders[i]?.sizeDeltaInTokenNumber ?? 0
        const sizeDeltaNumber =
          orders[i]?.sizeDeltaNumber ?? (sizeDeltaInToken ? sizeDeltaInToken * orders[i].priceNumber : 0)
        const sizeDelta = sign * Math.abs(sizeDeltaNumber)
        const sizeTokenDelta = sign * (sizeDeltaInToken || sizeDeltaNumber / orders[i].priceNumber)
        const collateralDeltaNumber = orders[i]?.collateralDeltaNumber ?? 0
        const collateralDeltaInTokenNumber = orders[i]?.collateralDeltaInTokenNumber ?? 0
        const collateralDelta = sign * collateralDeltaNumber
        if (!isDecrease) {
          averagePrice = (totalTokenSize * averagePrice + sizeDeltaNumber) / (totalTokenSize + sizeTokenDelta)
        }

        const pos = {
          size: totalSize + sizeDelta,
          sizeInToken: totalTokenSize + sizeTokenDelta,
          time: dayjs(orders[i].blockTime).utc().valueOf(),
          collateral: collateral + collateralDelta,
          collateralInToken: collateralInToken + collateralDeltaInTokenNumber,
          price: orders[i]?.priceNumber ?? (totalSize + sizeDelta) / (totalTokenSize + sizeTokenDelta),
          averagePrice,
        }
        positions.push(pos)
        totalSize += sizeDelta
        totalTokenSize += sizeTokenDelta
        collateral += collateralDelta
        collateralInToken += collateralDeltaInTokenNumber
      }
    }
    return positions
  }, [orders, position, useSizeNumber])
  const currentOrder = orders.find((e) => e.id === markerId)

  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])
  const chartData: LineData[] = useMemo(() => {
    if (!data) return []
    const tempData = [...data].filter((e) => e.timestamp > dayjs(openOrder?.blockTime).utc().valueOf())

    if (openOrder) {
      tempData.push({
        open: openPrice,
        close: openPrice,
        low: openPrice,
        high: openPrice,
        timestamp: dayjs(openOrder.blockTime).utc().valueOf(),
      })
    }

    if (isOpening) {
      const currentPrice = prices[position.indexToken]
      if (currentPrice) {
        tempData.push({
          open: currentPrice,
          close: currentPrice,
          low: currentPrice,
          high: currentPrice,
          timestamp: to,
        })
      }
    } else {
      const closeTimestamp = dayjs(position.closeBlockTime).utc().valueOf()
      const index = tempData.findIndex((e) => e.timestamp === closeTimestamp)
      if (index < 0) {
        tempData.push({
          open: closePrice,
          close: closePrice,
          low: closePrice,
          high: closePrice,
          timestamp: closeTimestamp,
        })
      }
    }

    const chartData = !isOpening
      ? tempData.filter((e) => e.timestamp <= dayjs(position.closeBlockTime).utc().valueOf())
      : tempData

    return (
      chartData
        .map((e, index) => {
          const marketPrice = e.close
          const tickTime = dayjs(e.timestamp).utc()
          const posIndex = tickPositions.findIndex((p: TickPosition) => p.time > e.timestamp)
          const pos = tickPositions[posIndex - 1]
          const avgPrice = pos?.averagePrice ?? position.averagePrice
          const size =
            pos?.sizeInToken != null
              ? pos.sizeInToken * avgPrice
              : position.lastSizeInToken != null
              ? position.lastSizeInToken * avgPrice
              : position.lastSize != null
              ? position.lastSize
              : position.lastSizeNumber != null
              ? position.lastSizeNumber * avgPrice
              : position.size

          const pnl = calcPnL(position.isLong, avgPrice, marketPrice, size)
          // const pnlInToken = calcPnLBySizeInToken(position.isLong, avgPrice, marketPrice, realSizeInToken)
          // const pnl = pnlInToken * pos.price
          // const value = useTokenValue
          //   ? !isOpening && index === chartData.length - 1
          //     ? position.realisedPnlInToken
          //     : pnlInToken
          const value = !isOpening && index === chartData.length - 1 ? position.pnl : pnl

          return {
            value,
            time: tickTime.unix() - timezone,
          } as LineData
        })
        .sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? []
    )
  }, [data, openOrder, orders, prices, to, nextHoursParam, nextHours])

  const chartFutureData: LineData[] = useMemo(() => {
    if (!data || isOpening || ((!nextHours || nextHours < 1) && (!nextHoursParam || nextHoursParam < 1))) return []
    const chartData = data.filter((e) => e.timestamp > to)
    chartData.push({
      open: closePrice,
      close: closePrice,
      low: closePrice,
      high: closePrice,
      timestamp: dayjs(position.closeBlockTime).utc().valueOf(),
    })

    return (
      chartData
        .sort((x, y) => (x.timestamp < y.timestamp ? -1 : x.timestamp > y.timestamp ? 1 : 0))
        .map((e, index) => {
          const marketPrice = e.close
          const pnl = calcOpeningPnL(position, marketPrice)
          return {
            value: index === 0 ? position.pnl : pnl,
            time: dayjs(e.timestamp).utc().unix() - timezone,
          } as LineData
        })
        .sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? []
    )
  }, [data, isOpening, nextHours, nextHoursParam, position, timezone, to])

  const priceData: CandlestickData[] = useMemo(() => {
    if (!data) return []
    const tempData = [...data]
    // const lastData = isOpening ? data[data.length - 1] : tempData.pop()
    if (openOrder) {
      tempData.push({
        open: openPrice,
        close: openPrice,
        low: openPrice,
        high: openPrice,
        timestamp: dayjs(openOrder.blockTime).utc().valueOf(),
      })
    }
    if (isOpening) {
      const currentPrice = prices[position.indexToken]
      if (currentPrice) {
        tempData.push({
          open: currentPrice,
          close: currentPrice,
          low: currentPrice,
          high: currentPrice,
          timestamp: to,
        })
      }
    } else {
      tempData.push({
        open: closePrice,
        close: closePrice,
        low: closePrice,
        high: closePrice,
        timestamp: dayjs(position.closeBlockTime).utc().valueOf(),
      })
    }

    return (
      tempData
        .filter((e) => e.timestamp >= dayjs(openOrder?.blockTime).utc().valueOf())
        .map((e) => {
          return {
            open: e.open,
            close: e.close,
            low: e.low,
            high: e.high,
            time: dayjs(e.timestamp).utc().unix() - timezone,
          } as CandlestickData
        })
        .sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? []
    )
  }, [data, isOpening, openOrder, prices, timezone, to])

  useEffect(() => {
    if (isOpening) return
    if (nextHours) {
      // setSearchParams({ [URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]: nextHours.toString() })
      window.history.replaceState(
        null,
        '',
        generatePositionDetailsRoute({
          ...position,
          txHash: position.txHashes?.[0],
          nextHours,
        })
      )
    }
  }, [])

  const chartContainerId = ELEMENT_IDS.POSITION_CHART_PNL + chartId
  const legendContainerId = 'legend-profit' + chartId

  useEffect(() => {
    if (isLoading || !data) return

    const container = document.getElementById(chartContainerId)
    const chart = createChart(container ? container : chartContainerId, {
      height: CHART_HEIGHT,
      rightPriceScale: {
        autoScale: true,
        visible: false,
        mode: PriceScaleMode.Normal,
      },
      leftPriceScale: {
        visible: false,
        autoScale: true,
        mode: PriceScaleMode.Normal,
      },
      handleScale: false,
      handleScroll: false,
      grid: {
        horzLines: {
          color: '#eee',
          visible: false,
        },
        vertLines: {
          color: 'transparent',
          visible: false,
        },
      },
      overlayPriceScales: {
        borderVisible: false,
      },
      layout: {
        textColor: themeColors.neutral3,
        background: { type: ColorType.Solid, color: 'transparent' },
        fontFamily: FONT_FAMILY,
        fontSize: 13,
        attributionLogo: false,
      },
      timeScale: {
        rightOffset: 0,
        secondsVisible: true,
        timeVisible: true,
        rightBarStaysOnScroll: true,
        lockVisibleTimeRangeOnResize: true,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        horzLine: {
          // visible: false,
          labelBackgroundColor: '#B1B5C3',
          // labelVisible: false,
          color: 'rgba(119, 126, 144, 0.8)',
          width: 1,
          style: LineStyle.Dotted,
        },
        vertLine: {
          color: 'rgba(119, 126, 144, 0.8)',
          labelBackgroundColor: '#353945',
          width: 1,
          style: LineStyle.Dotted,
        },
      },
    })
    chart.timeScale().fitContent()
    chart.timeScale().applyOptions({})

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // set as an overlay by setting a blank priceScaleId
      priceLineVisible: false,
      base: 0.1,
    })
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    })
    if (chartFutureData && chartFutureData.length > 0) {
      volumeSeries.setData([{ time: chartFutureData[0].time, color: 'rgba(119, 126, 144, 0.7)', value: 10000 }])
    }

    const priceSeries = chart.addCandlestickSeries({
      priceScaleId: 'right',
      upColor: themeColors.neutral4,
      downColor: 'transparent',
      borderDownColor: themeColors.neutral4,
      borderUpColor: themeColors.neutral4,
      wickDownColor: themeColors.neutral4,
      wickUpColor: themeColors.neutral4,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    priceSeries.setData(priceData)
    priceSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.03,
      },
    })

    const series = chart.addBaselineSeries({
      priceScaleId: 'left',
      topLineColor: themeColors.green1,
      bottomLineColor: themeColors.red2,
      baseValue: {
        type: 'price',
        price: 0,
      },
      baseLineStyle: LineStyle.Dashed,
      lineWidth: 2,
      baseLineColor: 'red',
      baseLineVisible: false,
      lastValueVisible: false,
      priceLineVisible: false,
      // disabling built-in price lines
    })
    series.setData(chartData)

    const futureSeries = chart.addBaselineSeries({
      priceScaleId: 'left',
      topLineColor: themeColors.neutral3,
      bottomLineColor: themeColors.neutral3,
      baseValue: {
        type: 'price',
        price: 0,
      },
      lineStyle: LineStyle.Dashed,
      lineWidth: 2,
      baseLineColor: 'red',
      baseLineVisible: true,
      lastValueVisible: false,
      priceLineVisible: false,
      // disabling built-in price lines
    })
    futureSeries.setData(chartFutureData)
    futureSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.03,
      },
    })

    const high =
      chartData[
        chartData.reduce(
          (seed, b, idx) => (b.value > chartData[seed].value ? idx : seed),
          Math.min(6, chartData.length - 1)
        )
      ]
    const low = chartData[chartData.reduce((seed, b, idx) => (b.value <= chartData[seed].value ? idx : seed), 0)]
    if (high && low && high.value > 0 && low.value < 0) {
      series.createPriceLine({
        price: 0,
        color: 'rgba(119, 126, 144, 0.25)',
        lineWidth: 1,
        lineVisible: true,
        axisLabelVisible: true,
        title: '',
        lineStyle: LineStyle.Solid,
      })
    }
    if (low && low.value < 0) {
      const liquidationPrice = calcLiquidatePrice(position)
      const posDelta = calcOpeningPnL(position, liquidationPrice)
      if (posDelta) {
        series.createPriceLine({
          price: posDelta,
          color: themeColors.red2,
          lineVisible: true,
          lineWidth: 1,
          axisLabelVisible: true,
          title: `Liquidation ${posDelta < 0 ? '-' : ''}$${formatNumber(Math.abs(posDelta), 0)}`,
          lineStyle: LineStyle.SparseDotted,
        })
      }
    }

    if (chartData.length > 0) {
      if (high && low && low.value !== high.value) {
        const increaseMarkers = increaseList.slice(1).map((order): SeriesMarker<Time> => {
          return {
            id: order.id,
            color: themeColors.neutral2,
            position: 'aboveBar',
            shape: 'arrowUp',
            time: (dayjs(order.blockTime).utc().unix() - timezone) as Time,
            text:
              '$' +
              formatNumber(
                order.sizeDeltaNumber ??
                  (order.sizeDeltaInTokenNumber ? order.sizeDeltaInTokenNumber * order.priceNumber : undefined),
                0
              ),
          }
        })
        const decreaseMarkers = (isOpening ? decreaseList : decreaseList.slice(0, -1)).map(
          (order): SeriesMarker<Time> => {
            return {
              id: order.id,
              color: themeColors.neutral2,
              position: 'belowBar',
              shape: 'arrowDown',
              time: (dayjs(order.blockTime).utc().unix() - timezone) as Time,
              text:
                '$' +
                formatNumber(
                  order.sizeDeltaNumber ??
                    (order.sizeDeltaInTokenNumber ? order.sizeDeltaInTokenNumber * order.priceNumber : undefined),
                  0
                ),
            }
          }
        )
        const modifiedMarkers = modifiedMarginList.map((order): SeriesMarker<Time> => {
          const collateral = order.collateralDeltaInTokenNumber ?? order.collateralDeltaNumber
          return {
            id: order.id,
            color: themeColors.orange1,
            position: collateral > 0 ? 'aboveBar' : 'belowBar',
            shape: 'circle',
            time: (dayjs(order.blockTime).utc().unix() - timezone) as Time,
            text:
              position.collateralToken && order.collateralDeltaInTokenNumber
                ? formatNumber(collateral, 0) +
                  ` ${TOKEN_COLLATERAL_SUPPORT[position.protocol][position.collateralToken]?.symbol}`
                : '$' + formatNumber(collateral, 0),
          }
        })

        const makers = [...increaseMarkers, ...decreaseMarkers, ...modifiedMarkers]
        if (!isOpening && nextHours) {
          const closeMarkers: SeriesMarker<Time> = {
            id: closeOrder?.id ?? 'CLOSED',
            color: hasLiquidate ? themeColors.red2 : themeColors.neutral1,
            position: 'belowBar',
            shape: 'square',
            time: (dayjs(position.closeBlockTime).utc().unix() - timezone) as Time,
            text: hasLiquidate ? 'LIQUIDATED' : 'CLOSED',
          }
          makers.push(closeMarkers)
        }
        series.setMarkers(makers.sort((a, b) => Number(a.time) - Number(b.time)))
        series.priceScale().applyOptions({
          scaleMargins: {
            top: 0.1,
            bottom: 0.03,
          },
        })

        chart.timeScale().fitContent()
      }
    }

    const legend = document.getElementById(legendContainerId) ?? document.createElement('div')
    legend.setAttribute('id', legendContainerId)
    if (container && legend) {
      legend.style.position = 'absolute'
      legend.style.left = '0px'
      legend.style.top = '-24px'
      legend.style.zIndex = '1'
      legend.style.fontSize = '10px'
      legend.style.fontFamily = FONT_FAMILY
      legend.style.lineHeight = '12px'
      legend.style.color = themeColors.neutral3
      legend.style.display = 'none'
      container.appendChild(legend)
    }

    chart.subscribeCrosshairMove((param) => {
      const hoverMakerId = param.hoveredObjectId as string | undefined
      setMarkerId(hoverMakerId)

      const data = param.seriesData.get(series) as LineData
      const dataFuture = param.seriesData.get(futureSeries) as LineData
      const time = (dataFuture?.time ?? data?.time) as number
      setCrossMove({
        pnl: dataFuture?.value ?? data?.value,
        time: time ? time + timezone : undefined,
      })

      if (container && legend) {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > container.clientWidth ||
          param.point.y < 0 ||
          param.point.y > container.clientHeight
        ) {
          legend.style.display = 'none'
        } else {
          const candleData = param.seriesData.get(priceSeries) as CandlestickData
          if (candleData && candleData.time) {
            legend.innerHTML = `<div style="font-size: 13px; margin: 1px 0;">O: <span>${formatPrice(
              candleData.open
            )}</span> | H: <span>${formatPrice(candleData.high)}</span> | L: <span>${formatPrice(
              candleData.low
            )}</span> | C: <span>${formatPrice(candleData.close)} (${TIMEFRAME_NAMES[timeframe]})</span></div>`
            legend.style.display = 'block'
          }
        }
      }
    })

    const handleResize = () => {
      if (container) {
        chart.applyOptions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }
    }

    const handleResetFocus = () => {
      setCrossMove(undefined)
    }

    container?.addEventListener('mouseout', handleResetFocus)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      container?.removeEventListener('mouseout', handleResetFocus)

      chart.remove()
    }
  }, [chartData, chartFutureData, data, priceData, prices])

  return (
    <Box mt={24} sx={{ position: 'relative' }} minHeight={CHART_HEIGHT}>
      <div id={legendContainerId} />
      {currentOrder && <OrderTooltip data={currentOrder} />}
      {isLoading ? <Loading /> : <div id={chartContainerId} />}
    </Box>
  )
})

export default ChartProfitComponent
