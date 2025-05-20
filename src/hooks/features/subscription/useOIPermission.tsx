import { OIPermission, OIPermissionConfig } from 'entities/permission'
import { SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useOIPermission() {
  const { userPermission, pagePermission } = useGetSubscriptionPermission<OIPermission, OIPermissionConfig>({
    section: SubscriptionPermission.OPEN_INTEREST,
  })
  const isEnabled = !!userPermission?.isEnabled
  const allowedFilter = !!userPermission?.allowedFilter
  const planToFilter = getRequiredPlan({
    conditionFn(plan) {
      return !!pagePermission?.[plan]?.allowedFilter
    },
  })
  const requiredPlan = getRequiredPlan({
    conditionFn(plan) {
      return !!pagePermission?.[plan]?.isEnabled
    },
  })
  return { userPermission, isEnabled, allowedFilter, planToFilter, requiredPlan }
}
