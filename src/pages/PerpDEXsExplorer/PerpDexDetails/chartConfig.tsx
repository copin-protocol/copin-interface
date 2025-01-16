import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import noLiquidations from 'assets/perp-dex/no-data-liquidation.png'
import noTopOIByPairs from 'assets/perp-dex/no-data-long-short-oi-by-pairs.png'
// import noLongShortOIByPairs from 'assets/perp-dex/no-data-long-short-oi-by-pairs.png'
import noRevenue from 'assets/perp-dex/no-data-revenue.png'
import noTopPnlByPairs from 'assets/perp-dex/no-data-top-pnl-by-pairs.png'
import noTopVolumeByPairs from 'assets/perp-dex/no-data-top-volume-by-pairs.png'
import noTraderActivityByDay from 'assets/perp-dex/no-data-trader-activity-by-day.png'
import noTraderProfitLoss from 'assets/perp-dex/no-data-trader-profit-loss.png'
import noTraderPnL from 'assets/perp-dex/no-data-traders-pnl.png'
import noUser from 'assets/perp-dex/no-data-user.png'
import noVolume from 'assets/perp-dex/no-data-volume.png'
import Market from 'components/@ui/MarketGroup/Market'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { PerpChartTypeEnum } from 'utils/config/enums'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export interface TooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  unit?: string
}

export const DailyVolumeTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem value={data?.volume} label={'Daily Volume:'} unit={unit} backgroundColor={'#7AA6FF'} />
      <TooltipFieldItem
        value={dataCumulative?.volumeCumulative}
        label={'Cumulative Volume:'}
        unit={unit}
        backgroundColor={themeColors.orange1}
      />
    </Flex>
  )
}

export const ActiveUserTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem value={data?.traders} label={'Active Users:'} backgroundColor="#CFDDFC" />
      <TooltipFieldItem
        value={dataCumulative?.traderCumulative}
        label={'Total Users:'}
        unit={unit}
        backgroundColor={themeColors.orange1}
      />
    </Flex>
  )
}

export const RevenueTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem value={data?.revenue} label={'Daily Revenue:'} unit={unit} backgroundColor="#C286F0" />
      <TooltipFieldItem
        value={dataCumulative?.revenueCumulative}
        label={'Cumulative Revenue:'}
        unit={unit}
        backgroundColor={themeColors.orange1}
      />
    </Flex>
  )
}

export const LiquidationTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem
        value={data?.longLiquidations}
        label={'Long:'}
        unit={unit}
        backgroundColor={themeColors.green2}
      />
      <TooltipFieldItem
        value={data?.shortLiquidations}
        label={'Short:'}
        unit={unit}
        backgroundColor={themeColors.red1}
      />
      <TooltipFieldItem
        value={dataCumulative?.liquidationCumulative}
        label={'Cumulative Liquidation:'}
        unit={unit}
        backgroundColor={themeColors.orange1}
      />
    </Flex>
  )
}

export const NetProfitTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem value={data?.longPnl} label={'Long PnL:'} unit={unit} backgroundColor={themeColors.green2} />
      <TooltipFieldItem value={data?.shortPnl} label={'Short PnL:'} unit={unit} backgroundColor={themeColors.red1} />
      <TooltipFieldItem
        value={data?.traderPnl}
        label={'Total PnL:'}
        unit={unit}
        backgroundColor={themeColors.neutral1}
      />
      <TooltipFieldItem
        value={dataCumulative?.traderPnlCumulative}
        label={'Cumulative PnL:'}
        unit={unit}
        backgroundColor={themeColors.orange1}
      />
    </Flex>
  )
}

export const ProfitLossTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const dataCumulative = payload?.[1]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3">{data?.dateTime}</Type.Caption>
      <TooltipFieldItem value={data?.traderProfit} label={'Profit:'} unit={unit} backgroundColor={themeColors.green2} />
      <TooltipFieldItem value={data?.traderLoss} label={'Loss:'} unit={unit} backgroundColor={themeColors.red1} />
      <TooltipFieldItem
        value={dataCumulative?.traderProfitCumulative}
        label={'Cumulative Profit:'}
        unit={unit}
        backgroundColor={themeColors.green2}
      />
      <TooltipFieldItem
        value={dataCumulative?.traderLossCumulative}
        label={'Cumulative Loss:'}
        unit={unit}
        backgroundColor={themeColors.red1}
      />
    </Flex>
  )
}

export const TopVolumeByPairTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: '4px' }}>
      <Flex alignItems="center" sx={{ ml: -1 }}>
        {data?.pair && data.pair !== 'OTHERS' && (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Market symbol={data?.pair} />
            <Type.Caption color="neutral1">{data?.pair}</Type.Caption>
          </Flex>
        )}
        <Box height="10px" width="1px" backgroundColor={themeColors.neutral1} mx={2} />
        <Type.Caption color="neutral1">
          {data?.pair === 'OTHERS' ? 'Others' : !!data?.top ? `Top ${data.top}` : ''}
        </Type.Caption>
      </Flex>
      <TooltipFieldItem value={data?.volume} label={'Volume:'} unit={unit} backgroundColor="#7AA6FF" />
    </Flex>
  )
}

export const TopProfitLossByPairTooltip = ({ payload }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const unit = payload?.[0]?.unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: '4px' }}>
      <Flex alignItems="center" sx={{ ml: -1 }}>
        {data?.pair && data.pair !== 'OTHERS' && (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Market symbol={data?.pair} />
            <Type.Caption color="neutral1">{data?.pair}</Type.Caption>
          </Flex>
        )}
        <Box height="10px" width="1px" backgroundColor={themeColors.neutral1} mx={2} />
        <Type.Caption color="neutral1">
          {data?.pair === 'OTHERS' ? 'Others' : !!data?.top ? `Top ${data.top}` : ''}
        </Type.Caption>
      </Flex>
      <TooltipFieldItem
        value={data?.totalProfit}
        label={'Total Profit:'}
        unit={unit}
        backgroundColor={themeColors.green2}
      />
      <TooltipFieldItem value={data?.totalLoss} label={'Total Loss:'} unit={unit} backgroundColor={themeColors.red1} />
      {/* <TooltipFieldItem
        value={data?.totalNet}
        label={'Net Income:'}
        unit={unit}
        backgroundColor={themeColors.neutral1}
      /> */}
    </Flex>
  )
}

export const TopOIByPairContent = (props: any) => {
  const { depth, x, y, width, height, pair, totalOi, backgroundColor, stroke } = props
  // Set minimum dimensions for text visibility
  const minWidth = 30
  const minHeight = 30
  const isShowText = width * height > minWidth * minHeight && height > 10 && width > 10
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: `${backgroundColor}`,
          stroke,
        }}
      />

      {isShowText && depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 - 4}
          textAnchor="middle"
          fill={themeColors.neutral1}
          stroke={themeColors.neutral1}
          strokeWidth={0.5}
          fontSize={Math.min(Math.sqrt(width * height) / 5, 60)}
        >
          {pair}
        </text>
      ) : null}
      {isShowText && depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + Math.min(Math.sqrt(width * height) / 5, 50)}
          textAnchor="middle"
          fill={themeColors.neutral1}
          stroke={themeColors.neutral1}
          strokeWidth={0.5}
          fontSize={Math.min(Math.sqrt(width * height) / 5, 50)}
        >
          {`${compactNumber(totalOi, 1)}$`}
        </text>
      ) : null}
    </g>
  )
}

export const TopOIByPairTooltip = ({ payload, unit: _unit }: TooltipProps) => {
  const data = payload?.[0]?.payload
  const unit = payload?.[0]?.unit ?? _unit
  if (!payload) {
    return null
  }

  return (
    <Flex flexDirection="column" p={2} backgroundColor="neutral7" sx={{ gap: '4px' }}>
      <Flex alignItems="center" sx={{ ml: -1 }}>
        {data?.pair && data.pair !== 'OTHERS' && (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Market symbol={data?.pair} />
            <Type.Caption color="neutral1">{data?.pair}</Type.Caption>
          </Flex>
        )}
        <Box height="10px" width="1px" backgroundColor={themeColors.neutral1} mx={2} />
        <Type.Caption color="neutral1">
          {data?.pair === 'OTHERS' ? 'Others' : !!data?.top ? `Top ${data.top}` : ''}
        </Type.Caption>
      </Flex>
      <TooltipFieldItem value={data?.longOi} label={'Long OI:'} unit={unit} backgroundColor={themeColors.green2} />
      <TooltipFieldItem value={data?.shortOi} label={'Short OI:'} unit={unit} backgroundColor={themeColors.red1} />
      <TooltipFieldItem
        value={data?.totalOi}
        label={'Open Interest:'}
        unit={unit}
        backgroundColor={themeColors.neutral1}
      />
    </Flex>
  )
}

function TooltipFieldItem({
  value,
  label,
  unit,
  labelColor = 'neutral2',
  valueColor = 'neutral1',
  backgroundColor,
  size = 12,
}: {
  value?: number
  label?: ReactNode
  unit?: string
  labelColor?: string
  valueColor?: string
  backgroundColor?: string
  size?: number
}) {
  return (
    <Flex alignItems="center" justifyContent="space-between" minWidth="max-content" sx={{ gap: 3 }}>
      <Flex alignItems="center" sx={{ gap: 1 }}>
        {backgroundColor && <Box width={size} height={size} backgroundColor={backgroundColor} />}
        <Type.Caption color={labelColor}>{label}</Type.Caption>
      </Flex>
      <Type.Caption color={valueColor} textAlign="right">
        {formatNumber(value, value && value < 1 && value > -1 ? 1 : 0)}
        {unit ?? ''}
      </Type.Caption>
    </Flex>
  )
}

export const HourlyChartTooltip = ({ active, payload, title }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <Flex backgroundColor="neutral7" sx={{ gap: 1, p: 2 }}>
        <Type.Caption color="neutral3" sx={{ textTransform: 'capitalize' }}>
          {title}
        </Type.Caption>
        <Type.Caption color="neutral1">{compactNumber(data.value, 1)}</Type.Caption>
      </Flex>
    )
  }
  return null
}

export const CHART_CONFIG: Record<
  PerpChartTypeEnum,
  { label: ReactNode; noDataImage: string; isHourlyChart?: boolean }
> = {
  [PerpChartTypeEnum.VOLUME]: {
    label: <Trans>TRADING VOLUME</Trans>,
    noDataImage: noVolume,
  },
  [PerpChartTypeEnum.ACTIVE_USER]: {
    label: <Trans>ACTIVE USERS</Trans>,
    noDataImage: noUser,
  },
  [PerpChartTypeEnum.REVENUE]: {
    label: <Trans>REVENUE (TRADING FEE)</Trans>,
    noDataImage: noRevenue,
  },
  [PerpChartTypeEnum.LIQUIDATIONS]: {
    label: <Trans>TRADER LIQUIDATIONS</Trans>,
    noDataImage: noLiquidations,
  },
  [PerpChartTypeEnum.NET_PNL]: {
    label: <Trans>TRADERS&apos; NET PNL</Trans>,
    noDataImage: noTraderPnL,
  },
  [PerpChartTypeEnum.PROFIT_LOSS]: {
    label: <Trans>TRADERS&apos; PROFIT & LOSS</Trans>,
    noDataImage: noTraderProfitLoss,
  },
  [PerpChartTypeEnum.TOP_VOLUME_BY_PAIRS]: {
    label: <Trans>TOP VOLUME BY PAIRS</Trans>,
    noDataImage: noTopVolumeByPairs,
  },
  [PerpChartTypeEnum.TOP_PROFIT_AND_LOSS_BY_PAIRS]: {
    label: <Trans>TOP PROFIT AND LOSS BY PAIRS</Trans>,
    noDataImage: noTopPnlByPairs,
  },
  [PerpChartTypeEnum.TOP_OI_BY_PAIRS]: {
    label: <Trans>LONG/SHORT OPEN INTEREST BY PAIRS</Trans>,
    noDataImage: noTopOIByPairs,
  },
  [PerpChartTypeEnum.HOURLY_CHART]: {
    label: <Trans>ACTIVITY INTENSITY BY DAY & HOUR</Trans>,
    noDataImage: noTraderActivityByDay,
    isHourlyChart: true,
  },
}
