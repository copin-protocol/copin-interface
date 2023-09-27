import { ReactNode } from 'react'

import { TimeFilterByEnum } from 'utils/config/enums'

export type TimeFilterProps = {
  id: TimeFilterByEnum
  text: ReactNode
  sort_by: TimeFilterByEnum
  value: number
}

export type TimeWithRangeFilterProps = {
  id: TimeFilterByEnum | 'custom'
  text: ReactNode
  sort_by: TimeFilterByEnum | undefined
}
