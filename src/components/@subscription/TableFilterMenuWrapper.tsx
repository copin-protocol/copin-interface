import { SubscriptionPlanEnum } from 'utils/config/enums'

import NotPermittedFilter from './NotPermittedFilter'

export default function TableFilterMenuWrapper({
  requiredPlan,
  children,
}: {
  requiredPlan: SubscriptionPlanEnum | undefined
  children: any
}) {
  if (requiredPlan == null) return children
  return <NotPermittedFilter requiredPlan={requiredPlan} />
}
