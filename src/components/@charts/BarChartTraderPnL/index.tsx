import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import { useMemo } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { TraderPnlStatisticData } from 'entities/statistic'
import Loading from 'theme/Loading'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT, FONT_FAMILY } from 'utils/config/constants'
import { compactNumber, formatLocalDate, formatNumber } from 'utils/helpers/format'

export default function BarChartTraderPnL({
  data,
  isLoading,
  from,
  to,
}: {
  data?: TraderPnlStatisticData[]
  isLoading: boolean
  from: number
  to: number
}) {
  const generateData = useMemo(() => (data ? generateChartDailyPnL(from, to, data) : []), [data, from, to])
  const chartData = useMemo(() => (data ? getChartData({ data: generateData }) : []), [data, generateData])

  const stats = useMemo(() => {
    let stats
    if (data && chartData) {
      const maxRoi = maxBy(chartData, (item) => item.roi)?.roi ?? 0
      const minRoi = minBy(chartData, (item) => item.roi)?.roi ?? 0
      const maxPnl = maxBy(chartData, (item) => item.pnl)?.pnl ?? 0
      const minPnl = minBy(chartData, (item) => item.pnl)?.pnl ?? 0

      stats = {
        maxRoi,
        minRoi,
        maxPnl,
        minPnl,
        maxAbsPnl: Math.max(Math.abs(maxPnl), Math.abs(minPnl)),
        maxAbsRoi: Math.max(Math.abs(maxRoi), Math.abs(minRoi)),
      } as TraderPnlStatsData
    }

    return stats
  }, [data, chartData])
  return (
    <>
      {isLoading && <Loading />}
      {chartData && stats && (
        //@ts-ignore
        <Flex
          height="100%"
          sx={{
            flexDirection: 'column',
            justifyContent: 'end',
            overflow: 'hidden',
            '& .recharts-wrapper': {
              position: 'absolute !important',
            },
            '.recharts-cartesian-axis-tick': {
              text: {
                fill: 'neutral3',
                fontSize: '13px',
              },
            },
          }}
        >
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart data={chartData} margin={{ top: 0, left: 4, right: 4, bottom: 0 }}>
              <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="label" stroke={themeColors.neutral4} />
              <YAxis
                domain={[-stats.maxAbsPnl * 1.2, stats.maxAbsPnl * 1.2]}
                stroke={themeColors.neutral4}
                tickFormatter={(value) => `$${compactNumber(value, 1)}`}
                ticks={[-stats.maxAbsPnl * 1.2, 0, stats.maxAbsPnl * 1.2]}
              />
              <Bar type="monotone" name="PnL" unit="$" dataKey="pnl" fill={themeColors.neutral1}>
                {chartData.map((item, i) => {
                  return (
                    <Cell
                      key={`cell-${i}`}
                      fill={item.pnl > 0 ? themeColors.green1 : item.pnl < 0 ? themeColors.red2 : themeColors.neutral1}
                    />
                  )
                })}
              </Bar>
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.neutral5,
                  borderColor: 'transparent',
                  fontSize: '13px',
                  fontFamily: FONT_FAMILY,
                }}
                content={(payload) => <CustomTooltip item={payload.payload} />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Flex>
      )}
    </>
  )
}

interface TraderPnlChartData {
  label: string
  date: string
  pnl: number
  fee: number
  roi: number
}

type TraderPnlStatsData = {
  maxPnl: number
  maxRoi: number
  minPnl: number
  minRoi: number
  maxAbsPnl: number
  maxAbsRoi: number
}

function CustomTooltip({ item }: { item: any }) {
  const pnl = item?.[0]?.payload?.pnl ?? 0
  const fee = item?.[0]?.payload?.fee ?? 0
  const color = pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'
  return (
    <Flex p={2} bg="neutral5" flexDirection="column" sx={{ gap: 1 }}>
      <Type.Small mb={1}>{formatLocalDate(item?.[0]?.payload?.date, DAYJS_FULL_DATE_FORMAT)}</Type.Small>
      <Type.Small>
        PnL:{' '}
        <Type.Small color={color}>
          {pnl < 0 && '-'}${formatNumber(Math.abs(pnl), 2)}
        </Type.Small>
      </Type.Small>
      <Type.Small>
        Fees: <Type.Small>${formatNumber(fee)}</Type.Small>
      </Type.Small>
    </Flex>
  )
}

function getChartData({ data }: { data: TraderPnlStatisticData[] | undefined }) {
  let chartData: TraderPnlChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    chartData = data
      .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
      .map((stats) => {
        return {
          label: formatLocalDate(stats.date, 'MM/DD'),
          date: stats.date,
          pnl: stats.pnl,
          fee: stats.fee,
          roi: stats.percentage,
        } as TraderPnlChartData
      })
  }

  return chartData
}

export function generateChartDailyPnL(fromDate: number, toDate: number, cumulativeDates: TraderPnlStatisticData[]) {
  const dateArray: TraderPnlStatisticData[] = []
  let currentDate = dayjs(fromDate).utc().startOf('day')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let pnl = 0
    let fee = 0
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isSame(cumulativeDate.date)) {
        pnl = cumulativeDate.pnl
        fee = cumulativeDate.fee
      }
    })

    dateArray.push({ date: currentDate.toISOString(), pnl, fee })
    currentDate = currentDate.add(1, 'day')
  }

  const data = dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const result: TraderPnlStatisticData[] = []
  for (let i = 0; i < data.length - 1; i++) {
    result.push({
      date: data[i + 1].date,
      pnl: data[i + 1].pnl,
      fee: data[i + 1].fee,
      percentage: data[i].pnl ? ((data[i + 1].pnl - data[i].pnl) / data[i].pnl) * 100 : 0,
    })
  }

  return result
}
