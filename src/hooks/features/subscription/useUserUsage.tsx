import { useQuery } from 'react-query'

import { getUserSubscriptionUsageApi } from 'apis/subscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'

const useUserUsage = () => {
  const { profile } = useAuthContext()
  const { data, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE, profile?.subscription?.plan, profile?.id],
    queryFn: () => getUserSubscriptionUsageApi(),
    enabled: !!profile?.id,
  })
  return { usage: data, reloadUsage: refetch, loadingUsage: isLoading }
}

export default useUserUsage
