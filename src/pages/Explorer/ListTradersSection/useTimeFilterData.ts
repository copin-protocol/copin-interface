import { useQuery as useApolloQuery } from '@apollo/client'
import { TraderGraphQLResponse } from 'graphql/entities/traders.graph'
import {
  SEARCH_TRADERS_STATISTIC_FUNCTION_NAME,
  SEARCH_TRADERS_STATISTIC_QUERY,
  SEARCH_TRADER_STATISTIC_INDEX,
} from 'graphql/query'
import { useMemo } from 'react'

import { normalizeTraderPayload } from 'apis/traderApis'
import { RequestBodyApiData } from 'apis/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ResponseTraderData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'
import { transformGraphqlFilters } from 'utils/helpers/graphql'

const useTimeFilterData = ({
  requestData,
  timeOption,
  selectedProtocols,
  isRangeSelection = false,
  enabled = true,
}: {
  requestData: RequestBodyApiData
  timeOption: TimeFilterProps
  selectedProtocols: ProtocolEnum[] | null
  isRangeSelection?: boolean
  enabled?: boolean
}) => {
  const isAllowFetchData = !!timeOption && !isRangeSelection

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const { sortBy, ranges, pagination } = normalizeTraderPayload(requestData)

    const rangeFilters = transformGraphqlFilters(ranges ?? [])

    const query = [
      ...rangeFilters,
      { field: 'protocol', in: selectedProtocols ?? [] },
      { field: 'type', match: timeOption.id },
    ]

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: requestData.sortType }],
      paging: { size: pagination?.limit, from: pagination?.offset },
    }

    return { index: SEARCH_TRADER_STATISTIC_INDEX, body }
  }, [requestData, selectedProtocols, timeOption])

  const {
    data: traders,
    loading,
    previousData,
  } = useApolloQuery<TraderGraphQLResponse<ResponseTraderData>>(SEARCH_TRADERS_STATISTIC_QUERY, {
    variables: queryVariables,
    skip: !isAllowFetchData || selectedProtocols == null || !enabled,
  })

  return {
    traders:
      traders?.[SEARCH_TRADERS_STATISTIC_FUNCTION_NAME] || previousData?.[SEARCH_TRADERS_STATISTIC_FUNCTION_NAME],
    loading,
  }
}

export default useTimeFilterData
