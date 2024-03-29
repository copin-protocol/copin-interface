import { useQuery } from 'react-query'

import { getAllMyCopyTradersApi } from 'apis/copyTradeApis'
import { useAuthContext } from 'hooks/web3/useAuth'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useGetAllCopyTrades(params?: { copyWalletIds: string[] | undefined }) {
  const { profile: myProfile } = useAuthContext()

  const queriesFactory = async () => {
    return Promise.all(
      Object.values(ProtocolEnum).map((protocol) => {
        return getAllMyCopyTradersApi({ protocol, copyWalletIds: params?.copyWalletIds })
      })
    )
  }

  const { data } = useQuery([QUERY_KEYS.GET_ALL_MY_COPY_TRADERS, params, myProfile?.id], queriesFactory, {
    keepPreviousData: true,
    enabled: !!myProfile?.id,
  })

  return {
    copiedTraders: data ?? [],
  }
}
