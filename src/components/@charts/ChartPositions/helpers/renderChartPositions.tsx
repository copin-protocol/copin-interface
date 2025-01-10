import {
  CandlestickData,
  ColorType,
  CrosshairMode,
  LineStyle,
  MouseEventParams,
  PriceScaleMode,
  Time,
  createChart,
} from 'lightweight-charts'

import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { formatPrice } from 'utils/helpers/format'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { TimeRangeProps } from '../types'

type RenderChartArgs = {
  chartMinHeight: number
  username: string | undefined
  chartId: string
  legendId: string
  chartData: CandlestickData<Time>[] | undefined
  hasBrush?: boolean
  setVisibleRange: (time: TimeRangeProps | undefined) => void
  setMarkerId: (id: string | undefined) => void
}
export default function renderChartPositions({
  chartMinHeight,
  username,
  chartId,
  legendId,
  chartData,
  hasBrush,
  setVisibleRange,
  setMarkerId,
}: RenderChartArgs) {
  if (!chartData || chartData?.length === 0) return

  const container = document.getElementById(chartId)
  const chart = createChart(container ? container : chartId, {
    // height: Math.max(container?.clientHeight ?? 0, THE_REST_HEIGHT),
    height: Math.max(container?.clientHeight ?? 0, chartMinHeight),
    rightPriceScale: {
      entireTextOnly: true,
      borderVisible: false,
      mode: PriceScaleMode.Logarithmic,
      textColor: themeColors.neutral3,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: true,
      borderVisible: true,
      borderColor: '#1f1a30',
      rightOffset: 30,
      fixLeftEdge: true,
      fixRightEdge: true,
      shiftVisibleRangeOnNewBar: true,
    },
    grid: {
      horzLines: {
        color: 'transparent',
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
    leftPriceScale: {
      visible: false,
      scaleMargins: {
        bottom: 0,
        top: 0,
      },
    },
    layout: {
      textColor: themeColors.neutral3,
      background: { type: ColorType.Solid, color: 'transparent' },
      fontFamily: FONT_FAMILY,
      fontSize: 12,
      attributionLogo: false,
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      horzLine: {
        labelBackgroundColor: themeColors.neutral1,
        color: themeColors.neutral3,
        width: 1,
        style: LineStyle.Dotted,
      },
      vertLine: {
        color: themeColors.neutral3,
        labelBackgroundColor: themeColors.neutral1,
        width: 1,
        style: LineStyle.Dotted,
      },
    },
  })

  const series = chart.addCandlestickSeries({
    upColor: themeColors.neutral3,
    downColor: 'transparent',
    borderDownColor: themeColors.neutral3,
    borderUpColor: themeColors.neutral3,
    wickDownColor: themeColors.neutral3,
    wickUpColor: themeColors.neutral3,
  })
  series.setData(chartData)
  series.applyOptions({})

  const avgPriceLine = series.createPriceLine({
    id: 'averagePrice',
    price: 0,
    color: 'transparent',
    lineWidth: 1,
    lineVisible: false,
    axisLabelVisible: false,
    title: 'Avg. Price',
    lineStyle: LineStyle.Dashed,
  })

  const timeScale = chart.timeScale()

  const handleClickEvent = (param: MouseEventParams) => {
    const hoverMakerId = param.hoveredObjectId as string | undefined
    setMarkerId(hoverMakerId)

    const timeRange = timeScale.getVisibleRange()
    setVisibleRange({ from: Number(timeRange?.from), to: Number(timeRange?.to) })

    if (hoverMakerId && username) {
      logEvent({
        label: getUserForTracking(username),
        category: EventCategory.CHART,
        action: EVENT_ACTIONS[EventCategory.CHART].VIEW_ORDER_MARKER,
      })
    }
  }

  if (container) {
    const legend = document.getElementById(legendId) ?? document.createElement('div')
    legend.setAttribute('id', legendId)
    if (legend) {
      legend.style.position = 'absolute'
      legend.style.left = '8px'
      legend.style.bottom = hasBrush ? '140px' : '40px'
      legend.style.zIndex = '1'
      legend.style.fontSize = '12px'
      legend.style.fontFamily = FONT_FAMILY
      legend.style.lineHeight = '12px'
      legend.style.color = themeColors.neutral3
      legend.style.display = 'none'
      container.appendChild(legend)
    }

    // const watermark = document.getElementById('watermark') ?? document.createElement('div')
    // watermark.setAttribute('id', 'watermark')
    // // place below the chart
    // watermark.style.zIndex = '100'
    // watermark.style.position = 'absolute'
    // // set size and position to match container
    // watermark.style.inset = '0px'
    // watermark.style.bottom = hasBrush ? '80px' : '8px'
    // watermark.style.right = hasBrush ? '40px' : '4px'
    // watermark.style.backgroundImage = `url("${PythWatermark}")`
    // watermark.style.backgroundSize = hasBrush ? '65px 18px' : '58px 16px'
    // watermark.style.backgroundRepeat = 'no-repeat'
    // watermark.style.backgroundPosition = 'bottom right'
    // container.appendChild(watermark)

    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        if (legend) {
          legend.style.display = 'none'
        }
      } else {
        if (legend) {
          const candleData = param.seriesData.get(series) as CandlestickData
          if (candleData && candleData.time) {
            legend.innerHTML = `<div style="font-size: 12px; margin: 1px 0;">O: <span>${formatPrice(
              candleData.open
            )}</span> | H: <span>${formatPrice(candleData.high)}</span> | L: <span>${formatPrice(
              candleData.low
            )}</span> | C: <span>${formatPrice(candleData.close)}</span></div>`
            legend.style.display = 'block'
          }
        }
      }
    })

    chart.subscribeClick(handleClickEvent)
  }
  return { chart, container, timeScale, avgPriceLine, series, handleClickEvent }
}
