import { ReactNode } from 'react'

import { useDailyPositionsContext } from 'pages/DailyTrades/Positions/usePositionsProvider'

import { PairFilterTitle } from './PairFilterTitle'

export function PositionPairFilterTitle({ title }: { title?: ReactNode }) {
  const { pairs, changePairs } = useDailyPositionsContext()

  return <PairFilterTitle pairs={pairs} changePairs={changePairs} title={title} />
}
