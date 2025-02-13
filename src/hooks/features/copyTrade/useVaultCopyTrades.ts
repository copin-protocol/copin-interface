import { useQuery } from 'react-query'

import { getVaultCopyTradeSettingsListApi } from 'apis/vaultApis'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useVaultCopyTrades(params?: { enabled?: boolean }) {
  const { myProfile } = useMyProfileStore()
  const { data: allVaultCopyTrades, isLoading } = useQuery(
    [QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS, myProfile?.id],

    () => getVaultCopyTradeSettingsListApi(),
    {
      enabled: !!myProfile?.id && (params?.enabled ?? true),
      retry: 0,
      keepPreviousData: true,
    }
  )
  return { allVaultCopyTrades: myProfile ? allVaultCopyTrades : undefined, isLoading }
}
