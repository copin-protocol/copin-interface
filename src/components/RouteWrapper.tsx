import { useHistory, useParams } from 'react-router-dom'

import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import Loading from 'theme/Loading'
import { Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { RestrictPremiumFeature } from './SubscriptionRestrictModal'

export function PremiumRouteWrapper({ children }: { children: any }) {
  const isPremium = useIsPremium()

  if (isPremium == null) return <Loading />
  if (!isPremium)
    return (
      <Flex sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <RestrictPremiumFeature />
      </Flex>
    )
  return children
}

export function ProtocolPageWrapper({ children }: { children: any }) {
  const { protocol } = useParams<{ protocol: any }>()
  const history = useHistory()
  const foundProtocol = Object.values(ProtocolEnum).find((_protocol) => _protocol === protocol)
  if (!foundProtocol) {
    history.replace('/')
  }
  return children
}
