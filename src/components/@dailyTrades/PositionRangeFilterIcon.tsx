import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'

import { POSITION_RANGE_CONFIG_MAPPING, PositionRangeFields } from './configs'

export function PositionRangeFilterIcon({ valueKey }: { valueKey: keyof PositionRangeFields }) {
  const config = POSITION_RANGE_CONFIG_MAPPING[valueKey]
  return <TableRangeFilterIcon config={config} />
}
