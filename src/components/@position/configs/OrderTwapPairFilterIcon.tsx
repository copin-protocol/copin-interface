import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'

import { useOrderTwapContext } from '../HLTraderOpeningPositions/useOrderTwapContext'

export default function OrderTwapPairFilterIcon() {
  const context = useOrderTwapContext()
  return <PairFilterIcon {...context} />
}
