import { ReactNode } from 'react'

import { SubscriptionPlanEnum } from 'utils/config/enums'
import { PLANS } from 'utils/config/subscription'

export const generatePermissionData = (
  permission: any,
  key?: string,
  render?: (value: any, currentPlan?: SubscriptionPlanEnum, prevPlan?: SubscriptionPlanEnum) => ReactNode,
  zeroIsUnlimited = false
) => {
  const permissionData: { [key: string]: boolean | ReactNode } = {}

  if (!permission)
    return {
      [SubscriptionPlanEnum.NON_LOGIN]: true,
      [SubscriptionPlanEnum.FREE]: true,
      [SubscriptionPlanEnum.STARTER]: true,
      [SubscriptionPlanEnum.PRO]: true,
      [SubscriptionPlanEnum.ELITE]: true,
    }

  for (const plan in permission) {
    const currentPlan = PLANS.find((p) => p.title === plan)
    const prevPlan = currentPlan ? PLANS.find((p) => p.id + 1 === currentPlan.id) : undefined
    if (!key) {
      permissionData[plan] = render
        ? render(permission[plan], currentPlan?.title as SubscriptionPlanEnum, prevPlan?.title as SubscriptionPlanEnum)
        : permission[plan]
      continue
    }
    const permissionValue = permission[plan][key]
    if (
      (Array.isArray(permissionValue) && permissionValue.includes('*')) ||
      (zeroIsUnlimited && permissionValue === 0)
    ) {
      permissionData[plan] = 'Unlimited'
    } else {
      permissionData[plan] = render
        ? render(permissionValue, currentPlan?.title as SubscriptionPlanEnum, prevPlan?.title as SubscriptionPlanEnum)
        : permissionValue
    }
  }

  return permissionData as { [key in SubscriptionPlanEnum]: boolean | ReactNode }
}
