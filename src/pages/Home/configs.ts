import { RangeFilter } from 'apis/types'
import { TraderData } from 'entities/trader'

export const OVERVIEW_WIDTH = 343

export const getDropdownProps = ({ menuSx, placement }: { buttonSx?: any; menuSx?: any; placement?: any }) => ({
  menuSx: {
    width: '80px',
    minWidth: 'auto',
    ...(menuSx || {}),
  },
  placement: placement ?? ('bottom' as const),
})

export const BASE_RANGE_FILTER: RangeFilter<keyof TraderData>[] = [
  { fieldName: 'totalTrade', gte: 2 },
  { fieldName: 'profitRate', gte: 60 },
  { fieldName: 'pnl', gte: 100 },
  // { fieldName: 'avgRoi', gte: 1 },
  { fieldName: 'winRate', gte: 51 },
  { fieldName: 'runTimeDays', gte: 7 },
]
