import dayjs from 'dayjs'
import {
  ColorType,
  CrosshairMode,
  LineData,
  LineStyle,
  PriceScaleMode,
  WhitespaceData,
  createChart,
} from 'lightweight-charts'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ChartData } from 'entities/chart'
import { Button } from 'theme/Buttons'
import { Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'

import { BrushableAreaSeries } from './BrushableArea/Series'
import { BrushableAreaData } from './BrushableArea/data'
import { BrushableAreaStyle } from './BrushableArea/options'
import { DeltaTooltipPrimitive } from './DeltaTooltip/deltaTooltip'

const ID = 'time-range-selection-chart'

const greenStyle: Partial<BrushableAreaStyle> = {
  lineColor: themeColors.green1,
  topColor: `${themeColors.green1}66`,
  bottomColor: `${themeColors.green1}00`,
  lineWidth: 2,
}

const redStyle: Partial<BrushableAreaStyle> = {
  lineColor: themeColors.red1,
  topColor: `${themeColors.red1}66`,
  bottomColor: `${themeColors.red1}00`,
  lineWidth: 2,
}

const fadeStyle: Partial<BrushableAreaStyle> = {
  lineColor: themeColors.neutral4,
  topColor: `${themeColors.neutral4}66`,
  bottomColor: `${themeColors.neutral4}00`,
}

const baseStyle: Partial<BrushableAreaStyle> = {
  lineColor: themeColors.primary1,
  topColor: `${themeColors.primary1}66`,
  bottomColor: `${themeColors.primary1}00`,
}

const TimeRangeSelection = ({
  data,
  width,
  height,
  from,
  to,
  onChange,
}: {
  data: ChartData[]
  width: number
  height: number
  from: Date
  to?: Date
  onChange: (params: { from: Date; to: Date }) => void
}) => {
  const [selection, setSelection] = useState<[Date, Date]>()
  const lastSelected = useRef<[number, number]>()
  const [zoomDisabled, setZoomDisabled] = useState(false)
  const chartRef = useRef<any>(null)
  const brushRef = useRef<any>(null)
  const tooltipRef = useRef<any>(null)
  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])
  const chartData: LineData[] = useMemo(
    () =>
      data
        ?.map((e) => {
          return {
            value: e.close,
            time: dayjs(e.timestamp).utc().unix() - timezone,
          } as LineData
        })
        ?.sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? [],
    [data, timezone]
  )
  const changeBrush = useCallback(
    (from: Date, to?: Date) => {
      const getDateIndexForward = (date: Date) => {
        for (let i = 0; i <= data.length - 1; i++) {
          if (date.getTime() <= data[i].timestamp) return i
        }
        return null
      }
      const getDateIndexBackward = (date: Date) => {
        for (let i = data.length - 1; i >= 0; i--) {
          if (date.getTime() >= data[i].timestamp) return i
        }
        return null
      }
      const fromIndex = getDateIndexForward(from)
      const toIndex = getDateIndexBackward(to ?? new Date())

      if (!brushRef.current || !fromIndex || !toIndex) return

      brushRef.current.applyOptions({
        brushRanges: [
          {
            range: {
              from: fromIndex,
              to: toIndex,
            },
            style: baseStyle,
          },
        ],
        ...fadeStyle,
      })
      lastSelected.current = [fromIndex, toIndex]
    },
    [data]
  )
  const changeBrushByIndex = useCallback((fromIndex: number, toIndex: number) => {
    if (!brushRef.current) return
    brushRef.current.applyOptions({
      brushRanges: [
        {
          range: {
            from: fromIndex,
            to: toIndex,
          },
          style: baseStyle,
        },
      ],
      ...fadeStyle,
    })
  }, [])
  useEffect(() => {
    if (!brushRef.current || !!selection) return
    changeBrush(from, to)
  }, [from, to, changeBrush, selection])

  useEffect(() => {
    const handleKeyDownEvent = (event: any) => {
      if (event.key === 'Meta' || event.key === 'Control' || event.key === 'Alt') {
        setZoomDisabled(true)
      }
    }
    const handleKeyUpEvent = (event: any) => {
      if (event.key === 'Meta' || event.key === 'Control' || event.key === 'Alt') {
        setZoomDisabled(false)
      }
    }
    window.addEventListener('keydown', handleKeyDownEvent)
    window.addEventListener('keyup', handleKeyUpEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent)
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || !tooltipRef.current) return
    tooltipRef.current.enable(zoomDisabled)
    chartRef.current.applyOptions({
      handleScroll: !zoomDisabled,
      handleScale: !zoomDisabled,
    })
  }, [zoomDisabled])

  useEffect(() => {
    const container = document.getElementById(ID)
    const chart = ((window as unknown as any).chart = createChart(container ? container : ID, {
      autoSize: true,
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
        rightOffset: 3,
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
        background: { type: ColorType.Solid, color: themeColors.neutral6 },
        fontFamily: FONT_FAMILY,
        fontSize: 13,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        horzLine: {
          // labelBackgroundColor: themeColors.neutral1,
          color: 'transparent',
          width: 1,
          style: LineStyle.Dotted,
        },
        vertLine: {
          color: themeColors.neutral3,
          // labelBackgroundColor: themeColors.neutral1,
          width: 1,
          style: LineStyle.Dotted,
        },
      },
    }))
    chartRef.current = chart

    const customSeriesView = new BrushableAreaSeries()
    const brushAreaSeries = chart.addCustomSeries(customSeriesView, {
      /* Options */
      ...baseStyle,

      priceLineVisible: false,
    })
    brushRef.current = brushAreaSeries

    brushAreaSeries.setData(chartData as (BrushableAreaData | WhitespaceData)[])

    const tooltipPrimitive = new DeltaTooltipPrimitive({
      lineColor: 'rgba(255, 255, 255, 0.2)',
    })
    tooltipRef.current = tooltipPrimitive

    brushAreaSeries.attachPrimitive(tooltipPrimitive)

    chart.timeScale().fitContent()

    if (from) {
      changeBrush(from, to)
    }

    tooltipPrimitive.activeRange().subscribe((activeRange) => {
      if (activeRange === null) {
        // brushAreaSeries.applyOptions({
        // 	brushRanges: [],
        // 	...baseStyle,
        // });
        return
      }
      const fromDate = new Date(data[activeRange.from].timestamp)
      const toDate = new Date(data[activeRange.to].timestamp)
      fromDate.setHours(0, 0, 0, 0)
      toDate.setHours(0, 0, 0, 0)

      setSelection([fromDate, toDate])

      brushAreaSeries.applyOptions({
        brushRanges: [
          {
            range: {
              from: activeRange.from,
              to: activeRange.to,
            },
            style: baseStyle,
          },
        ],
        ...fadeStyle,
      })
    })
    // brushAreaSeries.
    const handleResize = () => {
      requestAnimationFrame(() => {
        chart.timeScale().fitContent()
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current.remove()
    }
  }, [])
  return (
    <div style={{ position: 'relative' }}>
      <div
        id={ID}
        style={{
          height,
        }}
      ></div>
      {!!selection && (
        <Flex
          sx={{
            position: 'absolute',
            bottom: 36,
            right: 86,
            gap: 1,
            zIndex: 1000,
          }}
        >
          <Button
            variant="primary"
            size="xs"
            onClick={() => {
              onChange({ from: selection[0], to: selection[1] })
              setSelection(undefined)
            }}
          >
            Apply
          </Button>
          <Button
            variant="white"
            size="xs"
            onClick={() => {
              setSelection(undefined)
              if (lastSelected.current) changeBrushByIndex(...lastSelected.current)
            }}
          >
            Cancel
          </Button>
        </Flex>
      )}
    </div>
  )
}

export default TimeRangeSelection
