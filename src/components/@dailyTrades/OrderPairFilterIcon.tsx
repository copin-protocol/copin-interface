import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'
import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export function OrderPairFilterIcon({ requiredPlan }: { requiredPlan?: SubscriptionPlanEnum }) {
  const { pairs, changePairs, excludedPairs } = useDailyOrdersContext()

  return (
    <PairFilterIcon pairs={pairs} excludedPairs={excludedPairs} changePairs={changePairs} requiredPlan={requiredPlan} />
  )
}
