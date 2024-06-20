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
import { Box, Flex, Li, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Colors } from 'theme/types'
import {
  CHART_DATE_FORMAT,
  CHART_MIN_HEIGHT,
  EXCHANGE_COLOR,
  EXCHANGE_STATS,
  MIN_TICK_GAP,
  YAXIS_WIDTH,
} from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { PLATFORM_TEXT_TRANS } from 'utils/config/translations'
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
  return (
    <ChartComponentWrapper
      data={data}
      colors={themeColors}
      syncId={syncId}
      stackOffset="sign"
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
            isAnimationActive={false}
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
            isAnimationActive={false}
          />
        </>
      )}
    </ChartComponentWrapper>
  )
}

export function CopierChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
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
        name="Daily Active Users"
        dataKey="totalActiveCopier"
        fill={themeColors.primary1}
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
        name="Cumulative Users"
        dataKey="totalCopier"
        yAxisId="right"
        dot={false}
        stroke={themeColors.orange1}
        strokeWidth={3}
      />
    </ChartComponentWrapper>
  )
}

export function CopyTradeChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
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
      />
    </ChartComponentWrapper>
  )
}

export function OrderChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
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
      />
    </ChartComponentWrapper>
  )
}

export function VolumeChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
  return (
    <ChartComponentWrapper colors={themeColors} data={data} syncId={syncId}>
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
      />
    </ChartComponentWrapper>
  )
}

export function TraderChartComponent({ data, syncId }: { data: StatisticChartData[]; syncId?: string }) {
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
        name="Daily Unique Trader"
        dataKey="totalDistinctTrader"
        fill={themeColors.primary1}
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

        // Other Exchanges
        const otherExchanges = (stats: any) => {
          let totalActiveCopyTrade = 0
          let totalInactiveCopyTrade = 0
          let totalOrder = 0
          let totalVolume = 0
          let totalPnl = 0
          let totalProfit = 0
          let totalLoss = 0

          for (const exchange in stats.exchanges) {
            if (
              [
                CopyTradePlatformEnum.BINGX,
                CopyTradePlatformEnum.BITGET,
                CopyTradePlatformEnum.BYBIT,
                CopyTradePlatformEnum.OKX,
                CopyTradePlatformEnum.GATE,
              ].includes(exchange as CopyTradePlatformEnum)
            ) {
              const exchangeStats = stats.exchanges[exchange] || {}
              totalActiveCopyTrade += exchangeStats.totalActiveCopyTrade || 0
              totalInactiveCopyTrade += exchangeStats.totalInactiveCopyTrade || 0
              totalOrder += exchangeStats.totalOrder || 0
              totalVolume += exchangeStats.totalVolume || 0
              totalPnl += exchangeStats.totalPnl || 0
              totalProfit += exchangeStats.totalProfit || 0
              totalLoss += exchangeStats.totalLoss || 0
            }
          }

          return {
            totalActiveCopyTrade: stats.totalActiveCopyTrade - totalActiveCopyTrade,
            totalInactiveCopyTrade: stats.totalInactiveCopyTrade - totalInactiveCopyTrade,
            totalOrder: stats.totalOrder - totalOrder,
            totalVolume: stats.totalVolume - totalVolume,
            totalPnl: pnl - totalPnl,
            totalProfit: stats.totalProfit - totalProfit,
            totalLoss: stats.totalLoss - totalLoss,
          }
        }

        stats.exchanges = {
          ...stats.exchanges,
          [CopyTradePlatformEnum.OTHERS]: otherExchanges(stats),
        }

        const formattedData: StatisticChartData = {
          date: formatLocalDate(stats.statisticAt, CHART_DATE_FORMAT),
          exchanges: stats.exchanges,
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
        }

        // for (const exchange in stats.exchanges) {
        //   formattedData['activeCopyTrade' + exchange] = stats.exchanges[exchange].totalActiveCopyTrade
        // }

        return formattedData
      })
  }

  return chartData
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
          <Flex key={exchange} alignItems="center" color={EXCHANGE_COLOR[exchange]} sx={{ gap: 2 }}>
            <Type.Body>{PLATFORM_TEXT_TRANS[exchange]} :</Type.Body>
            <Type.Body>
              {formatNumber(pnl, pnl < 1 && pnl > -1 ? 1 : 0)}
              {pnlCumulative?.unit ?? ''}
            </Type.Body>
          </Flex>
        ) : (
          <></>
        )
      })}
      <Flex alignItems="center" color={pnl?.color} sx={{ gap: 2 }}>
        <Type.Body>{pnl?.name} :</Type.Body>
        <Type.Body>
          {formatNumber(pnlValue, pnlValue < 1 && pnlValue > -1 ? 1 : 0)}
          {pnlCumulative?.unit ?? ''}
        </Type.Body>
      </Flex>
      <Flex alignItems="center" color={pnlCumulative?.color} sx={{ gap: 2 }}>
        <Type.Body>{pnlCumulative?.name} :</Type.Body>
        <Type.Body>
          {formatNumber(pnlCumulativeValue, pnlCumulativeValue < 1 && pnlCumulativeValue > -1 ? 1 : 0)}
          {pnlCumulative?.unit ?? ''}
        </Type.Body>
      </Flex>
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
