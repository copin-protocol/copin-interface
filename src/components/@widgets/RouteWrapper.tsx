import { useHistory, useParams } from 'react-router-dom'

import { RestrictPremiumFeature } from 'components/@widgets/SubscriptionRestrictModal'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import Loading from 'theme/Loading'
import { Flex } from 'theme/base'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'

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
  const foundProtocol = RELEASED_PROTOCOLS.find((_protocol) => _protocol === protocol)
  if (!foundProtocol) {
    history.replace('/')
  }
  return children
}
