import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'

import { FILL_RANGE_CONFIG_MAPPING, FillRangeFields } from './configs'

export function FillRangeFilterIcon({ valueKey }: { valueKey: keyof FillRangeFields }) {
  const config = FILL_RANGE_CONFIG_MAPPING[valueKey]
  return <TableRangeFilterIcon config={config} />
}
