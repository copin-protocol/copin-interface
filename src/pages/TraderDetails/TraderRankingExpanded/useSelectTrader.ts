import { useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderApi } from 'apis/traderApis'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { HandleSelectTrader } from './FindAndSelectTrader'

export default function useSelectTrader({
  account = '',
  protocol = ProtocolEnum.GMX,
  onSuccess,
  timeOption,
  enabled = true,
}: {
  account: string | undefined
  protocol: ProtocolEnum | undefined
  onSuccess: HandleSelectTrader
  timeOption: TimeFilterProps
  enabled?: boolean
}) {
  const [error, setError] = useState(false)

  const { isFetching } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, account, timeOption.id],
    () => getTraderApi({ account, protocol, type: timeOption.id, returnRanking: true }),
    {
      enabled: enabled && !!account,
      onSettled(data, error) {
        !!data && onSuccess(data)
        if (error || !data) setError(true)
      },
    }
  )
  return { isLoading: isFetching, error, setError }
}
