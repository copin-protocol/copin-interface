import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StackOffsetType } from 'recharts/types/util/types'

import { StatisticChartData, StatsData } from 'entities/chart'
import { CopyStatisticData } from 'entities/statistic'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { Box, Li, Type } from 'theme/base'
import colors from 'theme/colors'
import { Colors } from 'theme/types'
import { CHART_DATE_FORMAT, CHART_MIN_HEIGHT, MIN_TICK_GAP, YAXIS_WIDTH } from 'utils/config/constants'
import { compactNumber, formatLocalDate, formatNumber } from 'utils/helpers/format'

export function NetProfitChartComponent({
  data,
  stats,
  syncId,
}: {
  data: StatisticChartData[]
  stats: StatsData
  syncId?: string
}) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper
      data={data}
      colors={_colors}
      syncId={syncId}
      legend={
        <>
          <Li color="neutral2">
            <Type.Caption>
              <Trans>Considers settled (closed) positions</Trans>
            </Type.Caption>
          </Li>
          <Li color="neutral2">
            <Type.Caption>
              <Trans>Fees are not factored into PnL</Trans>
            </Type.Caption>
          </Li>
        </>
      }
    >
      <YAxis
        domain={[-stats.maxAbsCumulativePnl * 1.05, stats.maxAbsCumulativePnl * 1.05]}
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        ticks={[-stats.maxAbsCumulativePnl * 1.05, 0, stats.maxAbsCumulativePnl * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-stats.maxAbsPnl * 1.05, stats.maxAbsPnl * 1.05]}
        width={YAXIS_WIDTH}
        stroke={_colors.neutral4}
        ticks={[-stats.maxAbsPnl * 1.05, 0, stats.maxAbsPnl * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Net PnL" unit="$" dataKey="pnl" fill={_colors.neutral1}>
        {data.map((item, i) => {
          return <Cell key={`cell-${i}`} fill={item.pnl > 0 ? _colors.green1 : _colors.red2} />
        })}
      </Bar>
      <Line
        type="monotone"
        name="Cumulative PnL"
        unit="$"
        dataKey="pnlCumulative"
        yAxisId="right"
        dot={false}
        stroke={_colors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function ProfitLossChartComponent({
  data,
  stats,
  syncId,
  isPercentView,
}: {
  data: StatisticChartData[]
  stats: StatsData
  syncId?: string
  isPercentView?: boolean
}) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper
      data={data}
      colors={_colors}
      syncId={syncId}
      stackOffset="sign"
      legend={
        <>
          <Li color="neutral2">
            <Type.Caption>
              <Trans>Considers settled (closed) positions</Trans>
            </Type.Caption>
          </Li>
          <Li color="neutral2">
            <Type.Caption>
              <Trans>Fees are not factored into PnL</Trans>
            </Type.Caption>
          </Li>
        </>
      }
    >
      {isPercentView ? (
        <YAxis
          dataKey="profitPercent"
          width={YAXIS_WIDTH}
          stroke={_colors.neutral4}
          tickFormatter={(value) => `${formatNumber(value, 1, 1)}%`}
        />
      ) : (
        <YAxis
          domain={[-stats.maxProfitLoss * 1.05, stats.maxProfitLoss * 1.05]}
          width={YAXIS_WIDTH}
          stroke={_colors.neutral4}
          ticks={[-stats.maxProfitLoss * 1.05, 0, stats.maxProfitLoss * 1.05]}
          tickFormatter={(value) => `$${compactNumber(value, 1)}`}
        />
      )}
      <YAxis
        domain={[-stats.maxProfitLoss * 1.05, stats.maxProfitLoss * 1.05]}
        width={YAXIS_WIDTH}
        stroke={_colors.neutral4}
        ticks={[-stats.maxProfitLoss * 1.05, 0, stats.maxProfitLoss * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-stats.maxCumulativeProfitLoss * 1.1, stats.maxCumulativeProfitLoss * 1.1]}
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        ticks={[-stats.maxCumulativeProfitLoss * 1.1, 0, stats.maxCumulativeProfitLoss * 1.1]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      {!isPercentView && (
        <>
          <Area
            yAxisId="right"
            type="monotone"
            strokeWidth={0}
            stroke={_colors.red2}
            fill={_colors.red2}
            fillOpacity="0.4"
            dataKey="lossCumulative"
            name="Cumulative Loss"
            isAnimationActive={false}
            unit="$"
          />
          <Area
            yAxisId="right"
            type="monotone"
            strokeWidth={0}
            stroke={_colors.green1}
            fill={_colors.green1}
            fillOpacity="0.4"
            dataKey="profitCumulative"
            name="Cumulative Profit"
            isAnimationActive={false}
            unit="$"
          />
        </>
      )}
      {isPercentView ? (
        <>
          <Bar
            unit={'%'}
            type="monotone"
            stackId="b"
            fill={_colors.red2}
            dataKey="lossPercent"
            name="Loss"
            isAnimationActive={false}
          />
          <Bar
            unit={'%'}
            type="monotone"
            stackId="b"
            fill={_colors.green1}
            dataKey="profitPercent"
            name="Profit"
            isAnimationActive={false}
          />
        </>
      ) : (
        <>
          <Bar
            stackId="pnl"
            unit={'$'}
            type="monotone"
            fill={_colors.green1}
            dataKey="totalProfit"
            name="Profit"
            isAnimationActive={false}
          />
          <Bar
            stackId="pnl"
            unit={'$'}
            type="monotone"
            fill={_colors.red2}
            dataKey="totalLoss"
            name="Loss"
            isAnimationActive={false}
          />
        </>
      )}
    </ChartComponentWrapper>
  )
}

export function CopierChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper data={data} colors={_colors} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis width={YAXIS_WIDTH} stroke={_colors.neutral4} tickFormatter={(value) => `${compactNumber(value, 0)}`} />
      <Bar
        // stackId="copier"
        type="monotone"
        name="Total Copier Active"
        dataKey="totalActiveCopier"
        fill={_colors.primary1}
      />
      <Bar
        // stackId="copier"
        type="monotone"
        name="Total Copier Inactive"
        dataKey="totalInactiveCopier"
        fill={_colors.primary2}
      />
      <Line
        type="monotone"
        name="Cumulative Copier"
        dataKey="totalCopier"
        yAxisId="right"
        dot={false}
        stroke={_colors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function CopyTradeChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper colors={_colors} data={data} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis width={YAXIS_WIDTH} stroke={_colors.neutral4} tickFormatter={(value) => `${compactNumber(value, 0)}`} />
      <Bar
        // stackId="copyTrade"
        type="monotone"
        name="Total Copy Trade Active"
        dataKey="totalActiveCopyTrade"
        fill={_colors.primary1}
      />
      <Bar
        // stackId="copyTrade"
        type="monotone"
        name="Total Copy Trade Inactive"
        dataKey="totalInactiveCopyTrade"
        fill={_colors.primary2}
      />
      <Line
        type="monotone"
        name="Cumulative Copy Trade"
        dataKey="totalCopyTrade"
        yAxisId="right"
        dot={false}
        stroke={_colors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function OrderChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper colors={_colors} data={data} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis width={YAXIS_WIDTH} stroke={_colors.neutral4} tickFormatter={(value) => `${compactNumber(value, 0)}`} />
      <Bar type="monotone" name="Total Order" dataKey="totalOrder" fill={_colors.primary1} />
      <Line
        type="monotone"
        name="Cumulative Order"
        dataKey="orderCumulative"
        yAxisId="right"
        dot={false}
        stroke={_colors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function VolumeChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper colors={_colors} data={data} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={_colors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis width={YAXIS_WIDTH} stroke={_colors.neutral4} tickFormatter={(value) => `$${compactNumber(value, 1)}`} />
      <Bar type="monotone" name="Total Volume" unit="$" dataKey="totalVolume" fill={_colors.primary1} />
      <Line
        type="monotone"
        name="Cumulative Volume"
        unit="$"
        dataKey="volumeCumulative"
        yAxisId="right"
        dot={false}
        stroke={_colors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function TraderChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  const _colors = colors(true)

  return (
    <ChartComponentWrapper
      colors={_colors}
      data={data}
      syncId={syncId}
      legend={
        <>
          <Li color="neutral2">
            <Type.Caption>
              <Trans>Unique traders are copied in the system</Trans>
            </Type.Caption>
          </Li>
        </>
      }
    >
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        stroke={_colors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <Bar
        // stackId="copier"
        type="monotone"
        name="Total Unique Trader"
        dataKey="totalDistinctTrader"
        fill={_colors.primary1}
      />
    </ChartComponentWrapper>
  )
}

function ChartComponentWrapper({
  data,
  colors,
  children,
  legend,
  syncId,
  stackOffset,
}: {
  data: StatisticChartData[]
  colors: Colors
  children: ReactNode
  legend?: ReactNode
  syncId?: string
  stackOffset?: StackOffsetType
}) {
  return (
    <Box>
      <Box
        sx={{
          '.recharts-cartesian-axis-tick': {
            text: {
              fill: 'neutral3',
            },
          },
          fontSize: isMobile ? 12 : 16,
        }}
      >
        <ResponsiveContainer minHeight={CHART_MIN_HEIGHT}>
          <ComposedChart
            stackOffset={stackOffset}
            data={data}
            margin={{ top: 4, left: 4, right: 4, bottom: 4 }}
            syncId={syncId}
          >
            <CartesianGrid stroke={colors.neutral4} strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="date" stroke={colors.neutral4} minTickGap={MIN_TICK_GAP} />
            {children}
            <Legend />
            <Tooltip
              offset={isMobile ? 100 : 20}
              contentStyle={{
                backgroundColor: colors.neutral8,
                borderColor: 'transparent',
              }}
              formatter={tooltipFormatter}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      <Box mb={3} />
      {legend}
    </Box>
  )
}

function tooltipFormatter(value: any, index: any, item: any) {
  const _value = value as number
  if (item.unit === '%') return formatNumber(_value, 1)
  return formatNumber(_value, _value < 1 && _value > -1 ? 1 : 0)
}

export function getChartData({ data }: { data: CopyStatisticData[] | undefined }) {
  let chartData: StatisticChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    // Data for Volume Chart
    let volumeCumulative = 0
    let orderCumulative = 0

    // Data for Profit & Loss Chart
    let pnlCumulative = 0
    let profitCumulative = 0
    let lossCumulative = 0

    // Data for Copy Statistic Chart
    let copierCumulative = 0
    let copierActiveCumulative = 0
    let copyTradeCumulative = 0
    let copyTradeActiveCumulative = 0

    chartData = data
      // .sort((x, y) => (x.statisticAt < y.statisticAt ? -1 : x.statisticAt > y.statisticAt ? 1 : 0))
      .map((stats) => {
        // Volume Chart
        volumeCumulative += stats.totalVolume
        orderCumulative += stats.totalOrder

        // Profit & Loss Chart
        const pnl = stats.totalProfit + stats.totalLoss
        const absPnl = Math.abs(stats.totalProfit) + Math.abs(stats.totalLoss)
        profitCumulative += stats.totalProfit
        lossCumulative += stats.totalLoss
        pnlCumulative += pnl

        // Copy Statistic Chart
        const totalCopier = stats.totalActiveCopier + stats.totalInactiveCopier
        const totalCopyTrade = stats.totalActiveCopyTrade + stats.totalInactiveCopyTrade
        copierCumulative += totalCopier
        copierActiveCumulative += stats.totalActiveCopier
        copyTradeCumulative += totalCopyTrade
        copyTradeActiveCumulative += stats.totalActiveCopyTrade

        return {
          date: formatLocalDate(stats.statisticAt, CHART_DATE_FORMAT),
          // Volume Chart
          volumeCumulative,
          orderCumulative,
          totalVolume: stats.totalVolume,
          totalOrder: stats.totalOrder,
          // Profit & Loss Chart
          pnl,
          pnlCumulative,
          profitCumulative,
          lossCumulative,
          totalProfit: stats.totalProfit,
          totalLoss: stats.totalLoss,
          profitPercent: absPnl > 0 ? (stats.totalProfit / absPnl) * 100 : 0,
          lossPercent: absPnl > 0 ? (Math.abs(stats.totalLoss) / absPnl) * 100 : 0,
          // Copy Statistic Chart
          copierCumulative,
          copierActiveCumulative,
          copyTradeCumulative,
          copyTradeActiveCumulative,
          totalCopier,
          totalCopyTrade,
          totalActiveCopier: stats.totalActiveCopier,
          totalInactiveCopier: stats.totalInactiveCopier,
          totalActiveCopyTrade: stats.totalActiveCopyTrade,
          totalInactiveCopyTrade: stats.totalInactiveCopyTrade,
          totalDistinctTrader: stats.totalDistinctTrader,
        } as StatisticChartData
      })
  }

  return chartData
}
