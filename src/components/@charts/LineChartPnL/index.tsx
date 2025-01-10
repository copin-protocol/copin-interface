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
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import 'utils/helpers/calculate'
import { getTimePeriod } from 'utils/helpers/transform'

import { chartTimeFrame, sortInputData } from '../helpers'
import { ChartDataType } from '../types'

type CommonProps = {
  data: ChartDataType[] | undefined
  isCumulativeData: boolean
  isLoading?: boolean
  height?: number
  hasBalanceText?: boolean
  isSimple?: boolean
  balanceTextComponent?: typeof Type.H1
}

export function LineChartPnL(props: { dayCount: number } & CommonProps): JSX.Element
export function LineChartPnL(props: { from: number; to: number } & CommonProps): JSX.Element
export default function LineChartPnL({
  data,
  isLoading,
  height = 120,
  from,
  to,
  dayCount,
  isSimple = false,
  hasBalanceText = true,
  balanceTextComponent: BalanceTextComponent = Type.H3,
  isCumulativeData,
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

  const chartData = useMemo(
    () => (_from && _to && data ? generateChartData({ fromDate: _from, toDate: _to, data, isCumulativeData }) : []),
    [_from, _to, data, isCumulativeData]
  )

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
    const renderResult = renderChart({ chartData, container: containerRef.current, isSimple })
    if (!renderResult) return
    const { chart, series, handleResize } = renderResult
    chartRef.current = chart
    if (!isSimple) {
      chart.subscribeCrosshairMove((param) => {
        const data = param.seriesData.get(series) as LineData
        setCrossMovePnL(data?.value)
      })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      chart.remove()
    }
  }, [chartData, isSimple])

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      {data && chartData && !isLoading && (
        <>
          {hasBalanceText && (
            <BalanceTextComponent
              color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}
              sx={{ display: 'block', textAlign: 'center' }}
            >
              <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
            </BalanceTextComponent>
          )}
          <Box sx={{ flex: '1 0 0', overflow: 'hidden' }}>
            <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%' }} height={height} />
          </Box>
        </>
      )}
    </Flex>
  )
}

function generateChartData({
  fromDate,
  toDate,
  data,
  isCumulativeData,
}: {
  fromDate: number
  toDate: number
  data: ChartDataType[]
  isCumulativeData: boolean
}) {
  const sortedData = sortInputData(data)

  const chartData = isCumulativeData ? sortedData : convertToCumulativeArray(sortedData)

  const dateArray: ChartDataType[] = []
  let currentDate = dayjs(fromDate).utc().startOf('hour')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let pnl = 0
    let fee = 0
    let roi = 0
    chartData.forEach((data) => {
      if (currentDate.isAfter(data.date)) {
        pnl = data.pnl
        fee = data.fee
        roi = data.roi
      }
    })

    dateArray.push({ date: currentDate.toISOString(), pnl, fee, roi })
    currentDate = chartTimeFrame(currentDate.valueOf(), fromDate, toDate)
  }

  const timezone = new Date().getTimezoneOffset() * 60

  return dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
    .map((v) => ({ value: v.pnl, time: dayjs(v.date).utc().unix() - timezone } as LineData))
}

function convertToCumulativeArray(data: ChartDataType[]): ChartDataType[] {
  const uniquePnlData: ChartDataType[] = []
  data.forEach((item) => {
    const index = uniquePnlData.findIndex((e) => e.date === item.date)
    if (index >= 0) {
      const exist = uniquePnlData[index]
      uniquePnlData.splice(index, 1)
      uniquePnlData.push({
        date: item.date,
        pnl: item.pnl + exist.pnl,
        fee: item.fee + exist.fee,
        roi: item.roi + exist.roi,
      })
    } else {
      uniquePnlData.push(item)
    }
  })

  let cumulativePnl = 0
  let cumulativeFee = 0
  let cumulativeRoi = 0
  return uniquePnlData.reduce((result: ChartDataType[], dataPoint) => {
    cumulativePnl += dataPoint.pnl
    cumulativeFee += dataPoint.fee
    cumulativeRoi += dataPoint.roi
    result.push({ date: dataPoint.date, pnl: cumulativePnl, fee: cumulativeFee, roi: cumulativeRoi })

    return result
  }, [])
}

function renderChart({
  chartData,
  container,
  isSimple,
}: {
  chartData: LineData[] | undefined
  container: HTMLDivElement
  isSimple: boolean
}) {
  if (!chartData?.length) return

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
      fontSize: 12,
      attributionLogo: false,
    },
    timeScale: {
      rightOffset: 0,
      secondsVisible: true,
      timeVisible: true,
      rightBarStaysOnScroll: true,
      lockVisibleTimeRangeOnResize: true,
      visible: isSimple ? false : true,
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      horzLine: {
        visible: isSimple ? false : true,
        labelBackgroundColor: themeColors.neutral4,
        // labelVisible: false,
        color: themeColors.neutral3,
        width: 1,
        style: LineStyle.Dotted,
      },
      vertLine: {
        visible: isSimple ? false : true,
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
    crosshairMarkerVisible: isSimple ? false : true,
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
