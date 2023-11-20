import { useQuery } from 'react-query'

import { getUserSubscription } from 'apis/subscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useUserSubscription() {
  const { isAuthenticated, profile } = useAuthContext()
  return useQuery([QUERY_KEYS.GET_USER_SUBSCRIPTION, profile?.id], () => getUserSubscription(), {
    enabled: !!isAuthenticated && !!profile?.id,
  })
}
