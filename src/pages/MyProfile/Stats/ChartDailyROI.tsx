import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import React, { useMemo } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { CopyTradeChartData, CopyTradeStatsData } from 'entities/chart.d'
import { CopyTradePnL } from 'entities/copyTrade.d'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

import { generateChartDailyROI } from './generateChartData'

export default function ChartDailyROI({
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
                fontSize: '13px',
              },
            },
          }}
        >
          <ResponsiveContainer minHeight={200}>
            <ComposedChart data={chartData} margin={{ top: 0, left: 4, right: 16, bottom: 0 }}>
              <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="date" stroke={themeColors.neutral4} />
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
                  fontSize: '14px',
                  fontFamily: FONT_FAMILY,
                }}
                formatter={tooltipFormatter}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
    </>
  )
}

function tooltipFormatter(value: any) {
  const _value = value as number
  return formatNumber(_value, 2, 2)
}

function getChartData({ data }: { data: CopyTradePnL[] | undefined }) {
  let chartData: CopyTradeChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    chartData = data
      .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0))
      .map((stats) => {
        const roi = stats.amount
        return {
          date: formatLocalDate(stats.date, 'MM/DD'),
          roi,
        } as CopyTradeChartData
      })
  }

  return chartData
}
