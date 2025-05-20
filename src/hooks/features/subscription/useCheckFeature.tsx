import { useAuthContext } from 'hooks/web3/useAuth'
import { SubscriptionPlanEnum } from 'utils/config/enums'

// TODO: SUB 3
export default function useCheckFeature(args?: { requiredPlan?: SubscriptionPlanEnum }) {
  const { requiredPlan } = args ?? {}
  const { isAuthenticated, profile } = useAuthContext()
  const isAvailableFeature = requiredPlan
    ? isAuthenticated &&
      !!profile?.subscription?.plan &&
      isAllowedPlan({ currentPlan: profile.subscription.plan, targetPlan: requiredPlan })
    : false

  let userNextPlan: SubscriptionPlanEnum | null = null
  if (!profile?.subscription?.plan) userNextPlan = SubscriptionPlanEnum.FREE
  if (profile?.subscription?.plan && profile.subscription?.plan !== SubscriptionPlanEnum.ELITE) {
    for (const [plan, num] of Object.entries(PLAN_NUMBER_MAPPING)) {
      if (num > PLAN_NUMBER_MAPPING[profile.subscription?.plan]) {
        userNextPlan = plan as SubscriptionPlanEnum
        break
      }
    }
  }
  return { isAuthenticated, isAvailableFeature, userNextPlan }
}

export function isAllowedPlan({
  currentPlan,
  targetPlan,
}: {
  currentPlan: SubscriptionPlanEnum
  targetPlan: SubscriptionPlanEnum
}) {
  return PLAN_NUMBER_MAPPING[currentPlan] >= PLAN_NUMBER_MAPPING[targetPlan]
}

const PLAN_NUMBER_MAPPING = {
  [SubscriptionPlanEnum.NON_LOGIN]: 0,
  [SubscriptionPlanEnum.FREE]: 1,
  [SubscriptionPlanEnum.STARTER]: 2,
  [SubscriptionPlanEnum.PRO]: 3,
  [SubscriptionPlanEnum.ELITE]: 4,
}
