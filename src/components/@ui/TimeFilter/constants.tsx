import { Trans } from '@lingui/macro'

import { CopierLeaderboardTimeFilterEnum, TimeFilterByEnum } from 'utils/config/enums'

import { CopierLeaderboardTimeFilterProps, TimeFilterProps, TimeWithRangeFilterProps } from './type'

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
    id: TimeFilterByEnum.S1_DAY,
    text: <Trans>1 day</Trans>,
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

export const COPIER_LEADERBOARD_TIME_FILTER_OPTIONS: CopierLeaderboardTimeFilterProps[] = [
  { id: CopierLeaderboardTimeFilterEnum.DAILY, text: 'Today' },
  { id: CopierLeaderboardTimeFilterEnum.YESTERDAY, text: 'Yesterday' },
  { id: CopierLeaderboardTimeFilterEnum.D7, text: '7 Days' },
  { id: CopierLeaderboardTimeFilterEnum.D30, text: '30 Days' },
  { id: CopierLeaderboardTimeFilterEnum.D60, text: '60 Days' },
  { id: CopierLeaderboardTimeFilterEnum.FULL, text: 'All Time' },
]
