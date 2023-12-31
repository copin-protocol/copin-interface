import { UseQueryOptions, useQuery } from 'react-query'

import { getTokenTradesByTraderApi } from 'apis/positionApis'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useGetTokensTraded(
  data: { account: string; protocol: ProtocolEnum },
  queryOptions?: Omit<UseQueryOptions<string[], any, string[], any>, 'queryKey'>
) {
  const { account, protocol } = data
  return useQuery(
    [QUERY_KEYS.GET_TOKEN_TRADES_BY_TRADER, account, protocol],
    () => getTokenTradesByTraderApi({ protocol, account }),
    { enabled: !!protocol && !!account, retry: 0, ...(queryOptions ?? {}) }
  )
}
