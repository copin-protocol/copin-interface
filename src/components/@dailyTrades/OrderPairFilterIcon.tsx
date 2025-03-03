import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'
import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'

export function OrderPairFilterIcon() {
  const { pairs, changePairs, excludedPairs } = useDailyOrdersContext()

  return <PairFilterIcon pairs={pairs} excludedPairs={excludedPairs} changePairs={changePairs} />
}
