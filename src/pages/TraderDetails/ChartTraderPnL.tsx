import dayjs from 'dayjs'
import { ColorType, CrosshairMode, LineData, LineStyle, PriceScaleMode, createChart } from 'lightweight-charts'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import { getTraderPnlStatsApi } from 'apis/statisticApi'
import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import colors from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { ELEMENT_IDS, QUERY_KEYS } from 'utils/config/keys'
import 'utils/helpers/calculate'
import { getDurationFromTimeFilter, getTimeframeFromTimeRange } from 'utils/helpers/transform'

export default function ChartTraderPnL({
  protocol,
  account,
  timeOption,
  onChangeTime,
}: {
  protocol: ProtocolEnum
  account: string
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  const _color = colors(true)
  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  const to = useMemo(() => dayjs().utc().valueOf(), [])
  const timeframeDuration = getDurationFromTimeFilter(timeOption.id)
  const from = useMemo(() => dayjs(to).utc().subtract(timeframeDuration, 'day').valueOf(), [timeframeDuration, to])
  const timeframe = useMemo(() => getTimeframeFromTimeRange(from, to), [from, to])
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, from, to, timeframe],
    () =>
      getChartDataV2({
        from,
        to,
        timeframe,
        symbol: 'BTC',
      }),
    {
      retry: 0,
    }
  )
  const { data: stats, isLoading: loadingStats } = useQuery(
    [QUERY_KEYS.GET_TRADER_PNL_STATISTIC, account, from, to],
    () =>
      getTraderPnlStatsApi({
        from,
        to,
        account,
        protocol,
      }),
    {
      retry: 0,
    }
  )
  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])

  const chartData: LineData[] = useMemo(() => {
    if (!data) return []
    const chartPnLData = data.map((e) => {
      return {
        value: 0,
        time: dayjs(e.timestamp).utc().unix() - timezone,
      } as LineData
    })

    stats?.forEach((e) => {
      chartPnLData.push({
        value: e.pnl - e.fee,
        time: dayjs(e.date).utc().unix() - timezone,
      } as LineData)
    })
    chartPnLData.sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0))
    const uniquePnlData: LineData[] = []
    chartPnLData.forEach((item) => {
      const index = uniquePnlData.findIndex((e) => e.time === item.time)
      if (index >= 0) {
        const exist = uniquePnlData[index]
        uniquePnlData.splice(index, 1)
        uniquePnlData.push({ time: item.time, value: item.value + exist.value })
      } else {
        uniquePnlData.push(item)
      }
    })
    function convertToCumulativeArray(data: LineData[]): LineData[] {
      let cumulativeValue = 0
      return data.reduce((cumulativeData: LineData[], dataPoint) => {
        cumulativeValue += dataPoint.value
        cumulativeData.push({ time: dataPoint.time, value: cumulativeValue })

        return cumulativeData
      }, [])
    }

    return convertToCumulativeArray(uniquePnlData)
  }, [data, stats, timezone])

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
    if (isLoading || !data || !stats || !chartData) return

    const container = document.getElementById(ELEMENT_IDS.TRADER_CHART_PNL)
    const chart = createChart(container ? container : ELEMENT_IDS.TRADER_CHART_PNL, {
      height: 120,
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
        textColor: _color.neutral3,
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
          labelBackgroundColor: _color.neutral4,
          // labelVisible: false,
          color: _color.neutral3,
          width: 1,
          style: LineStyle.Dotted,
        },
        vertLine: {
          color: _color.neutral3,
          labelBackgroundColor: _color.neutral4,
          width: 1,
          style: LineStyle.Dotted,
        },
      },
    })
    chart.timeScale().fitContent()
    chart.timeScale().applyOptions({})

    const series = chart.addBaselineSeries({
      priceScaleId: 'right',
      topLineColor: _color.green1,
      bottomLineColor: _color.red2,
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
  }, [chartData, data, isLoading, stats, timezone])

  return (
    <Box
      sx={{
        height: 210,
      }}
    >
      {(isLoading || loadingStats) && <Loading />}
      {stats && chartData && !isLoading && (
        <Box sx={{ px: 12, pt: 12, pb: 1 }}>
          <Flex width="100%" alignItems="center" justifyContent="center" flexDirection="column">
            <Flex alignItems="center" sx={{ gap: 2 }} mb={1}>
              <Type.Caption color="neutral3">Net PNL in the past</Type.Caption>
              <Dropdown
                buttonSx={{
                  border: 'none',
                  py: 0,
                  px: 0,
                }}
                menuSx={{
                  width: '80px',
                  minWidth: 'auto',
                }}
                placement="bottom"
                menu={
                  <>
                    {TIME_FILTER_OPTIONS.map((option) => (
                      <CheckableDropdownItem
                        key={option.id}
                        selected={option.id === timeOption.id}
                        text={option.text}
                        onClick={() => onChangeTime(option)}
                      />
                    ))}
                  </>
                }
              >
                {timeOption.text}
              </Dropdown>
            </Flex>
            <Type.H3 color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
              <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
            </Type.H3>

            {/* <Flex mt={1} alignItems="center" sx={{ gap: [3, 4] }}>
              <Flex alignItems="center" sx={{ gap: 12 }}>
                <Type.Body color="neutral2">Runtime:</Type.Body>
                <Type.BodyBold>{traderData?.runTimeDays ? `${traderData.runTimeDays} days` : '--'}</Type.BodyBold>
              </Flex>
              <Flex alignItems="center" sx={{ gap: 12 }}>
                <Type.Body color="neutral2">Last trade:</Type.Body>
                <Type.BodyBold>
                  {traderData?.lastTradeAt ? formatRelativeDate(traderData.lastTradeAt) : '--'}
                </Type.BodyBold>
              </Flex>
            </Flex> */}
          </Flex>
          <Box mt={1} sx={{ position: 'relative' }} minHeight={120}>
            <div id={ELEMENT_IDS.TRADER_CHART_PNL} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
