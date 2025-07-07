import { Trans } from '@lingui/macro'

import { CopierLeaderboardTimeFilterEnum, TimeFilterByEnum } from 'utils/config/enums'

import { TimeFilterProps, TimeWithRangeFilterProps } from './type'

export const TIME_FILTER_OPTIONS: TimeFilterProps[] = [
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
    value: 7,
  },
  {
    id: TimeFilterByEnum.S14_DAY,
    text: <Trans>14 days</Trans>,
    sort_by: TimeFilterByEnum.S14_DAY,
    value: 14,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 30,
  },
  {
    id: TimeFilterByEnum.S60_DAY,
    text: <Trans>60 days</Trans>,
    sort_by: TimeFilterByEnum.S60_DAY,
    value: 60,
  },
  {
    id: TimeFilterByEnum.ALL_TIME,
    text: <Trans>All Time</Trans>,
    sort_by: TimeFilterByEnum.ALL_TIME,
    value: 365 * 10, // 10 years
  },
]

export const TIME_WITH_RANGE_FILTER_OPTIONS: TimeWithRangeFilterProps[] = [
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
  },
  {
    id: TimeFilterByEnum.S14_DAY,
    text: <Trans>14 days</Trans>,
    sort_by: TimeFilterByEnum.S14_DAY,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
  },
  {
    id: TimeFilterByEnum.S60_DAY,
    text: <Trans>60 days</Trans>,
    sort_by: TimeFilterByEnum.S60_DAY,
  },
  {
    id: 'custom',
    text: <Trans>Custom</Trans>,
    sort_by: undefined,
  },
]

export const ALL_TIME_FILTER_OPTIONS: TimeFilterProps[] = [
  {
    id: TimeFilterByEnum.LAST_24H,
    text: <Trans>Last 24H</Trans>,
    sort_by: TimeFilterByEnum.LAST_24H,
    value: 1,
    // premiumFilter: true,
  },
  {
    id: TimeFilterByEnum.S1_DAY,
    text: <Trans>Yesterday</Trans>,
    sort_by: TimeFilterByEnum.S1_DAY,
    value: 1,
    // premiumFilter: true,
  },
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
    value: 7,
  },
  {
    id: TimeFilterByEnum.S14_DAY,
    text: <Trans>14 days</Trans>,
    sort_by: TimeFilterByEnum.S14_DAY,
    value: 15,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 30,
  },
  {
    id: TimeFilterByEnum.S60_DAY,
    text: <Trans>60 days</Trans>,
    sort_by: TimeFilterByEnum.S60_DAY,
    value: 60,
  },
  {
    id: TimeFilterByEnum.ALL_TIME,
    text: <Trans>All Time</Trans>,
    sort_by: TimeFilterByEnum.ALL_TIME,
    value: 365 * 10,
  },
]

export const COPIER_LEADERBOARD_TIME_FILTER_OPTIONS: TimeFilterProps<
  CopierLeaderboardTimeFilterEnum,
  CopierLeaderboardTimeFilterEnum
>[] = [
  {
    id: CopierLeaderboardTimeFilterEnum.DAILY,
    sort_by: CopierLeaderboardTimeFilterEnum.DAILY,
    text: 'Today',
    value: CopierLeaderboardTimeFilterEnum.DAILY,
  },
  {
    id: CopierLeaderboardTimeFilterEnum.YESTERDAY,
    value: CopierLeaderboardTimeFilterEnum.YESTERDAY,
    sort_by: CopierLeaderboardTimeFilterEnum.YESTERDAY,
    text: 'Yesterday',
  },
  {
    id: CopierLeaderboardTimeFilterEnum.D7,
    text: '7 Days',
    value: CopierLeaderboardTimeFilterEnum.D7,
    sort_by: CopierLeaderboardTimeFilterEnum.D7,
  },
  {
    id: CopierLeaderboardTimeFilterEnum.D30,
    sort_by: CopierLeaderboardTimeFilterEnum.D30,
    text: '30 Days',
    value: CopierLeaderboardTimeFilterEnum.D30,
  },
  {
    id: CopierLeaderboardTimeFilterEnum.D60,
    sort_by: CopierLeaderboardTimeFilterEnum.D60,
    text: '60 Days',
    value: CopierLeaderboardTimeFilterEnum.D60,
  },
  {
    id: CopierLeaderboardTimeFilterEnum.FULL,
    text: 'All Time',
    sort_by: CopierLeaderboardTimeFilterEnum.FULL,
    value: CopierLeaderboardTimeFilterEnum.FULL,
  },
]

export const PERP_DEX_CHART_FILTER_OPTIONS: TimeFilterProps[] = [
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>7 days</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
    value: 7,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>30 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 30,
  },
  {
    id: TimeFilterByEnum.S90_DAY,
    text: <Trans>90 days</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 90,
  },
  {
    id: TimeFilterByEnum.S365_DAY,
    text: <Trans>1 year</Trans>,
    sort_by: TimeFilterByEnum.S365_DAY,
    value: 365,
  },
  {
    id: TimeFilterByEnum.ALL_TIME,
    text: <Trans>All Time</Trans>,
    sort_by: TimeFilterByEnum.ALL_TIME,
    value: 365 * 10, // 10 years
  },
]

export const HYPERLIQUID_API_FILTER_OPTIONS: TimeFilterProps[] = [
  {
    id: TimeFilterByEnum.LAST_24H,
    text: <Trans>24H</Trans>,
    sort_by: TimeFilterByEnum.LAST_24H,
    value: 1,
    // premiumFilter: true,
  },
  {
    id: TimeFilterByEnum.S7_DAY,
    text: <Trans>1W</Trans>,
    sort_by: TimeFilterByEnum.S7_DAY,
    value: 7,
  },
  {
    id: TimeFilterByEnum.S30_DAY,
    text: <Trans>1M</Trans>,
    sort_by: TimeFilterByEnum.S30_DAY,
    value: 30,
  },
  {
    id: TimeFilterByEnum.ALL_TIME,
    text: <Trans>ALL</Trans>,
    sort_by: TimeFilterByEnum.ALL_TIME,
    value: 365 * 10,
  },
]