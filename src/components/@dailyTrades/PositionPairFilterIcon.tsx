import { ReactNode } from 'react'

import { useDailyPositionsContext } from 'pages/DailyTrades/Positions/usePositionsProvider'

import { PairFilterIcon } from './PairFilterIcon'

export function PositionPairFilterIcon({ title }: { title?: ReactNode }) {
  const { pairs, changePairs } = useDailyPositionsContext()

  return <PairFilterIcon pairs={pairs} changePairs={changePairs} title={title} />
}
