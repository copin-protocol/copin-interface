import dayjs from 'dayjs'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import React, { useMemo } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { CopyTradeChartData, CopyTradeStatsData } from 'entities/chart.d'
import { CopyTradePnL } from 'entities/copyTrade.d'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT, FONT_FAMILY } from 'utils/config/constants'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

export default function BarChartCopierRoi({
  data,
  isLoading,
  from,
  to,
}: {
  data?: CopyTradePnL[]
  isLoading: boolean
  from: number
  to: number
}) {
  const generateData = useMemo(() => (data ? generateChartDailyROI(from, to, data) : []), [data, from, to])
  const chartData = useMemo(() => (data ? getChartData({ data: generateData }) : []), [data, generateData])

  const stats = useMemo(() => {
    let stats
    if (data && chartData) {
      const maxRoi = maxBy(chartData, (item) => item.roi)?.roi ?? 0
      const minRoi = minBy(chartData, (item) => item.roi)?.roi ?? 0

      stats = {
        maxRoi,
        minRoi,
        maxAbsRoi: Math.max(Math.abs(maxRoi), Math.abs(minRoi)),
      } as CopyTradeStatsData
    }

    return stats
  }, [data, chartData])

  return (
    <>
      {isLoading && <Loading />}
      {chartData && stats && (
        <Box
          sx={{
            '.recharts-cartesian-axis-tick': {
              text: {
                fill: 'neutral3',
                fontSize: '12px',
              },
            },
          }}
        >
          <ResponsiveContainer minHeight={200}>
            <ComposedChart data={chartData} margin={{ top: 0, left: 4, right: 16, bottom: 0 }}>
              <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="label" stroke={themeColors.neutral4} />
              <YAxis
                domain={[-stats.maxAbsRoi * 1.2, stats.maxAbsRoi * 1.2]}
                stroke={themeColors.neutral4}
                tickFormatter={(value) => `${formatNumber(value, 2, 2)}%`}
                ticks={[-stats.maxAbsRoi * 1.2, 0, stats.maxAbsRoi * 1.2]}
              />
              <Bar type="monotone" name="ROI" unit="%" dataKey="roi" fill={themeColors.neutral1}>
                {chartData.map((item, i) => {
                  return <Cell key={`cell-${i}`} fill={item.roi > 0 ? themeColors.green1 : themeColors.red2} />
                })}
              </Bar>
              {/*<Legend />*/}
              {/*<ReferenceLine y={0} stroke={themeColors.neutral5} />*/}
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.neutral5,
                  borderColor: 'transparent',
                  fontSize: '12px',
                  fontFamily: FONT_FAMILY,
                }}
                content={(payload) => <CustomTooltip item={payload.payload} />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
    </>
  )
}

function CustomTooltip({ item }: { item: any }) {
  const pnl = item?.[0]?.payload?.pnl ?? 0
  const roi = item?.[0]?.payload?.roi ?? 0
  const color = pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'
  return (
    <Flex p={2} bg="neutral5" flexDirection="column" sx={{ gap: 1 }}>
      <Type.Small mb={1}>{formatLocalDate(item?.[0]?.payload?.date, DAYJS_FULL_DATE_FORMAT)}</Type.Small>
      <Type.Small>
        ROI: <Type.Small color={color}>{formatNumber(roi, 2, 2)}%</Type.Small>
      </Type.Small>
      <Type.Small>
        PnL:{' '}
        <Type.Small color={color}>
          {pnl < 0 && '-'}${formatNumber(Math.abs(pnl), 2, 2)}
        </Type.Small>
      </Type.Small>
    </Flex>
  )
}

function getChartData({ data }: { data: CopyTradePnL[] | undefined }) {
  let chartData: CopyTradeChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    chartData = data
      .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
      .map((stats) => {
        const pnl = stats.amount
        const roi = stats.roi
        return {
          label: formatLocalDate(stats.date, 'MM/DD'),
          date: stats.date,
          pnl,
          roi,
        } as CopyTradeChartData
      })
  }

  return chartData
}

function generateChartDailyROI(fromDate: number, toDate: number, cumulativeDates: CopyTradePnL[]) {
  const dateArray: CopyTradePnL[] = []
  let currentDate = dayjs(fromDate).utc().startOf('day')

  while (currentDate.isSame(toDate) || currentDate.isBefore(toDate)) {
    let amount = 0
    let roi = 0
    if (dateArray.length > 0) {
      amount = dateArray[dateArray.length - 1].amount
      roi = dateArray[dateArray.length - 1].roi
    }
    cumulativeDates.forEach((cumulativeDate) => {
      if (currentDate.isSame(cumulativeDate.date)) {
        amount = cumulativeDate.amount
        roi = cumulativeDate.roi
      }
    })

    dateArray.push({ date: currentDate.toISOString(), amount, roi })
    currentDate = currentDate.add(1, 'day')
  }

  const data = dateArray
    .filter((e) => dayjs(e.date).utc().isSame(fromDate) || dayjs(e.date).utc().isAfter(fromDate))
    .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
  const result: CopyTradePnL[] = []
  for (let i = 0; i < data.length - 1; i++) {
    result.push({
      date: data[i + 1].date,
      roi: data[i].amount ? ((data[i + 1].amount - data[i].amount) / data[i].amount) * 100 : 0,
      amount: data[i].amount ? data[i + 1].amount - data[i].amount : 0,
    })
  }

  return result
}
