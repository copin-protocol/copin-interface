import { PerpExplorerPermission, PerpExplorerPermissionConfig } from 'entities/permission'
import { SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function usePerpExplorerPermission() {
  const { userPermission, pagePermission } = useGetSubscriptionPermission<
    PerpExplorerPermission,
    PerpExplorerPermissionConfig
  >({
    section: SubscriptionPermission.PERP_EXPLORER,
  })
  const isPermitted = !!userPermission?.isEnabled
  const requiredPlan = getRequiredPlan({ conditionFn: (plan) => !!pagePermission?.[plan]?.isEnabled })
  return { isPermitted, requiredPlan }
}
