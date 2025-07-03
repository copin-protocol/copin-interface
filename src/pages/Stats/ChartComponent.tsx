import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
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

import { StatisticChartData } from 'entities/chart'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { Box, Flex, Li, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import { CHART_MIN_HEIGHT, EXCHANGE_COLOR, EXCHANGE_STATS, MIN_TICK_GAP, YAXIS_WIDTH } from 'utils/config/constants'
import { PLATFORM_TEXT_TRANS } from 'utils/config/translations'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import { ChartComponentProps } from './types'

export function NetProfitChartComponent({ data, stats, syncId, onChartRenderEnd, id }: ChartComponentProps) {
  return (
    <ChartComponentWrapper
      data={data}
      colors={themeColors}
      syncId={syncId}
      tooltip={DailyNetPnlTooltip}
      legend={DailyNetPnlLegend}
      externalLegend={
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
        stroke={themeColors.neutral4}
        ticks={[-stats.maxAbsCumulativePnl * 1.05, 0, stats.maxAbsCumulativePnl * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-stats.maxAbsPnl * 1.05, stats.maxAbsPnl * 1.05]}
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        ticks={[-stats.maxAbsPnl * 1.05, 0, stats.maxAbsPnl * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <Bar type="monotone" name="Daily Net PnL" unit="$" dataKey="pnl" fill={themeColors.neutral1}>
        {data.map((item, i) => {
          return <Cell key={`cell-${i}`} fill={item.pnl > 0 ? themeColors.green1 : themeColors.red2} />
        })}
      </Bar>
      <Line
        type="monotone"
        name="Cumulative PnL"
        unit="$"
        dataKey="pnlCumulative"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
      />
    </ChartComponentWrapper>
  )
}

export function ProfitLossChartComponent({
  data,
  stats,
  syncId,
  isPercentView,
  id,
  onChartRenderEnd,
}: ChartComponentProps) {
  return (
    <ChartComponentWrapper
      data={data}
      colors={themeColors}
      syncId={syncId}
      stackOffset="sign"
      tooltip={ProfitLossTooltip}
      externalLegend={
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
          stroke={themeColors.neutral4}
          tickFormatter={(value) => `${formatNumber(value, 1, 1)}%`}
        />
      ) : (
        <YAxis
          domain={[-stats.maxProfitLoss * 1.05, stats.maxProfitLoss * 1.05]}
          width={YAXIS_WIDTH}
          stroke={themeColors.neutral4}
          ticks={[-stats.maxProfitLoss * 1.05, 0, stats.maxProfitLoss * 1.05]}
          tickFormatter={(value) => `$${compactNumber(value, 1)}`}
        />
      )}
      <YAxis
        domain={[-stats.maxProfitLoss * 1.05, stats.maxProfitLoss * 1.05]}
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        ticks={[-stats.maxProfitLoss * 1.05, 0, stats.maxProfitLoss * 1.05]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      <YAxis
        domain={[-stats.maxCumulativeProfitLoss * 1.1, stats.maxCumulativeProfitLoss * 1.1]}
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        ticks={[-stats.maxCumulativeProfitLoss * 1.1, 0, stats.maxCumulativeProfitLoss * 1.1]}
        tickFormatter={(value) => `$${compactNumber(value, 1)}`}
      />
      {!isPercentView && (
        <>
          <Area
            yAxisId="right"
            type="monotone"
            strokeWidth={0}
            stroke={themeColors.red2}
            fill={themeColors.red2}
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
            stroke={themeColors.green1}
            fill={themeColors.green1}
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
            fill={themeColors.red2}
            dataKey="lossPercent"
            name="Loss"
            isAnimationActive={false}
          />
          <Bar
            unit={'%'}
            type="monotone"
            stackId="b"
            fill={themeColors.green1}
            dataKey="profitPercent"
            name="Profit"
            isAnimationActive={true}
            onAnimationEnd={() => onChartRenderEnd(id)}
          />
        </>
      ) : (
        <>
          <Bar
            stackId="pnl"
            unit={'$'}
            type="monotone"
            fill={themeColors.green1}
            dataKey="totalProfit"
            name="Profit"
            isAnimationActive={false}
          />
          <Bar
            stackId="pnl"
            unit={'$'}
            type="monotone"
            fill={themeColors.red2}
            dataKey="totalLoss"
            name="Loss"
            isAnimationActive={true}
            onAnimationEnd={() => onChartRenderEnd(id)}
          />
        </>
      )}
    </ChartComponentWrapper>
  )
}

export function CopierChartComponent({ data, syncId, id, onChartRenderEnd }: ChartComponentProps) {
  return (
    <ChartComponentWrapper data={data} colors={themeColors} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <Bar
        // stackId="copier"
        type="monotone"
        name="Active Users"
        dataKey="totalActiveCopier"
        fill={themeColors.primary1}
        isAnimationActive={false}
      />
      {/*<Bar*/}
      {/*  // stackId="copier"*/}
      {/*  type="monotone"*/}
      {/*  name="Total Copier Inactive"*/}
      {/*  dataKey="totalInactiveCopier"*/}
      {/*  fill={themeColors.primary2}*/}
      {/*/>*/}
      <Line
        type="monotone"
        name="Total Users"
        dataKey="totalCopier"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
      />
    </ChartComponentWrapper>
  )
}

export function CopyTradeChartComponent({ data, syncId, id, onChartRenderEnd }: ChartComponentProps) {
  return (
    <ChartComponentWrapper colors={themeColors} data={data} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      {EXCHANGE_STATS.map((exchange, index) => {
        return (
          <Bar
            key={`activeCopyTrade-${index}`}
            name={PLATFORM_TEXT_TRANS[exchange]}
            dataKey={`exchanges.${exchange}.totalActiveCopyTrade`}
            stackId="1"
            fill={EXCHANGE_COLOR[exchange]}
            stroke={EXCHANGE_COLOR[exchange]}
            isAnimationActive={false}
          />
        )
      })}
      {/*<Bar*/}
      {/*  stackId="1"*/}
      {/*  type="monotone"*/}
      {/*  name="Daily Active Copy Trades"*/}
      {/*  dataKey="totalActiveCopyTrade"*/}
      {/*  fill={themeColors.primary1}*/}
      {/*/>*/}
      {/*<Bar*/}
      {/*  // stackId="copyTrade"*/}
      {/*  type="monotone"*/}
      {/*  name="Total Copy Trade Inactive"*/}
      {/*  dataKey="totalInactiveCopyTrade"*/}
      {/*  fill={themeColors.primary2}*/}
      {/*/>*/}
      <Line
        type="monotone"
        name="Cumulative Copy Trades"
        dataKey="totalCopyTrade"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
      />
    </ChartComponentWrapper>
  )
}

export function OrderChartComponent({ data, syncId, id, onChartRenderEnd }: ChartComponentProps) {
  return (
    <ChartComponentWrapper colors={themeColors} data={data} syncId={syncId}>
      <YAxis
        width={YAXIS_WIDTH}
        orientation="right"
        yAxisId="right"
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <YAxis
        width={YAXIS_WIDTH}
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      {/*<Bar type="monotone" name="Daily Orders" dataKey="totalOrder" fill={themeColors.primary1} />*/}
      {EXCHANGE_STATS.map((exchange, index) => {
        return (
          <Bar
            key={`totalOrder-${index}`}
            name={PLATFORM_TEXT_TRANS[exchange]}
            dataKey={`exchanges.${exchange}.totalOrder`}
            stackId="totalOrder"
            fill={EXCHANGE_COLOR[exchange]}
            stroke={EXCHANGE_COLOR[exchange]}
            isAnimationActive={false}
          />
        )
      })}
      <Line
        type="monotone"
        name="Cumulative Orders"
        dataKey="orderCumulative"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
      />
    </ChartComponentWrapper>
  )
}

export function VolumeChartComponent({ data, syncId, id, onChartRenderEnd }: ChartComponentProps) {
  return (
    <ChartComponentWrapper
      colors={themeColors}
      data={data}
      syncId={syncId}
      tooltip={DailyVolumeTooltip}
      legend={DailyVolumeLegend}
    >
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
      {/*<Bar type="monotone" name="Daily Volume" unit="$" dataKey="totalVolume" fill={themeColors.primary1} />*/}
      {EXCHANGE_STATS.map((exchange, index) => {
        return (
          <Bar
            key={`totalVolume-${index}`}
            name={PLATFORM_TEXT_TRANS[exchange]}
            unit="$"
            dataKey={`exchanges.${exchange}.totalVolume`}
            stackId="totalVolume"
            fill={EXCHANGE_COLOR[exchange]}
            stroke={EXCHANGE_COLOR[exchange]}
            isAnimationActive={false}
          />
        )
      })}
      <Line
        type="monotone"
        name="Cumulative Volume"
        unit="$"
        dataKey="volumeCumulative"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
      />
    </ChartComponentWrapper>
  )
}

export function TraderChartComponent({ data, syncId, id, onChartRenderEnd }: ChartComponentProps) {
  return (
    <ChartComponentWrapper
      colors={themeColors}
      data={data}
      syncId={syncId}
      externalLegend={
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
        stroke={themeColors.neutral4}
        tickFormatter={(value) => `${compactNumber(value, 0)}`}
      />
      <Bar
        // stackId="copier"
        type="monotone"
        name="Unique Trader"
        dataKey="totalDistinctTrader"
        fill={themeColors.primary1}
        isAnimationActive={true}
        onAnimationEnd={() => onChartRenderEnd(id)}
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
}: {
  data: StatisticChartData[]
  colors: Colors
  children: ReactNode
  externalLegend?: ReactNode
  legend?: any
  tooltip?: any
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
          fontSize: 12,
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
            <Legend content={legend} />
            <Tooltip
              offset={isMobile ? 100 : 20}
              content={tooltip}
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
      {externalLegend}
    </Box>
  )
}

function tooltipFormatter(value: any, index: any, item: any) {
  const _value = value as number
  if (item.unit === '%') return formatNumber(_value, 1)
  return formatNumber(_value, _value < 1 && _value > -1 ? 1 : 0)
}

const ProfitLossTooltip = ({ payload }: any) => {
  const lossCumulative = payload?.[0]
  const lossCumulativeValue = lossCumulative?.value ?? 0
  const profitCumulative = payload?.[1]
  const profitCumulativeValue = profitCumulative?.value ?? 0
  const totalProfit = payload?.[2]
  const totalProfitValue = totalProfit?.value ?? 0
  const totalLoss = payload?.[3]
  const totalLossValue = totalLoss?.value ?? 0

  return (
    <Flex flexDirection="column" p={3} backgroundColor="neutral7" sx={{ gap: 2 }}>
      <Type.Body>{lossCumulative?.payload?.date}</Type.Body>
      <Flex alignItems="center" color={lossCumulative?.color} sx={{ gap: 2 }}>
        <NumberWithSymbol name={lossCumulative?.name} value={lossCumulativeValue} unit={lossCumulative?.unit} />
      </Flex>
      <Flex alignItems="center" color={profitCumulative?.color} sx={{ gap: 2 }}>
        <NumberWithSymbol name={profitCumulative?.name} value={profitCumulativeValue} unit={profitCumulative?.unit} />
      </Flex>
      <Flex alignItems="center" color={totalProfit?.color} sx={{ gap: 2 }}>
        <NumberWithSymbol name={totalProfit?.name} value={totalProfitValue} unit={totalProfit?.unit} />
      </Flex>
      <Flex alignItems="center" color={totalLoss?.color} sx={{ gap: 2 }}>
        <NumberWithSymbol name={totalLoss?.name} value={totalLossValue} unit={totalLoss?.unit} />
      </Flex>
    </Flex>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

const DailyNetPnlTooltip = ({ payload }: TooltipProps) => {
  const pnl = payload?.[0]
  const pnlCumulative = payload?.[1]
  const pnlPayload = pnl?.payload
  const pnlValue = pnl?.value ?? 0
  const pnlCumulativeValue = pnlCumulative?.value ?? 0
  if (!pnlPayload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={3} backgroundColor="neutral7" sx={{ gap: 2 }}>
      <Type.Body>{pnlPayload?.date}</Type.Body>
      {EXCHANGE_STATS.map((exchange) => {
        const pnl = pnlPayload?.exchanges[exchange]?.totalPnl
        return !!pnl ? (
          <NumberWithSymbol
            key={`${pnlPayload?.date}-${exchange}`}
            name={PLATFORM_TEXT_TRANS[exchange]}
            value={pnl}
            unit={pnlCumulative?.unit}
            color={EXCHANGE_COLOR[exchange]}
          />
        ) : (
          <></>
        )
      })}
      <NumberWithSymbol name={pnl?.name} value={pnlValue} unit={pnlCumulative?.unit} color={pnl?.color} />
      <NumberWithSymbol
        name={pnlCumulative?.name}
        value={pnlCumulativeValue}
        unit={pnlCumulative?.unit}
        color={pnlCumulative?.color}
      />
    </Flex>
  )
}

const DailyNetPnlLegend = ({ payload }: any) => {
  const pnlPayload = payload?.[0]?.payload
  if (!pnlPayload) {
    return null
  }

  const exchangePayload: any[] = []
  EXCHANGE_STATS.map((exchange) => {
    exchangePayload.push({
      id: exchange,
      value: PLATFORM_TEXT_TRANS[exchange],
      color: EXCHANGE_COLOR[exchange],
      type: 'rect',
    })
  })

  const customPayload = [...exchangePayload, ...payload]

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      // @ts-ignore
      sx={{ '.recharts-legend-wrapper': { position: 'relative !important' } }}
    >
      <Legend payload={customPayload} />
    </Flex>
  )
}

const DailyVolumeTooltip = ({ payload }: TooltipProps) => {
  const totalDailyVolume = payload
    ?.filter((w) => w.dataKey !== 'volumeCumulative')
    .reduce((acc, exchange) => acc + (exchange?.value ?? 0), 0)
  const volumeCumulative = payload?.[payload?.length - 1]
  const volumeCumulativeValue = volumeCumulative?.value ?? 0
  const volumePayload = volumeCumulative?.payload
  if (!volumePayload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={3} backgroundColor="neutral7" sx={{ gap: 2 }}>
      <Type.Body>{volumePayload?.date}</Type.Body>
      <NumberWithSymbol
        name="Total Volume"
        value={totalDailyVolume}
        unit={volumeCumulative?.unit}
        color={themeColors.primary2}
      />
      {EXCHANGE_STATS.map((exchange) => {
        const volume = volumePayload?.exchanges[exchange]?.totalVolume
        return !!volume ? (
          <NumberWithSymbol
            key={`${volumePayload?.date}-${exchange}-${volume}`}
            name={PLATFORM_TEXT_TRANS[exchange]}
            value={volume}
            unit={volumeCumulative?.unit}
            color={EXCHANGE_COLOR[exchange]}
          />
        ) : (
          <></>
        )
      })}
      <NumberWithSymbol
        name={volumeCumulative?.name}
        value={volumeCumulativeValue}
        unit={volumeCumulative?.unit}
        color={volumeCumulative?.color}
      />
    </Flex>
  )
}

const DailyVolumeLegend = ({ payload }: any) => {
  const volumePayload = payload?.[0]?.payload
  if (!volumePayload) {
    return null
  }

  const customPayload = [
    {
      id: 'totalVolume',
      value: 'Total Volume',
      color: themeColors.primary2,
      type: 'rect',
    },
    ...payload,
  ]

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      // @ts-ignore
      sx={{ '.recharts-legend-wrapper': { position: 'relative !important' } }}
    >
      <Legend payload={customPayload} />
    </Flex>
  )
}

const NumberWithSymbol = ({
  name,
  value,
  unit,
  color,
  key,
}: {
  name?: string
  value: number
  unit?: string
  color?: string
  key?: string | number
}) => {
  return (
    <Flex key={key} alignItems="center" color={color} sx={{ gap: 2 }}>
      {name && <Type.Body>{name} :</Type.Body>}
      <Type.Body>
        {`${value < 0 ? '-' : ''}${unit ?? ''}${formatNumber(Math.abs(value), value < 1 && value > -1 ? 1 : 0)}`}
      </Type.Body>
    </Flex>
  )
}
