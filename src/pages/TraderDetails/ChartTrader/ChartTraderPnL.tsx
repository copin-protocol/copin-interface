import dayjs from 'dayjs'
import { ColorType, CrosshairMode, LineData, LineStyle, PriceScaleMode, createChart } from 'lightweight-charts'
import { useEffect, useMemo, useRef, useState } from 'react'

import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import { TraderPnlStatisticData } from 'entities/statistic'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'
import 'utils/helpers/calculate'

import { generateChartPnL } from './generateChartData'

export default function ChartTraderPnL({
  isLoading,
  data,
  from,
  to,
}: {
  isLoading?: boolean
  data?: TraderPnlStatisticData[]
  from: number
  to: number
}) {
  const [chartHeight, setChartHeight] = useState(250)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setChartHeight(entries?.[0]?.contentRect?.height ?? 120)
    })
    if (containerRef.current) observer.observe(containerRef.current)
  }, [])

  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])
  const generateData = useMemo(() => (data ? generateChartPnL(from, to, data) : []), [data, from, to])

  const chartData: LineData[] = useMemo(() => {
    if (!data) return []
    const chartPnLData: LineData[] = []
    generateData?.forEach((e) => {
      chartPnLData.push({
        value: e.pnl,
        time: dayjs(e.date).utc().unix() - timezone,
      } as LineData)
    })
    return chartPnLData.sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0))
  }, [data, generateData, timezone])

  const latestPnL = useMemo(
    () =>
      crossMovePnL !== undefined
        ? crossMovePnL
        : chartData && chartData.length > 0
        ? chartData[chartData.length - 1].value
        : 0,
    [chartData, crossMovePnL]
  )

  useEffect(() => {
    if (isLoading || !data || !chartData) return

    const container = document.getElementById(ELEMENT_IDS.TRADER_CHART_PNL)
    const chart = createChart(container ? container : ELEMENT_IDS.TRADER_CHART_PNL, {
      height: chartHeight,
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
          labelBackgroundColor: themeColors.neutral4,
          // labelVisible: false,
          color: themeColors.neutral3,
          width: 1,
          style: LineStyle.Dotted,
        },
        vertLine: {
          color: themeColors.neutral3,
          labelBackgroundColor: themeColors.neutral4,
          width: 1,
          style: LineStyle.Dotted,
        },
      },
    })
    chart.timeScale().fitContent()
    chart.timeScale().applyOptions({})

    const series = chart.addBaselineSeries({
      priceScaleId: 'right',
      topLineColor: themeColors.green1,
      bottomLineColor: themeColors.red2,
      baseValue: {
        type: 'price',
        price: 0,
      },
      baseLineStyle: LineStyle.Dashed,
      lineWidth: 2,
      baseLineColor: 'red',
      baseLineVisible: true,
      lastValueVisible: false,
      priceLineVisible: false,
      // disabling built-in price lines
    })
    series.setData(chartData)

    chart.subscribeCrosshairMove((param) => {
      const data = param.seriesData.get(series) as LineData
      setCrossMovePnL(data?.value)
    })

    const handleResize = () => {
      if (container) {
        chart.applyOptions({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [chartData, data, isLoading, timezone, chartHeight])

  return (
    <Flex sx={{ height: '100%', width: '100%', flexDirection: 'column' }}>
      {data && chartData && !isLoading && (
        <>
          <Type.H3
            color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}
            sx={{ display: 'block', textAlign: 'center' }}
          >
            <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
          </Type.H3>
          <Box flex="1 0 0" mt={1} sx={{ position: 'relative' }} minHeight={120} ref={containerRef}>
            <div id={ELEMENT_IDS.TRADER_CHART_PNL} />
          </Box>
        </>
      )}
    </Flex>
  )
}
