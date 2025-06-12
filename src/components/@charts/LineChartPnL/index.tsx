import {
  ColorType,
  CrosshairMode,
  IChartApi,
  LineData,
  LineStyle,
  LineWidth,
  PriceScaleMode,
  createChart,
} from 'lightweight-charts'
import { useEffect, useMemo, useRef, useState } from 'react'

import { renderValueWithColor } from 'components/@position/configs/copyPositionRenderProps'
import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import 'utils/helpers/calculate'
import { getTimePeriod } from 'utils/helpers/transform'

import { ChartDataType } from '../types'
import { useChartWorker } from './useChartWorker'

type CommonProps = {
  data: ChartDataType[] | undefined
  isCumulativeData: boolean
  isLoading?: boolean
  height?: number
  hasBalanceText?: boolean
  isSimple?: boolean
  balanceTextComponent?: typeof Type.H1
  lineWidth?: LineWidth
  address?: string
  protocol?: ProtocolEnum
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
  lineWidth = 2,
  balanceTextComponent: BalanceTextComponent = Type.H3,
  isCumulativeData,
  address,
  protocol,
}: {
  from?: number
  to?: number
  dayCount?: number
  isSimple?: boolean
  address?: string
  protocol?: ProtocolEnum
} & CommonProps) {
  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  let _from = from,
    _to = to
  if (dayCount) {
    const [fromDate, toDate] = getTimePeriod(dayCount)
    _from = fromDate
    _to = toDate
  }

  const chartWorkerParams = useMemo(() => {
    if (_from && _to && data) {
      return {
        fromDate: _from,
        toDate: _to,
        data,
        isCumulativeData,
        address,
        protocol,
      }
    }
    return undefined
  }, [_from, _to, data, isCumulativeData, address, protocol])

  const chartData = useChartWorker(chartWorkerParams)

  const latestPnL =
    crossMovePnL !== undefined
      ? crossMovePnL
      : chartData && chartData.length > 0
      ? chartData[chartData.length - 1].value
      : 0

  const unrealisedPnl = data && data.length > 0 ? data[data.length - 1].unrealisedPnl : 0
  const realisedPnl = latestPnL - unrealisedPnl

  const chartRef = useRef<IChartApi | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const renderResult = renderChart({ chartData, container: containerRef.current, isSimple, lineWidth })
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
  }, [chartData, isSimple, lineWidth])

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      {data && chartData && !isLoading && (
        <>
          {hasBalanceText && (
            <Box
              data-tooltip-id="tt-trader-pnl"
              data-tooltip-delay-show={360}
              sx={{
                textDecoration: 'underline',
                textDecorationStyle: 'dashed',
                textDecorationColor: 'rgba(119, 126, 144, 0.5)',
              }}
            >
              <BalanceTextComponent
                color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}
                sx={{ display: 'block', textAlign: 'center' }}
              >
                <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
              </BalanceTextComponent>
            </Box>
          )}
          <Tooltip id="tt-trader-pnl">
            <Flex flexDirection="column" sx={{ gap: 2 }}>
              <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                <Type.Caption>Realized PnL:</Type.Caption>
                {renderValueWithColor(realisedPnl)}
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                <Type.Caption>Unrealized PnL:</Type.Caption>
                {renderValueWithColor(unrealisedPnl)}
              </Flex>
            </Flex>
          </Tooltip>
          <Box sx={{ flex: '1 0 0', overflow: 'hidden' }}>
            <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%' }} height={height} />
          </Box>
        </>
      )}
    </Flex>
  )
}

function renderChart({
  chartData,
  container,
  isSimple,
  lineWidth,
}: {
  chartData: LineData[] | undefined
  container: HTMLDivElement
  isSimple: boolean
  lineWidth: LineWidth
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
    lineWidth,
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
