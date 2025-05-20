import { SUBSCRIPTION_PLAN_ORDER } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export function getRequiredPlan({ conditionFn }: { conditionFn: (plan: SubscriptionPlanEnum) => boolean }) {
  let requiredPlan: SubscriptionPlanEnum | undefined = SubscriptionPlanEnum.ELITE
  for (const plan of SUBSCRIPTION_PLAN_ORDER) {
    if (conditionFn(plan)) {
      requiredPlan = plan
    }
  }
  return requiredPlan
}
