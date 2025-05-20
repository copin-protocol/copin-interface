import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'
import { SubscriptionPlanEnum } from 'utils/config/enums'

import { ORDER_RANGE_CONFIG_MAPPING, OrderRangeFields } from './configs'

export default function OrderRangeFilterIcon({
  valueKey,
  requiredPlan,
}: {
  valueKey: keyof OrderRangeFields
  requiredPlan?: SubscriptionPlanEnum
}) {
  const config = ORDER_RANGE_CONFIG_MAPPING[valueKey]

  return <TableRangeFilterIcon config={config} requiredPlan={requiredPlan} />
}
