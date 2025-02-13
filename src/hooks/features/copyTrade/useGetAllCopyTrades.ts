import { useQuery } from 'react-query'

import { getAllMyCopyTradersApi } from 'apis/copyTradeApis'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useGetAllCopyTrades(params?: { copyWalletIds: string[] | undefined; enabled?: boolean }) {
  const { profile: myProfile } = useAuthContext()

  const { data } = useQuery(
    [QUERY_KEYS.GET_ALL_MY_COPY_TRADERS, params, myProfile?.id],
    () => getAllMyCopyTradersApi({ copyWalletIds: params?.copyWalletIds }),
    {
      keepPreviousData: true,
      enabled: !!myProfile?.id && (params?.enabled == null || params.enabled),
      select(data) {
        return {
          copyingTraders: data?.copyingTraders?.filter?.((_t) => !!_t),
          deletedTraders: data?.deletedTraders?.filter?.((_t) => !!_t),
        }
      },
    }
  )

  return {
    copiedTraders: data,
  }
}
