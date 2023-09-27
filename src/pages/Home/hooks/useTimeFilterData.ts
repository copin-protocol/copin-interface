import { useQuery } from 'react-query'

import { getTradersApi } from 'apis/traderApis'
import { RequestBodyApiData } from 'apis/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

const useTimeFilterData = ({
  protocol,
  tab,
  requestData,
  timeOption,
  isRangeSelection,
}: {
  protocol: ProtocolEnum
  tab: string
  requestData: RequestBodyApiData
  timeOption: TimeFilterProps
  isRangeSelection: boolean
}) => {
  const { data: timeTraders, isFetching: loadingTimeTraders } = useQuery(
    [QUERY_KEYS.GET_TOP_TRADERS, timeOption.id, requestData, tab, protocol],
    () =>
      getTradersApi({
        protocol,
        body: {
          ...requestData,
          queries: [...(requestData.queries ?? []), { fieldName: 'type', value: timeOption.id }],
        },
      }),
    { keepPreviousData: true, retry: 0, enabled: !!timeOption && !isRangeSelection }
  )
  return { timeTraders, loadingTimeTraders }
}

export default useTimeFilterData
