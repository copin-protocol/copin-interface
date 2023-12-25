import { useQueries } from 'react-query'

import { getAllMyCopyTradersApi } from 'apis/copyTradeApis'
import { MyAllCopyTradersData } from 'entities/trader'
import { useAuthContext } from 'hooks/web3/useAuth'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useGetAllCopyTrades() {
  const { profile: myProfile } = useAuthContext()
  const data = useQueries(queriesFactory(myProfile?.id))

  return {
    copiedTraders: data?.map?.((_data) => _data?.data ?? []) as unknown as MyAllCopyTradersData[],
  }
}

const queriesFactory = (profileId: string | undefined) =>
  Object.values(ProtocolEnum).map((protocol) => {
    return {
      queryKey: [QUERY_KEYS.USE_GET_ALL_COPY_TRADES_WITH_DELETED, protocol, profileId],
      queryFn: () => getAllMyCopyTradersApi({ protocol }),
    }
  })
