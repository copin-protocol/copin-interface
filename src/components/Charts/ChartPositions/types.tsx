import { SystemStyleObject } from '@styled-system/css'
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
  openingPositions?: PositionData[]
  closedPositions: PositionData[]
  currencyOptions?: TokenOptionProps[]
  currencyOption: TokenOptionProps
  changeCurrency?: (option: TokenOptionProps) => void
  timeframeOption: TimeFilterProps
  timeRange?: TimeRangeProps
  componentIds?: { legend?: string; tooltip?: string; chart?: string }
  sx?: SystemStyleObject & GridProps
  isExpanded?: boolean
  toggleExpand?: () => void
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isLoadingClosed?: boolean
}