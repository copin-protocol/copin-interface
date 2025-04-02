import { ReactNode } from 'react'

import { TimeFilterByEnum } from 'utils/config/enums'

export type TimeFilterProps<T = TimeFilterByEnum, V = number> = {
  id: T
  text: ReactNode
  sort_by: T
  value: V
  premiumFilter?: boolean
}

export type TimeWithRangeFilterProps<T = TimeFilterByEnum> = {
  id: T | 'custom'
  text: ReactNode
  sort_by: T | undefined
}
