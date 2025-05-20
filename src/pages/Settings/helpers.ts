import { AlertPermission, AlertPermissionConfig } from 'entities/permission'
import { SUBSCRIPTION_PLAN_ORDER } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export function getAlertQuotaRequiredPlan({
  section,
  alertPermission,
}: {
  section: keyof AlertPermissionConfig
  alertPermission?: AlertPermission
}) {
  let requiredPlan: SubscriptionPlanEnum | undefined = SubscriptionPlanEnum.ELITE
  for (const plan of SUBSCRIPTION_PLAN_ORDER) {
    if (!!alertPermission?.[plan][section]) {
      requiredPlan = plan
    }
  }
  return requiredPlan
}
