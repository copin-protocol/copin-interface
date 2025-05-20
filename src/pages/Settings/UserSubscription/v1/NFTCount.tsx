import { useQuery } from 'react-query'

import { getUserSubscriptionList } from 'apis/subscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'

export default function NFTCount() {
  const { isAuthenticated, profile } = useAuthContext()
  const { data } = useQuery([QUERY_KEYS.GET_USER_SUBSCRIPTION, 'list', profile?.id], () => getUserSubscriptionList(), {
    enabled: !!isAuthenticated && !!profile?.id,
  })
  if (!data?.length) return null
  const count = data.length
  return (
    <Type.Caption color="neutral4">
      Minted: {count} {count > 1 ? 'NFTs' : 'NFT'}
    </Type.Caption>
  )
}
