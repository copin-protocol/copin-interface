import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import React, { useMemo } from 'react'
import { Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
      const maxCumulativePnl = maxBy(chartData, (item) => item.cumulativePnl)?.cumulativePnl ?? 0
      const minCumulativePnl = minBy(chartData, (item) => item.cumulativePnl)?.cumulativePnl ?? 0

      stats = {
        maxRoi,
        minRoi,
        maxPnl,
        minPnl,
        maxCumulativePnl,
        minCumulativePnl,
        maxAbsCumulativePnl: Math.max(Math.abs(maxCumulativePnl), Math.abs(minCumulativePnl)),
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
                fontSize: '10px',
              },
            },
          }}
        >
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart data={chartData} barGap={0} stackOffset="sign">
              {/*<CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.5} />*/}
              <XAxis
                dataKey="label"
                stroke={themeColors.neutral4}
                // axisLine={false}
                // tickLine={false}
                // angle={-90}
                fontSize={10}
                tickMargin={12}
                minTickGap={10}
              />
              <YAxis
                domain={[-stats.maxAbsPnl * 1.2, stats.maxAbsPnl * 1.2]}
                stroke={themeColors.neutral4}
                tickFormatter={(value) => `$${compactNumber(value, 1)}`}
                ticks={[-stats.maxAbsPnl * 1.1, stats.maxAbsPnl * 1.1]}
                axisLine={false}
                tickLine={false}
                mirror={true}
              />
              <YAxis
                domain={[-stats.maxAbsCumulativePnl * 1.2, stats.maxAbsCumulativePnl * 1.2]}
                orientation="right"
                yAxisId="right"
                stroke={themeColors.neutral4}
                ticks={[-stats.maxAbsCumulativePnl * 1.1, stats.maxAbsCumulativePnl * 1.1]}
                tickFormatter={(value) => `$${compactNumber(value, 1)}`}
                mirror={true}
                type="number"
                allowDecimals={false}
                markerWidth={0}
                axisLine={false}
                tickLine={false}
                tickMargin={-6}
              />
              <Bar
                type="monotone"
                minPointSize={1}
                name="PnL"
                stackId="bar"
                unit="$"
                dataKey="pnl"
                fill={themeColors.neutral1}
              >
                {chartData.map((item, i) => {
                  return (
                    <Cell
                      key={`cell-${i}`}
                      fill={item.pnl > 0 ? themeColors.green1 : item.pnl < 0 ? themeColors.red2 : themeColors.neutral4}
                    />
                  )
                })}
              </Bar>
              <Bar
                type="monotone"
                minPointSize={1}
                name="Fees"
                stackId="bar"
                unit="$"
                dataKey="fee"
                fill={`${themeColors.red1}80`}
              >
                {chartData.map((item, i) => {
                  return <Cell key={`cell-${i}`} fill={item.fee < 0 ? `${themeColors.red1}80` : themeColors.neutral4} />
                })}
              </Bar>
              <Line
                type="monotone"
                name="Cumulative PnL"
                unit="$"
                dataKey="cumulativePnl"
                yAxisId="right"
                dot={false}
                stroke={themeColors.orange1}
                strokeWidth={1.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.neutral5,
                  borderColor: themeColors.neutral4,
                  fontSize: '12px',
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
  cumulativePnl: number
  cumulativePnlProfit?: number | null
  cumulativePnlLoss?: number | null
  realisedPnl: number
  unrealisedPnl: number
  pnl: number
  fee: number
  roi: number
}

type TraderPnlStatsData = {
  maxCumulativePnl: number
  maxPnl: number
  maxRoi: number
  minCumulativePnl: number
  minPnl: number
  minRoi: number
  maxAbsCumulativePnl: number
  maxAbsPnl: number
  maxAbsRoi: number
}

function CustomTooltip({ item }: { item: any }) {
  const cumulativePnl = item?.[0]?.payload?.cumulativePnl ?? 0
  const realisedPnl = item?.[0]?.payload?.realisedPnl ?? 0
  const unrealisedPnl = item?.[0]?.payload?.unrealisedPnl ?? 0
  const pnl = item?.[0]?.payload?.pnl ?? 0
  const fee = item?.[0]?.payload?.fee ?? 0
  const getColor = (pnl?: number) => {
    if (!pnl) return 'neutral1'
    return pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'
  }
  return (
    <Flex p={2} bg="neutral6" flexDirection="column" sx={{ gap: 1 }}>
      <Type.Small mb={1}>{formatLocalDate(item?.[0]?.payload?.date, DAYJS_FULL_DATE_FORMAT)}</Type.Small>
      <Type.Small color="orange1">
        Cumulative PnL:{' '}
        <Type.Small color="orange1">
          {cumulativePnl < 0 && '-'}${formatNumber(Math.abs(cumulativePnl), 2)}
        </Type.Small>
      </Type.Small>
      <Type.Small>
        Realized PnL:{' '}
        <Type.Small color={getColor(realisedPnl)}>
          {realisedPnl < 0 && '-'}${formatNumber(Math.abs(realisedPnl), 2)}
        </Type.Small>
      </Type.Small>
      <Type.Small>
        Unrealized PnL:{' '}
        <Type.Small color={getColor(unrealisedPnl)}>
          {unrealisedPnl < 0 && '-'}${formatNumber(Math.abs(unrealisedPnl), 2)}
        </Type.Small>
      </Type.Small>
      <Type.Small>
        PnL:{' '}
        <Type.Small color={getColor(pnl)}>
          {pnl < 0 && '-'}${formatNumber(Math.abs(pnl), 2)}
        </Type.Small>
      </Type.Small>
      <Type.Small>
        Fees: <Type.Small>${formatNumber(Math.abs(fee))}</Type.Small>
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
          cumulativePnl: stats.cumulativePnl,
          cumulativePnlProfit: stats.cumulativePnl >= 0 ? stats.cumulativePnl : null,
          cumulativePnlLoss: stats.cumulativePnl < 0 ? stats.cumulativePnl : null,
          realisedPnl: stats.realisedPnl,
          unrealisedPnl: stats.unrealisedPnl,
          pnl: stats.pnl,
          fee: -stats.fee,
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
    let realisedPnl = 0
    let unrealisedPnl = 0
    let pnl = 0
    let fee = 0
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isSame(cumulativeDate.date)) {
        realisedPnl = cumulativeDate.realisedPnl
        unrealisedPnl = cumulativeDate.unrealisedPnl
        pnl = realisedPnl + unrealisedPnl
        fee = cumulativeDate.fee
      }
    })

    dateArray.push({ date: currentDate.toISOString(), cumulativePnl: 0, realisedPnl, unrealisedPnl, pnl, fee })
    currentDate = currentDate.add(1, 'day')
  }

  const data = dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const result: TraderPnlStatisticData[] = []
  let cumulativePnl = 0
  for (let i = 0; i < data.length; i++) {
    cumulativePnl += data[i].pnl ? data[i].pnl : 0
    result.push({
      cumulativePnl,
      date: data[i].date,
      realisedPnl: data[i].realisedPnl,
      unrealisedPnl: data[i].unrealisedPnl,
      pnl: data[i].pnl,
      fee: data[i].fee,
      percentage: i > 0 && data[i - 1].pnl ? ((data[i].pnl - data[i - 1].pnl) / data[i - 1].pnl) * 100 : 0,
    })
  }

  return result
}
