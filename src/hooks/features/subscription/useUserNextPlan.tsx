import { useAuthContext } from 'hooks/web3/useAuth'
import { SubscriptionPlanEnum } from 'utils/config/enums'

// Get user next plan => required plan for ease
export default function useUserNextPlan() {
  const { profile } = useAuthContext()
  let userNextPlan: SubscriptionPlanEnum = SubscriptionPlanEnum.STARTER
  if (profile?.subscription?.plan && profile.subscription.plan !== SubscriptionPlanEnum.ELITE) {
    for (const [plan, num] of Object.entries(PLAN_NUMBER_MAPPING)) {
      if (num > PLAN_NUMBER_MAPPING[profile.subscription.plan] && plan != SubscriptionPlanEnum.FREE) {
        userNextPlan = plan as SubscriptionPlanEnum
        break
      }
    }
  }
  return { userNextPlan }
}

const PLAN_NUMBER_MAPPING = {
  [SubscriptionPlanEnum.NON_LOGIN]: 0,
  [SubscriptionPlanEnum.FREE]: 1,
  [SubscriptionPlanEnum.STARTER]: 2,
  [SubscriptionPlanEnum.PRO]: 3,
  [SubscriptionPlanEnum.ELITE]: 4,
  [SubscriptionPlanEnum.IF]: 5,
}
