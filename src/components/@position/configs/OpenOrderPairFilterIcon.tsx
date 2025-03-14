import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'

import { useOpenOrderContext } from '../HLTraderOpeningPositions/useOpenOrderContext'

export default function OpenOrderPairFilterIcon() {
  const context = useOpenOrderContext()
  return <PairFilterIcon {...context} />
}
