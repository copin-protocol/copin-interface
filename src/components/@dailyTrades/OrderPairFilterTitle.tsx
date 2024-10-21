import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'

import { PairFilterTitle } from './PairFilterTitle'

export function OrderPairFilterTitle() {
  const { pairs, changePairs } = useDailyOrdersContext()

  return <PairFilterTitle pairs={pairs} changePairs={changePairs} />
}
