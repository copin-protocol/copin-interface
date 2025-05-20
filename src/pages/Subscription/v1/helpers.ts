import { SubscriptionCountData } from 'entities/user'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export function getSubscriptionCount({
  data,
  plan,
}: {
  data: SubscriptionCountData[] | undefined
  plan: SubscriptionPlanEnum
}) {
  if (!data?.length) return undefined
  return data.find((v) => v.plan === plan)?.count
}

export const checkIsSubscriptionTitle = (index: number) => {
  return index === 0 || index === 6 || index === 13
}
