import { useParams } from 'react-router-dom'

import { ProtocolEnum } from 'utils/config/enums'

import OpenInterestByMarket from './OpenInterestByMarket'
import TopOpenings from './TopOpenIntrest'

export default function OpenInterestPositions() {
  const { symbol } = useParams<{
    symbol: string | undefined
    protocol: ProtocolEnum | undefined
  }>()
  if (!symbol) return <TopOpenings />
  return <OpenInterestByMarket />
}
