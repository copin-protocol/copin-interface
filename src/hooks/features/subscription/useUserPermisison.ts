import { UserPermission, UserPermissionConfig } from 'entities/permission'
import { SubscriptionPermission } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import useGetSubscriptionPermission from './useGetSubscriptionPermission'

export default function useUserPermission() {
  const { userPermission, pagePermission } = useGetSubscriptionPermission<UserPermission, UserPermissionConfig>({
    section: SubscriptionPermission.USER,
  })
  const isEnabledEditReferralCode = !!userPermission?.allowedCustomReferralCode
  const planToEditReferralCode = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.allowedCustomReferralCode,
  })
  return { isEnabledEditReferralCode, planToEditReferralCode }
}
