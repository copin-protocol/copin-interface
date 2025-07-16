import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'

import { useHistoricalOrderContext } from '../HLTraderOpeningPositions/useHistoricalOrderContext'

export default function HistoricalOrderPairFilterIcon() {
  const context = useHistoricalOrderContext()
  return <PairFilterIcon {...context} />
}
