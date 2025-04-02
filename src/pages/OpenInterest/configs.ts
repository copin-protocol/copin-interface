import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import { PositionData } from 'entities/trader'

export type TopPositionRangeFields = Pick<PositionData, 'size'>

export const ALL_TOKEN_PARAM = 'all'

export const TOP_POSITION_RANGE_CONFIG_MAPPING: {
  [key in keyof TopPositionRangeFields]: TableFilterConfig
} = {
  size: { label: 'Size', type: 'number', unit: '$', urlParamKey: 'size', isCompactNumber: true },
}
