import { RestrictPremiumFeature } from 'components/@widgets/SubscriptionRestrictModal'
import { useIsPro } from 'hooks/features/subscription/useSubscriptionRestrict'
import Loading from 'theme/Loading'
import { Flex } from 'theme/base'

export function PremiumRouteWrapper({ children }: { children: any }) {
  const isPremium = useIsPro()

  if (isPremium == null) return <Loading />
  if (!isPremium)
    return (
      <Flex sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <RestrictPremiumFeature />
      </Flex>
    )
  return children
}
