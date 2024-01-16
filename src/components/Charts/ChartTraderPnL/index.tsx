import dayjs from 'dayjs'
import {
  ColorType,
  CrosshairMode,
  IChartApi,
  LineData,
  LineStyle,
  PriceScaleMode,
  createChart,
} from 'lightweight-charts'
import { useEffect, useMemo, useRef, useState } from 'react'

import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import { TraderPnlStatisticData } from 'entities/statistic'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import 'utils/helpers/calculate'

type CommonProps = {
  data: TraderPnlStatisticData[] | undefined
  isLoading?: boolean
  height?: number
  hasBalanceText?: boolean
}

export function ChartTraderPnL(props: { dayCount: number } & CommonProps): JSX.Element
export function ChartTraderPnL(props: { from: number; to: number } & CommonProps): JSX.Element
export default function ChartTraderPnL({
  data,
  isLoading,
  height = 120,
  hasBalanceText,
  from,
  to,
  dayCount,
}: {
  from?: number
  to?: number
  dayCount?: number
} & CommonProps) {
  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  let _from = from,
    _to = to
  if (dayCount) {
    const [fromDate, toDate] = getTimePeriod(dayCount)
    _from = fromDate
    _to = toDate
  }

  const chartData = useMemo(() => (_from && _to && data ? generateChartData(_from, _to, data) : []), [_from, _to, data])

  const latestPnL = useMemo(
    () =>
      crossMovePnL !== undefined
        ? crossMovePnL
        : chartData && chartData.length > 0
        ? chartData[chartData.length - 1].value
        : 0,
    [chartData, crossMovePnL]
  )

  const chartRef = useRef<IChartApi | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const renderResult = renderChart({ isLoading, data, chartData, container: containerRef.current })
    if (!renderResult) return
    const { chart, series, handleResize } = renderResult
    chartRef.current = chart
    // chart.subscribeCrosshairMove((param) => {
    //   const data = param.seriesData.get(series) as LineData
    //   setCrossMovePnL(data?.value)
    // })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [chartData, data, isLoading])

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {data && chartData && !isLoading && (
        <>
          {hasBalanceText && (
            <Flex
              width="100%"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
            >
              <Type.H3 color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
              </Type.H3>
            </Flex>
          )}
          <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%' }} height={height} />
        </>
      )}
    </Box>
  )
}

function generateChartData(fromDate: number, toDate: number, cumulativeDates: TraderPnlStatisticData[]) {
  cumulativeDates.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const uniquePnlData: TraderPnlStatisticData[] = []
  cumulativeDates.forEach((item) => {
    const index = uniquePnlData.findIndex((e) => e.date === item.date)
    if (index >= 0) {
      const exist = uniquePnlData[index]
      uniquePnlData.splice(index, 1)
      uniquePnlData.push({ date: item.date, pnl: item.pnl + exist.pnl, fee: item.fee + exist.fee })
    } else {
      uniquePnlData.push(item)
    }
  })

  function convertToCumulativeArray(data: TraderPnlStatisticData[]): TraderPnlStatisticData[] {
    let cumulativePnl = 0
    let cumulativeFee = 0
    return data.reduce((cumulativeData: TraderPnlStatisticData[], dataPoint) => {
      cumulativePnl += dataPoint.pnl
      cumulativeFee += dataPoint.fee
      cumulativeData.push({ date: dataPoint.date, pnl: cumulativePnl, fee: cumulativeFee })

      return cumulativeData
    }, [])
  }
  const chartData = convertToCumulativeArray(uniquePnlData)

  const dateArray: TraderPnlStatisticData[] = []
  let currentDate = dayjs(fromDate).utc().startOf('hour')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let pnl = 0
    let fee = 0
    chartData.forEach((cumulativeDate) => {
      if (currentDate.isAfter(cumulativeDate.date)) {
        pnl = cumulativeDate.pnl
        fee = cumulativeDate.fee
      }
    })

    dateArray.push({ date: currentDate.toISOString(), pnl, fee })
    currentDate = addTimeframe(currentDate.valueOf(), fromDate, toDate)
  }

  const timezone = new Date().getTimezoneOffset() * 60

  return dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
    .map((v) => ({ value: v.pnl, time: dayjs(v.date).utc().unix() - timezone } as LineData))
}
function addTimeframe(date: number, fromDate: number, toDate: number) {
  const diffDays = dayjs(toDate).utc().diff(fromDate, 'day')
  const diffHour = dayjs(toDate).utc().diff(dayjs(fromDate).utc(), 'hour')
  const currentDate = dayjs(date).utc()

  return diffDays > 4
    ? currentDate.add(4, 'hour')
    : diffDays > 0
    ? currentDate.add(1, 'hour')
    : diffHour > 8
    ? currentDate.add(15, 'minutes')
    : currentDate.add(5, 'minutes')
}

function getTimePeriod(dayCount: number) {
  const to = dayjs().utc().startOf('day').valueOf()
  const from = dayjs(to).utc().subtract(dayCount, 'day').valueOf()
  return [from, to]
}

function renderChart({
  isLoading,
  data,
  chartData,
  container,
}: {
  isLoading?: boolean
  data: TraderPnlStatisticData[] | undefined
  chartData: LineData[] | undefined
  container: HTMLDivElement
}) {
  if (isLoading || !data || !chartData) return

  const chart = createChart(container, {
    height: container.clientHeight,
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
      visible: false, // NOTE
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        visible: false, // NOTE
        labelBackgroundColor: themeColors.neutral4,
        // labelVisible: false,
        color: themeColors.neutral3,
        width: 1,
        style: LineStyle.Dotted,
      },
      vertLine: {
        visible: false, // NOTE
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
    crosshairMarkerVisible: false, //NOTE
    // disabling built-in price lines
  })
  series.setData(chartData)

  const handleResize = () => {
    if (container) {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }
  }

  return { chart, series, handleResize }
}
