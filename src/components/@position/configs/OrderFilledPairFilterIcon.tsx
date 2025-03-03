import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'

import { useOrderFilledContext } from '../HLTraderOpeningPositions/useOrderFilledContext'

export default function OrderFilledPairFilterIcon() {
  const context = useOrderFilledContext()
  return <PairFilterIcon {...context} />
}
