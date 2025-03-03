import { ReactNode } from 'react'

import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'
import { useDailyPositionsContext } from 'pages/DailyTrades/Positions/usePositionsProvider'

export function PositionPairFilterIcon({ title }: { title?: ReactNode }) {
  const { pairs, changePairs, excludedPairs } = useDailyPositionsContext()

  return <PairFilterIcon pairs={pairs} changePairs={changePairs} excludedPairs={excludedPairs} />
}
