import { UseQueryOptions, useQuery } from 'react-query'

import { getUserSubscription } from 'apis/subscription'
import { UserSubscriptionData } from 'entities/user'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useUserSubscription(options?: UseQueryOptions<UserSubscriptionData>) {
  const { enabled, ...opts } = options ?? {}
  const { isAuthenticated, profile } = useAuthContext()
  return useQuery<UserSubscriptionData>([QUERY_KEYS.GET_USER_SUBSCRIPTION, profile?.id], () => getUserSubscription(), {
    enabled: enabled == null ? !!isAuthenticated && !!profile?.id : enabled && !!isAuthenticated && !!profile?.id,
    ...(opts ?? {}),
  })
}
