import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getSubscriptionPlansApi } from 'apis/subscription'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PLANS, PlanConfig } from 'utils/config/subscription'

export const useSubscriptionPlans = () => {
  const { data: subscriptionPlans } = useQuery([QUERY_KEYS.GET_SUBSCRIPTION_PLANS], getSubscriptionPlansApi)

  return useMemo(() => {
    const plans =
      subscriptionPlans?.map((plan) => {
        const planInfo = PLANS.find((p) => p.title === plan.plan)
        if (!planInfo) return null
        return {
          ...planInfo,
          price: plan.price,
          discountByPeriod: plan.discountByPeriod,
          yearlyDiscountPercent: plan.discountByPeriod?.['12'] || 0,
        }
      }) ?? []

    return [
      PLANS[0],
      ...plans.filter((plan) => plan !== null && plan.title !== SubscriptionPlanEnum.IF),
    ] as PlanConfig[]
  }, [subscriptionPlans])
}
