// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { ReactNode } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RankingFieldOption } from 'components/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import { LeaderboardTypeEnum } from './enums'

export type LeaderboardOptionProps = {
  id: LeaderboardTypeEnum
  text: ReactNode
}

export const LEADERBOARD_OPTIONS_MAPPING: Record<LeaderboardTypeEnum, LeaderboardOptionProps> = {
  [LeaderboardTypeEnum.WEEKLY]: {
    id: LeaderboardTypeEnum.WEEKLY,
    text: <Trans>Weekly</Trans>,
  },
  [LeaderboardTypeEnum.MONTHLY]: {
    id: LeaderboardTypeEnum.MONTHLY,
    text: <Trans>Monthly</Trans>,
  },
}
export const LEADERBOARD_OPTIONS: LeaderboardOptionProps[] = [
  LEADERBOARD_OPTIONS_MAPPING[LeaderboardTypeEnum.MONTHLY],
  LEADERBOARD_OPTIONS_MAPPING[LeaderboardTypeEnum.WEEKLY],
]

const rankingFieldsBase: RankingFieldOption<TraderData>[] = [
  {
    value: 'profit',
    label: t`High PnL`,
    statLabel: t`PnL`,
    tooltipContent: t`The percentile ranking of traders earning the most money`,
    statFormat: (value) =>
      !value ? '--' : <SignedText value={value} minDigit={1} maxDigit={1} fontInherit prefix="$" isCompactNumber />,
  },
  {
    value: 'avgRoi',
    label: t`High Avg ROI`,
    statLabel: t`Avg ROI`,
    tooltipContent: t`The percentile ranking of traders with the highest average return on investment`,
    statFormat: (value) =>
      !value ? '--' : <SignedText value={value} minDigit={1} maxDigit={1} fontInherit suffix="%" />,
  },
  {
    value: 'maxRoi',
    label: t`High Max Roi`,
    statLabel: t`Max Roi`,
    tooltipContent: t`The percentile ranking of traders with the highest maximum return on investment`,
    statFormat: (value) =>
      !value ? '--' : <SignedText value={value} minDigit={1} maxDigit={1} fontInherit suffix="%" />,
  },
  {
    value: 'avgVolume',
    label: t`High Avg Volume`,
    statLabel: t`Avg Volume`,
    tooltipContent: t`The percentile ranking of traders with the highest average trading volume `,
    statFormat: (value) => (!value ? '--' : `$${compactNumber(value, 0)}`),
  },
  {
    value: 'avgLeverage',
    label: t`Low Leverage`,
    statLabel: t`Avg Leverage`,
    tooltipContent: t`The percentile ranking of traders with the lowest leverage usage`,
    statFormat: (value) => (!value ? '--' : `${formatNumber(value, 1, 1)}x`),
  },
  {
    value: 'winRate',
    label: t`High Win Rate`,
    statLabel: t`Win Rate`,
    tooltipContent: t`The percentile ranking of traders with the highest win rate`,
    statFormat: (value) => (!value ? '--' : `${formatNumber(value, 1, 1)}%`),
  },
  {
    value: 'profitRate',
    label: t`High Profit Rate`,
    statLabel: t`Profit Rate`,
    tooltipContent: t`The percentile ranking of traders with the highest profit rate`,
    statFormat: (value) => (!value ? '--' : formatNumber(value, 1, 1)),
  },
  {
    value: 'profitLossRatio',
    label: t`High PnL Ratio`,
    statLabel: t`PnL Ratio`,
    tooltipContent: t`The percentile ranking of traders with the highest profit and loss ratio`,
    statFormat: (value) => (!value ? '--' : formatNumber(value, 1, 1)),
  },
  {
    value: 'maxDrawDownRoi',
    label: t`Low Max Drawdown`,
    statLabel: t`Max Drawdown`,
    shortStatLabel: t`MDD`,
    tooltipContent: t`The percentile ranking of traders with the lowest maximum drawdown`,
    statFormat: (value) =>
      !value ? '--' : <SignedText value={value} minDigit={1} maxDigit={1} neg fontInherit suffix="%" />,
  },
  {
    value: 'totalTrade',
    label: t`Frequently Trade`,
    statLabel: t`Trades`,
    tooltipContent: t`The percentile ranking of traders with the highest number of trades`,
    statFormat: (data) => (!data ? '--' : formatNumber(data, 0, 0)),
  },
  {
    value: 'avgDuration',
    label: t`Quickly Settled`,
    statLabel: t`Avg Duration`,
    tooltipContent: t`The percentile ranking of traders with the fastest average position closure time.`,
    statFormat: (data) => (!data ? '--' : `${formatNumber((data ?? 0) / 3600, 1, 1)}h`),
  },
  {
    value: 'orderPositionRatio',
    label: t`Low Overtrading`,
    statLabel: t`Order/Pos Ratio`,
    shortStatLabel: t`Order/Pos`,
    tooltipContent: t`The percentile ranking of traders with the fewest trades per position`,
    statFormat: (data) => (!data ? '--' : formatNumber(data, 1, 1)),
  },
]

export const rankingFieldOptions = rankingFieldsBase.map((setting) => {
  const newSetting: RankingFieldOption<TraderData> = {
    ...setting,
    unit: '%',
    default: { conditionType: 'gte', gte: 60 },
  }
  return newSetting
})
