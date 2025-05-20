import { DataPermissionConfig, ExplorerPermission } from 'entities/permission'
import { SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useCexDepthPermission() {
  const { userPermission, pagePermission } = useGetSubscriptionPermission<ExplorerPermission, DataPermissionConfig>({
    section: SubscriptionPermission.TRADER_EXPLORER,
  })
  const isPermitted = !!userPermission?.isEnableCexDepth
  const requiredPlan = getRequiredPlan({ conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableCexDepth })
  return { isPermitted, requiredPlan }
}
