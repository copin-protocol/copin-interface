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

import { PerpDexChartData, StatsData, TopPairChartData } from 'entities/chart'
import { PerpDexHourlyStatistic, PerpDexStatisticData } from 'entities/statistic'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { useHourlyChartStore } from 'hooks/store/useSwitchHourlyChart'
import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import {
  DATE_FORMAT,
  ORDERS_CHART_GRADIENTS,
  TRADERS_CHART_GRADIENTS,
  VOLUME_CHART_GRADIENTS,
} from 'utils/config/constants'
import { compactNumber, formatLocalDate, formatNumber } from 'utils/helpers/format'

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

export interface DataPoint {
  day: number
  hour: number
  value: number
}
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

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
  const gradients = getGradientColorsByOption(chartOption.id)

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

// Format data by pair statistics
export function getPairChartDataByMetric({
  data,
  metric,
  sortType = 'asc',
  top,
}: {
  data: PerpDexStatisticData[] | undefined
  metric?: 'volume' | 'totalPnl' | 'totalOi' | 'totalProfit' | 'totalLoss' | 'longProfit'
  sortType?: 'asc' | 'desc'
  top?: number
}) {
  const chartData: TopPairChartData[] = []
  if (!data) return chartData
  // Aggregate data by pair
  const pairAggregates: { [pair: string]: TopPairChartData } = {}
  data.forEach((entry) => {
    for (const [pair, stats] of Object.entries(entry.pairStatistics)) {
      if (!pairAggregates[pair]) {
        pairAggregates[pair] = {
          pair,
          volume: 0,
          longPnl: 0,
          shortPnl: 0,
          totalPnl: 0,
          longOi: 0,
          shortOi: 0,
          totalOi: 0,
          longProfit: 0,
          shortProfit: 0,
          totalProfit: 0,
          longLoss: 0,
          shortLoss: 0,
          totalLoss: 0,
        }
      }
      pairAggregates[pair].volume += stats.volume ? stats.volume : 0
      pairAggregates[pair].longPnl += stats.longPnl ? stats.longPnl : 0
      pairAggregates[pair].shortPnl += stats.shortPnl ? stats.shortPnl : 0
      pairAggregates[pair].totalPnl += stats.longPnl + stats.shortPnl
      pairAggregates[pair].longOi += stats.longOi ? stats.longOi : 0
      pairAggregates[pair].shortOi += stats.shortOi ? stats.shortOi : 0
      pairAggregates[pair].totalOi += stats.longOi + stats.shortOi
      pairAggregates[pair].longProfit += stats.longProfit ? stats.longProfit : 0
      pairAggregates[pair].shortProfit += stats.shortProfit ? stats.shortProfit : 0
      pairAggregates[pair].totalProfit +=
        (stats.longProfit ? stats.longProfit : 0) + (stats.shortProfit ? stats.shortProfit : 0)
      pairAggregates[pair].longLoss += stats.longLoss ? stats.longLoss : 0
      pairAggregates[pair].shortLoss += stats.shortLoss ? stats.shortLoss : 0
      pairAggregates[pair].totalLoss += (stats.longLoss ? stats.longLoss : 0) + (stats.shortLoss ? stats.shortLoss : 0)
    }
  })

  // Convert aggregates to an array of TopPairChartData
  const pairData: TopPairChartData[] = Object.entries(pairAggregates)
    .map(([pair, stats]) => ({
      pair: pair.split('-')?.[0] ?? pair,
      volume: stats.volume,
      longPnl: stats.longPnl,
      shortPnl: stats.shortPnl,
      totalPnl: stats.totalPnl,
      longOi: stats.longOi,
      shortOi: stats.shortOi,
      totalOi: stats.totalOi,
      backgroundColor:
        stats.longOi > stats.shortOi
          ? themeColors.green2
          : stats.longOi < stats.shortOi
          ? themeColors.red1
          : themeColors.neutral4,
      longProfit: stats.longProfit,
      shortProfit: stats.shortProfit,
      totalProfit: stats.totalProfit,
      longLoss: stats.longLoss,
      shortLoss: stats.shortLoss,
      totalLoss: stats.totalLoss,
    }))
    .filter((pair) => {
      switch (metric) {
        case 'volume':
          return pair.volume > 0
        case 'totalOi':
          return pair.longOi > 0 || pair.shortOi > 0
        case 'totalProfit':
          return pair.totalProfit > 0 || pair.totalLoss < 0
        default:
          return true
      }
    })

  // Sort the data by the specified metric
  const sortedPairs = metric ? pairData.sort((a, b) => (b[metric] || 0) - (a[metric] || 0)) : pairData

  // If no top is specified, return full data
  if (!top) {
    return sortedPairs
  }

  // Get the top N pairs
  const topPairs = sortedPairs
    .slice(0, top)
    .map((item, index) => ({ ...item, top: index + 1 }))
    .sort((a, b) =>
      metric ? (sortType === 'desc' ? (b[metric] || 0) - (a[metric] || 0) : (a[metric] || 0) - (b[metric] || 0)) : 0
    )

  // Calculate the cumulative data for "OTHERS"
  // const others = sortedPairs.slice(top).reduce(
  //   (acc, item) => {
  //     acc.volume += item.volume
  //     acc.longPnl += item.longPnl
  //     acc.shortPnl += item.shortPnl
  //     acc.totalPnl += item.totalPnl
  //     acc.longOi += item.longOi
  //     acc.shortOi += item.shortOi
  //     acc.totalOi += item.totalOi
  //     acc.longProfit += item.longProfit
  //     acc.shortProfit += item.shortProfit
  //     acc.totalProfit += item.totalProfit
  //     acc.longLoss += item.longLoss
  //     acc.shortLoss += item.shortLoss
  //     acc.totalLoss += item.totalLoss
  //     return acc
  //   },
  //   {
  //     volume: 0,
  //     longPnl: 0,
  //     shortPnl: 0,
  //     totalPnl: 0,
  //     longOi: 0,
  //     shortOi: 0,
  //     totalOi: 0,
  //     longProfit: 0,
  //     shortProfit: 0,
  //     totalProfit: 0,
  //     longLoss: 0,
  //     shortLoss: 0,
  //     totalLoss: 0,
  //   }
  // )

  // Add the "OTHERS" entry if applicable
  // if (top > 0 && metric && others?.[metric] > 0) {
  //   topPairs = [
  //     {
  //       pair: 'OTHERS',
  //       top: 0,
  //       volume: others.volume,
  //       longPnl: others.longPnl,
  //       shortPnl: others.shortPnl,
  //       totalPnl: others.totalPnl,
  //       longOi: others.longOi,
  //       shortOi: others.shortOi,
  //       totalOi: others.totalOi,
  //       backgroundColor:
  //         others.longOi > others.shortOi
  //           ? themeColors.green2
  //           : others.longOi < others.shortOi
  //           ? themeColors.red1
  //           : themeColors.neutral4,
  //       longProfit: others.longProfit,
  //       shortProfit: others.shortProfit,
  //       totalProfit: others.totalProfit,
  //       longLoss: others.longLoss,
  //       shortLoss: others.shortLoss,
  //       totalLoss: others.totalLoss,
  //     },
  //     ...topPairs,
  //   ]
  // }

  return topPairs
}

// Format hourly data by metric
export interface HourlyChartData {
  [date: string]: PerpDexHourlyStatistic
}

export function getHourlyChartDataByMetric({
  data,
  metric,
}: {
  data: HourlyChartData | undefined
  metric: string
  // top?: number
}) {
  const chartData: DataPoint[] = []
  const weekdaysData: any = {}
  if (!data) return [] // TODO: refactor later

  // Aggregate data day in a week
  // Monday is 0 and Sunday is 6
  Object.entries(data).forEach(([date, hourlyStats]) => {
    const dayNumber = getWeekDayNumber(date).toString()
    if (!weekdaysData[dayNumber]) {
      weekdaysData[dayNumber] = { ...hourlyStats }
    } else {
      Object.entries(hourlyStats).forEach(([hour, value]) => {
        if (!weekdaysData[dayNumber][hour]) {
          weekdaysData[dayNumber][hour] = value
        } else {
          weekdaysData[dayNumber][hour].volume += value.volume
          weekdaysData[dayNumber][hour].traders += value.traders
          weekdaysData[dayNumber][hour].orders += value.orders
        }
      })
    }
  })

  // Format data for chart
  Object.entries(weekdaysData).forEach(([day, hourlyStats]) => {
    Object.entries(hourlyStats as any).forEach(([hour, value]) => {
      chartData.push({
        day: Number(day),
        hour: Number(hour),
        value: (value as any)[metric],
      })
    })
  })

  return chartData
}

function getWeekDayNumber(dateStr: string): number {
  // Create a Date object from the input string
  const date = new Date(dateStr)

  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const originalDayNumber = date.getDay()

  // Convert to our desired format (0 = Monday, ..., 6 = Sunday)
  return originalDayNumber === 0 ? 6 : originalDayNumber - 1
}

function getFillColor(minRange: number, maxRange: number, gradients: any[], value: number) {
  const rangeStep = (maxRange - minRange) / gradients.length

  for (let i = 0; i < gradients.length; i++) {
    if (value >= maxRange - i * rangeStep) {
      return gradients[i].color
    }
  }
  return gradients[gradients.length - 1].color // return the last color if no match
}

const getGradientColorsByOption = (optionId: string) => {
  switch (optionId) {
    case 'traders':
      return TRADERS_CHART_GRADIENTS
    case 'volume':
      return VOLUME_CHART_GRADIENTS
    case 'orders':
      return ORDERS_CHART_GRADIENTS
    default:
      return TRADERS_CHART_GRADIENTS
  }
}
