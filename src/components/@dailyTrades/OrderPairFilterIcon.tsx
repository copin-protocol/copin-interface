import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'

import { PairFilterIcon } from './PairFilterIcon'

export function OrderPairFilterIcon() {
  const { pairs, changePairs } = useDailyOrdersContext()

  return <PairFilterIcon pairs={pairs} changePairs={changePairs} />
}
