import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi } from 'apis/copyTradeApis'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useAllCopyTrades() {
  const { myProfile } = useMyProfileStore()
  const { data: allCopyTrades } = useQuery(
    [QUERY_KEYS.USE_GET_ALL_COPY_TRADES, myProfile?.id],

    () => getCopyTradeSettingsListApi(),
    {
      enabled: !!myProfile?.id,
      retry: 0,
      keepPreviousData: true,
    }
  )
  return { allCopyTrades: myProfile ? allCopyTrades : undefined }
}
