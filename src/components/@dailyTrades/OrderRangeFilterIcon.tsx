import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'

import { ORDER_RANGE_CONFIG_MAPPING, OrderRangeFields } from './configs'

export default function OrderRangeFilterIcon({ valueKey }: { valueKey: keyof OrderRangeFields }) {
  const config = ORDER_RANGE_CONFIG_MAPPING[valueKey]

  return <TableRangeFilterIcon config={config} />
}
