import { useQuery as useApolloQuery } from '@apollo/client'
import { TraderGraphQLResponse } from 'graphql/entities/traders.graph'
import { SEARCH_TRADERS_QUERY } from 'graphql/traders.graph'
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
}: {
  requestData: RequestBodyApiData
  timeOption: TimeFilterProps
  selectedProtocols: ProtocolEnum[]
  setSelectedProtocols: (protocols: ProtocolEnum[]) => void
  isRangeSelection?: boolean
}) => {
  const isAllowFetchData = !!timeOption && !isRangeSelection

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.position_statistics'

    const { sortBy, ranges, pagination } = normalizeTraderPayload(requestData)

    const rangeFilters = transformGraphqlFilters(ranges ?? [])

    const query = [
      ...rangeFilters,
      { field: 'protocol', in: selectedProtocols },
      { field: 'type', match: timeOption.id },
    ]
    // if (!!selectedProtocols?.length && selectedProtocols.length !== RELEASED_PROTOCOLS.length) {
    //   query.push({ field: 'protocol', in: selectedProtocols })
    // }

    const body = {
      filter: {
        and: query,
      },
      sorts: [{ field: sortBy, direction: requestData.sortType }],
      paging: { size: pagination?.limit, from: pagination?.offset },
    }

    return { index, body }
  }, [requestData, selectedProtocols, timeOption])

  const {
    data: traders,
    loading,
    previousData,
  } = useApolloQuery<TraderGraphQLResponse<ResponseTraderData>>(SEARCH_TRADERS_QUERY, {
    variables: queryVariables,
    skip: !isAllowFetchData,
  })

  return { traders: traders?.searchPositionStatistic || previousData?.searchPositionStatistic, loading }
}

export default useTimeFilterData
