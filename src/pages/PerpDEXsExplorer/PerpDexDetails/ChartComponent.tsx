import React, { ReactNode } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { StackOffsetType } from 'recharts/types/util/types'

import { DataPoint, HourlyChartOptionType, PerpDexChartData, StatsData, TopPairChartData } from 'entities/chart'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { useHourlyChartStore } from 'hooks/store/useSwitchHourlyChart'
import {
  ActiveUserTooltip,
  DailyVolumeTooltip,
  HourlyChartTooltip,
  LiquidationTooltip,
  NetProfitTooltip,
  ProfitLossTooltip,
  RevenueTooltip,
  TopOIByPairContent,
  TopOIByPairTooltip,
  TopProfitLossByPairTooltip,
  TopVolumeByPairTooltip,
} from 'pages/PerpDEXsExplorer/PerpDexDetails/chartConfig'
import { getFillColor, getGradientColorsByOption, tooltipFormatter } from 'pages/PerpDEXsExplorer/PerpDexDetails/utils'
import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import { compactNumber } from 'utils/helpers/format'

const CHART_MIN_HEIGHT = 260
const YAXIS_WIDTH = isMobile ? 50 : 50
const STROKE_WIDTH = 0.5
const MIN_TICK_GAP = 30
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

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
      <Bar type="monotone" name="Total PnL" unit="$" dataKey="traderPnl" fill={themeColors.neutral1}>
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

export function TopVolumeByPairChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: TopPairChartData[] | undefined
  syncId?: string
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
          <ComposedChart layout="vertical" data={data} syncId={syncId}>
            <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.4} />
            <XAxis
              type="number"
              stroke={themeColors.neutral4}
              tickFormatter={(value) => `$${compactNumber(value, 1)}`}
            />
            <YAxis
              dataKey="pair"
              type="category"
              scale="auto"
              interval={0}
              tickSize={0}
              tickMargin={4}
              stroke={themeColors.neutral4}
            />
            <Bar type="monotone" name="Volume" unit="$" dataKey="volume" fill="#7AA6FF" />
            <Tooltip
              offset={isMobile ? 100 : 20}
              content={TopVolumeByPairTooltip}
              contentStyle={{
                backgroundColor: themeColors.neutral5,
                borderColor: 'transparent',
              }}
              formatter={tooltipFormatter}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export function TopProfitLossByPairChartComponent({
  data,
  stats,
  syncId,
  isExpanded,
}: {
  data: TopPairChartData[] | undefined
  stats: StatsData | undefined
  syncId?: string
  isExpanded?: boolean
}) {
  const maxProfitLoss = Math.max(Math.abs(stats?.maxLoss ?? 0), Math.abs(stats?.maxProfit ?? 0))
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
          <ComposedChart stackOffset="sign" layout="vertical" data={data} syncId={syncId}>
            <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.4} />
            <XAxis
              type="number"
              domain={[-maxProfitLoss * 1.05, maxProfitLoss * 1.05]}
              width={YAXIS_WIDTH}
              stroke={themeColors.neutral4}
              ticks={[-maxProfitLoss * 1.05, 0, maxProfitLoss * 1.05]}
              tickFormatter={(value) => `$${compactNumber(value, 1)}`}
            />
            <YAxis
              dataKey="pair"
              type="category"
              scale="auto"
              interval={0}
              tickSize={0}
              tickMargin={4}
              stroke={themeColors.neutral4}
            />
            <Bar
              stackId="profitLoss"
              type="monotone"
              name="Profit"
              unit="$"
              dataKey="totalProfit"
              fill={themeColors.green2}
            />
            <Bar
              stackId="profitLoss"
              type="monotone"
              name="Loss"
              unit="$"
              dataKey="totalLoss"
              fill={themeColors.red1}
            />
            <Tooltip
              offset={isMobile ? 100 : 20}
              content={TopProfitLossByPairTooltip}
              contentStyle={{
                backgroundColor: themeColors.neutral5,
                borderColor: 'transparent',
              }}
              formatter={tooltipFormatter}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export function TopOIByPairChartComponent({
  data,
  syncId,
  isExpanded,
}: {
  data: TopPairChartData[] | undefined
  syncId?: string
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
          <Treemap
            data={data}
            dataKey="totalOi"
            aspectRatio={4 / 3}
            stroke={themeColors.neutral7}
            content={<TopOIByPairContent />}
            isAnimationActive={false}
            isUpdateAnimationActive={false}
          >
            <Tooltip
              offset={isMobile ? 100 : 20}
              content={(props: any) => <TopOIByPairTooltip {...props} unit="$" />}
              contentStyle={{
                backgroundColor: themeColors.neutral5,
                borderColor: 'transparent',
              }}
              formatter={tooltipFormatter}
            />
          </Treemap>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

const GradientLegend = ({
  range,
  isExpanded,
  gradientColors,
}: {
  range: number[]
  isExpanded?: boolean
  gradientColors: any[]
}) => {
  const sortedRange = range.sort((a, b) => b - a) // sort in descending order

  const gradientStops = sortedRange.map((value, index) => {
    return { ...gradientColors[index], value }
  })

  if (isExpanded) {
    return null
  }

  return (
    <Box mt={2}>
      <svg width={isMobile ? '48' : '60'} height="220">
        <defs>
          <linearGradient id="legendGradient" x1="0" x2="0" y1="0" y2="1">
            {gradientStops.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity="0.8" />
            ))}
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="10" height="215" fill="url(#legendGradient)" rx="2" ry="2" />
        {gradientStops.map((stop, index) => (
          <text
            key={index}
            x="18"
            y={index * 20 + 15}
            fill={themeColors.neutral3}
            fontSize="12"
            dominantBaseline="middle"
          >
            {compactNumber(stop.value, 1)}
          </text>
        ))}
      </svg>
    </Box>
  )
}

export function HourlyChartComponent({
  data,
  stats,
  isExpanded,
}: {
  data?: DataPoint[]
  stats?: StatsData
  isExpanded?: boolean
}) {
  const { chartOption } = useHourlyChartStore()
  const tooltipTitle = `Total ${chartOption.text}: `
  const gradients = getGradientColorsByOption(chartOption.id as HourlyChartOptionType)

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
        <Flex justifyContent={'center'} sx={{ gap: isMobile ? 1 : 2 }}>
          <ResponsiveContainer minHeight={isExpanded ? 'calc(100vh - 316px)' : CHART_MIN_HEIGHT}>
            <ScatterChart margin={{ top: 20, right: 0, bottom: 20, left: isMobile ? -28 : 0 }}>
              <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.4} />
              <XAxis
                dataKey="hour"
                name="Hour"
                ticks={[0, 4, 8, 12, 16, 20, 23]}
                tickFormatter={(hour) => hours[hour]}
                type="number"
                domain={[0, 24]}
                stroke={themeColors.neutral4}
                tick={{ dy: 10 }}
              />
              <YAxis
                dataKey="day"
                name="Day"
                ticks={[0, 1, 2, 3, 4, 5, 6]}
                tickFormatter={(day) => days[day]}
                type="number"
                domain={[0, 6]}
                tick={{ dx: -10 }}
                interval={0}
                tickSize={0}
                tickMargin={4}
                stroke={themeColors.neutral4}
              />
              <ZAxis dataKey="value" range={[2, 200]} name={chartOption.text} />
              <Tooltip content={<HourlyChartTooltip title={tooltipTitle} />} />
              <Scatter data={data}>
                {data &&
                  stats &&
                  data.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getFillColor(stats?.minHourly, stats?.maxHourly, gradients, item.value)}
                    />
                  ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          {stats && <GradientLegend range={stats.rangeHourly} isExpanded={isExpanded} gradientColors={gradients} />}
        </Flex>
      </Box>
    </Box>
  )
}
