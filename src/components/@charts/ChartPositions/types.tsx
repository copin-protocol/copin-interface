import { SystemStyleObject } from '@styled-system/css'
import { Props } from 'react-select'
import { GridProps } from 'styled-system'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { PositionData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'
import { TokenOptionProps } from 'utils/config/trades'

export type TimeRangeProps = {
  from: number
  to: number
}

export interface ChartPositionsProps {
  protocol: ProtocolEnum
  targetPosition?: PositionData
  openingPositions?: PositionData[]
  closedPositions: PositionData[]
  timeframeOption: TimeFilterProps
  timeRange?: TimeRangeProps
  componentIds?: { legend?: string; tooltip?: string; chart?: string }
  sx?: SystemStyleObject & GridProps
  isExpanded?: boolean
  handleExpand?: () => void
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isLoadingClosed?: boolean
  account?: string
  currencyOption: TokenOptionProps | undefined
  currencyOptions?: TokenOptionProps[]
  changeCurrency?: (option: TokenOptionProps) => void
  currencySelectProps?: Omit<Props, 'theme'>
  showLoadMoreButton?: boolean
}
