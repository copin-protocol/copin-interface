import React, { ReactNode } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StackOffsetType } from 'recharts/types/util/types'

import { PerpDexChartData, StatsData } from 'entities/chart'
import { PerpDexStatisticData } from 'entities/statistic'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import { DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatLocalDate, formatNumber } from 'utils/helpers/format'

import {
  ActiveUserTooltip,
  DailyVolumeTooltip,
  LiquidationTooltip,
  NetProfitTooltip,
  ProfitLossTooltip,
  RevenueTooltip,
} from './chartConfig'

const CHART_DATE_FORMAT = 'DD.MM'
const CHART_MIN_HEIGHT = 260
const YAXIS_WIDTH = isMobile ? 50 : 50
const STROKE_WIDTH = 0.5
const MIN_TICK_GAP = 30

export function VolumeChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={DailyVolumeTooltip}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.orange1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Daily Volume" unit="$" dataKey="volume" fill="#7AA6FF" />
      <Area
        type="monotone"
        name="Cumulative Volume"
        unit="$"
        dataKey="volumeCumulative"
        yAxisId="right"
        stroke={themeColors.orange1}
        strokeWidth={STROKE_WIDTH}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ChartComponentWrapper>
  )
}

export function TraderChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={ActiveUserTooltip}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.orange1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 1)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Active Users" dataKey="traders" fill="#CFDDFC" />
      <Area
        type="monotone"
        name="Total Users"
        dataKey="traderCumulative"
        yAxisId="right"
        stroke={themeColors.orange1}
        strokeWidth={STROKE_WIDTH}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ChartComponentWrapper>
  )
}

export function RevenueChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={RevenueTooltip}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.orange1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Daily Revenue" unit="$" dataKey="revenue" fill="#C286F0" />
      <Area
        type="monotone"
        name="Cumulative Revenue"
        unit="$"
        dataKey="revenueCumulative"
        yAxisId="right"
        stroke={themeColors.orange1}
        strokeWidth={STROKE_WIDTH}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ChartComponentWrapper>
  )
}

export function LiquidationChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={LiquidationTooltip}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.orange1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar
        type="monotone"
        name="Long"
        unit="$"
        dataKey="longLiquidations"
        stackId="liquidations"
        fill={themeColors.green2}
      />
      <Bar
        type="monotone"
        name="Short"
        unit="$"
        dataKey="shortLiquidations"
        stackId="liquidations"
        fill={themeColors.red1}
      />
      <Area
        type="monotone"
        name="Cumulative Liquidations"
        unit="$"
        dataKey="liquidationCumulative"
        yAxisId="right"
        stroke={themeColors.orange1}
        strokeWidth={STROKE_WIDTH}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ChartComponentWrapper>
  )
}

export function NetProfitChartComponent({
  data,
  stats,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  stats: StatsData | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={NetProfitTooltip}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.orange1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        domain={[-(stats?.maxAbsCumulativePnl ?? 0) * 1.05, (stats?.maxAbsCumulativePnl ?? 0) * 1.05]}
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        ticks={[-(stats?.maxAbsCumulativePnl ?? 0) * 1.05, 0, (stats?.maxAbsCumulativePnl ?? 0) * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-(stats?.maxAbsPnl ?? 0) * 1.05, (stats?.maxAbsPnl ?? 0) * 1.05]}
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        ticks={[-(stats?.maxAbsPnl ?? 0) * 1.05, 0, (stats?.maxAbsPnl ?? 0) * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Daily Net PnL" unit="$" dataKey="traderPnl" fill={themeColors.neutral1}>
        {data?.map((item, i) => {
          return <Cell key={`cell-${i}`} fill={item.traderPnl > 0 ? themeColors.green2 : themeColors.red1} />
        })}
      </Bar>
      <Area
        type="monotone"
        name="Cumulative Net PnL"
        unit="$"
        dataKey="traderPnlCumulative"
        yAxisId="right"
        stroke={themeColors.orange1}
        strokeWidth={STROKE_WIDTH}
        fillOpacity={1}
        fill="url(#colorUv)"
      />
    </ChartComponentWrapper>
  )
}

export function ProfitLossChartComponent({
  data,
  stats,
  syncId,
  isExpanded,
}: {
  data: PerpDexChartData[] | undefined
  stats: StatsData | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  return (
    <ChartComponentWrapper
      isExpanded={isExpanded}
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={ProfitLossTooltip}
      stackOffset="sign"
    >
      <defs>
        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.green2} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={themeColors.red1} stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <YAxis
        domain={[-(stats?.maxProfitLoss ?? 0) * 1.05, (stats?.maxProfitLoss ?? 0) * 1.05]}
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        ticks={[-(stats?.maxProfitLoss ?? 0) * 1.05, 0, (stats?.maxProfitLoss ?? 0) * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-(stats?.maxCumulativeProfitLoss ?? 0) * 1.1, (stats?.maxCumulativeProfitLoss ?? 0) * 1.1]}
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        ticks={[-(stats?.maxCumulativeProfitLoss ?? 0) * 1.1, 0, (stats?.maxCumulativeProfitLoss ?? 0) * 1.1]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Area
        yAxisId="right"
        type="monotone"
        strokeWidth={STROKE_WIDTH}
        stroke={themeColors.red1}
        fill="url(#colorRed)"
        fillOpacity={1}
        dataKey="traderLossCumulative"
        name="Cumulative Loss"
        isAnimationActive={false}
        unit="$"
      />
      <Area
        yAxisId="right"
        type="monotone"
        strokeWidth={STROKE_WIDTH}
        stroke={themeColors.green2}
        fill="url(#colorGreen)"
        fillOpacity={1}
        dataKey="traderProfitCumulative"
        name="Cumulative Profit"
        isAnimationActive={false}
        unit="$"
      />
      <Bar
        stackId="pnl"
        unit={'$'}
        type="monotone"
        fill={themeColors.green2}
        dataKey="traderProfit"
        name="Profit"
        isAnimationActive={false}
      />
      <Bar
        stackId="pnl"
        unit={'$'}
        type="monotone"
        fill={themeColors.red1}
        dataKey="traderLoss"
        name="Loss"
        isAnimationActive={false}
      />
    </ChartComponentWrapper>
  )
}

function ChartComponentWrapper({
  data,
  colors,
  children,
  externalLegend,
  legend,
  tooltip,
  syncId,
  stackOffset,
  isExpanded = false,
}: {
  data: PerpDexChartData[] | undefined
  colors: Colors
  children: ReactNode
  externalLegend?: ReactNode
  legend?: any
  tooltip?: any
  syncId?: string
  stackOffset?: StackOffsetType
  isExpanded?: boolean
}) {
  return (
    <Box mt={2}>
      <Box
        sx={{
          '.recharts-cartesian-axis-tick': {
            text: {
              fill: 'neutral3',
            },
          },
          fontSize: isMobile ? 10 : 10,
        }}
      >
        <ResponsiveContainer minHeight={isExpanded ? 'calc(100vh - 316px)' : CHART_MIN_HEIGHT}>
          <ComposedChart
            stackOffset={stackOffset}
            data={data}
            // margin={{ top: 4, left: 4, right: 4, bottom: 4 }}
            syncId={syncId}
          >
            <CartesianGrid stroke={colors.neutral4} strokeDasharray="3 3" opacity={0.4} />
            <XAxis dataKey="date" stroke={colors.neutral4} minTickGap={MIN_TICK_GAP} />
            {children}
            <Legend content={legend} />
            <Tooltip
              offset={isMobile ? 100 : 20}
              content={tooltip}
              contentStyle={{
                backgroundColor: colors.neutral5,
                borderColor: 'transparent',
              }}
              formatter={tooltipFormatter}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      {externalLegend ? <Box mt={3}>{externalLegend}</Box> : <></>}
    </Box>
  )
}

function tooltipFormatter(value: any, index: any, item: any) {
  const _value = value as number
  if (item.unit === '%') return formatNumber(_value, 1)
  return formatNumber(_value, _value < 1 && _value > -1 ? 1 : 0)
}

export function getChartData({ data }: { data: PerpDexStatisticData[] | undefined }) {
  let chartData: PerpDexChartData[] = []
  if (!data) return chartData
  if (data && data.length > 0) {
    // Data for Volume Chart
    let volumeCumulative = 0

    // Data for Active User Chart
    // let traderCumulative = 0

    // Data for Trader Chart
    let revenueCumulative = 0

    // Data for Liquidation Chart
    let liquidationCumulative = 0

    // Data for Net PnL Chart
    let traderPnlCumulative = 0

    // Data for Net PnL Chart
    let traderProfitCumulative = 0
    let traderLossCumulative = 0

    chartData = data
      // .sort((x, y) => (x.statisticAt < y.statisticAt ? -1 : x.statisticAt > y.statisticAt ? 1 : 0))
      .map((stats) => {
        // Volume Chart
        volumeCumulative += stats.volume
        // Volume Chart
        const traderCumulative = stats.totalTraders
        // Volume Chart
        revenueCumulative += stats.revenue
        // Liquidation Chart
        liquidationCumulative += stats.liquidations
        // Net PnL Chart
        traderPnlCumulative += stats.traderPnl
        // Profit & Loss Chart
        traderProfitCumulative += stats.traderProfit
        traderLossCumulative += stats.traderLoss

        const formattedData: PerpDexChartData = {
          date: formatLocalDate(stats.statisticAt, CHART_DATE_FORMAT),
          dateTime: formatLocalDate(stats.statisticAt, DATE_FORMAT),
          perpdex: stats.perpdex,
          perpdexName: stats.perpdexName,
          // Volume Chart
          volume: stats.volume,
          volumeCumulative,
          // Active User Chart
          traders: stats.traders,
          traderCumulative,
          // Active User Chart
          revenue: stats.revenue,
          revenueCumulative,
          // Liquidation Chart
          longLiquidations: stats.longLiquidations,
          shortLiquidations: stats.shortLiquidations,
          liquidations: stats.liquidations,
          liquidationCumulative,
          // Net PnL Chart
          longPnl: stats.longPnl,
          shortPnl: stats.shortPnl,
          traderPnl: stats.traderPnl,
          traderPnlCumulative,
          // Profit & Loss Chart
          traderProfit: stats.traderProfit,
          traderLoss: stats.traderLoss,
          traderProfitCumulative,
          traderLossCumulative,
        }

        return formattedData
      })
  }

  return chartData
}
