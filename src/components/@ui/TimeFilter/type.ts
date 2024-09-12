import { ReactNode } from 'react'

import { CopierLeaderboardTimeFilterEnum, TimeFilterByEnum } from 'utils/config/enums'

export type TimeFilterProps = {
  id: TimeFilterByEnum
  text: ReactNode
  sort_by: TimeFilterByEnum
  value: number
  premiumFilter?: boolean
}

export type TimeWithRangeFilterProps = {
  id: TimeFilterByEnum | 'custom'
  text: ReactNode
  sort_by: TimeFilterByEnum | undefined
}

export type CopierLeaderboardTimeFilterProps = {
  id: CopierLeaderboardTimeFilterEnum
  text: ReactNode
}
