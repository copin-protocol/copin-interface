import { RangeFilter } from 'apis/types'
import { TraderData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'

export const OVERVIEW_WIDTH = 343

export const getDropdownProps = ({
  buttonSx,
  menuSx,
  placement,
}: {
  buttonSx?: any
  menuSx?: any
  placement?: any
}) => ({
  buttonSx: {
    color: 'primary1',
    borderRadius: 0,
    border: 'none',
    py: 0,
    px: 0,
    '&:hover:not([disabled])': {
      color: 'primary1',
      '& > *': { color: 'primary1' },
    },
    ...(buttonSx || {}),
  },
  menuSx: {
    width: '80px',
    minWidth: 'auto',
    ...(menuSx || {}),
  },
  placement: placement ?? ('bottom' as const),
})

export const BASE_RANGE_FILTER: RangeFilter<keyof TraderData>[] = [
  { fieldName: 'totalTrade', gte: 7 },
  { fieldName: 'profitRate', gte: 80 },
  { fieldName: 'avgRoi', gte: 5 },
  { fieldName: 'winRate', gte: 51 },
]

export const ALLOWED_PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.GMX_V2, ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL]
export const INTERNAL_ALLOWED_PROTOCOLS = [
  ProtocolEnum.GMX,
  ProtocolEnum.GMX_V2,
  ProtocolEnum.KWENTA,
  ProtocolEnum.POLYNOMIAL,
  ProtocolEnum.GNS,
]
