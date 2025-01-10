import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import noLiquidations from 'assets/perp-dex/no-data-liquidation.png'
// import noLongShortOIByPairs from 'assets/perp-dex/no-data-long-short-oi-by-pairs.png'
import noRevenue from 'assets/perp-dex/no-data-revenue.png'
// import noTopPnlByPairs from 'assets/perp-dex/no-data-top-pnl-by-pairs.png'
// import noTopVolumeByPairs from 'assets/perp-dex/no-data-top-volume-by-pairs.png'
// import noTraderActivityByDay from 'assets/perp-dex/no-data-trader-activity-by-day.png'
import noTraderProfitLoss from 'assets/perp-dex/no-data-trader-profit-loss.png'
import noTraderPnL from 'assets/perp-dex/no-data-traders-pnl.png'
import noUser from 'assets/perp-dex/no-data-user.png'
import noVolume from 'assets/perp-dex/no-data-volume.png'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { PerpChartTypeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

export interface TooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color={themeColors.primary2} sx={{ gap: 2 }}>
        <Type.Caption>Daily Volume:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.volume, data?.volume < 1 && data?.volume > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.orange1} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative Volume:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.volumeCumulative,
            dataCumulative?.volumeCumulative < 1 && dataCumulative?.volumeCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color="#CFDDFC" sx={{ gap: 2 }}>
        <Type.Caption>Active Users:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.traders, data?.traders < 1 && data?.traders > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.orange1} sx={{ gap: 2 }}>
        <Type.Caption>Total Users:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.traderCumulative,
            dataCumulative?.traderCumulative < 1 && dataCumulative?.traderCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color="#C286F0" sx={{ gap: 2 }}>
        <Type.Caption>Daily Revenue:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.revenue, data?.revenue < 1 && data?.revenue > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.orange1} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative Revenue:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.revenueCumulative,
            dataCumulative?.revenueCumulative < 1 && dataCumulative?.revenueCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color={themeColors.green2} sx={{ gap: 2 }}>
        <Type.Caption>Long:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.longLiquidations, data?.longLiquidations < 1 && data?.longLiquidations > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.red1} sx={{ gap: 2 }}>
        <Type.Caption>Short:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.shortLiquidations, data?.shortLiquidations < 1 && data?.shortLiquidations > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.orange1} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative Liquidation:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.liquidationCumulative,
            dataCumulative?.liquidationCumulative < 1 && dataCumulative?.liquidationCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color={themeColors.neutral1} sx={{ gap: 2 }}>
        <Type.Caption>Total PnL:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.traderPnl, data?.traderPnl < 1 && data?.traderPnl > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.green2} sx={{ gap: 2 }}>
        <Type.Caption>Long PnL:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.longPnl, data?.longPnl < 1 && data?.longPnl > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.red1} sx={{ gap: 2 }}>
        <Type.Caption>Short PnL:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.shortPnl, data?.shortPnl < 1 && data?.shortPnl > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.orange1} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative PnL:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.traderPnlCumulative,
            dataCumulative?.traderPnlCumulative < 1 && dataCumulative?.traderPnlCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
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
      <Type.Caption>{data?.dateTime}</Type.Caption>
      <Flex alignItems="center" color={themeColors.green2} sx={{ gap: 2 }}>
        <Type.Caption>Profit:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.traderProfit, data?.traderProfit < 1 && data?.traderProfit > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.red1} sx={{ gap: 2 }}>
        <Type.Caption>Loss:</Type.Caption>
        <Type.Caption>
          {formatNumber(data?.traderLoss, data?.traderLoss < 1 && data?.traderLoss > -1 ? 1 : 0)}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.green2} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative Profit:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.traderProfitCumulative,
            dataCumulative?.traderProfitCumulative < 1 && dataCumulative?.traderProfitCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
      <Flex alignItems="center" color={themeColors.red1} sx={{ gap: 2 }}>
        <Type.Caption>Cumulative Loss:</Type.Caption>
        <Type.Caption>
          {formatNumber(
            dataCumulative?.traderLossCumulative,
            dataCumulative?.traderLossCumulative < 1 && dataCumulative?.traderLossCumulative > -1 ? 1 : 0
          )}
          {unit ?? ''}
        </Type.Caption>
      </Flex>
    </Flex>
  )
}

export const CHART_CONFIG: Record<PerpChartTypeEnum, { label: ReactNode; noDataImage: string }> = {
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
}
