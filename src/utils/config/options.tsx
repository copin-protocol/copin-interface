import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

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
