import { useQuery as useApolloQuery } from '@apollo/client'
import { TraderGraphQLResponse } from 'graphql/entities/traders.graph'
import {
  SEARCH_TRADERS_STATISTIC_FUNCTION_NAME,
  SEARCH_TRADERS_STATISTIC_QUERY,
  SEARCH_TRADER_STATISTIC_INDEX,
} from 'graphql/query'
import { useEffect, useMemo, useRef } from 'react'

import { normalizeTraderPayload } from 'apis/traderApis'
import { RequestBodyApiData } from 'apis/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ResponseTraderData, TraderData } from 'entities/trader'
import useSearchParams from 'hooks/router/useSearchParams'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
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

  //Sort data by Pnl and RealisedPnL
  const { searchParams, setSearchParams } = useSearchParams()

  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const prevPnlSettingsRef = useRef({
    pnlWithFeeEnabled,
  })
  useEffect(() => {
    const currentPage = Number(searchParams[URL_PARAM_KEYS.HOME_PAGE] || '1')
    const sortByParam = (searchParams[URL_PARAM_KEYS.EXPLORER_SORT_BY] as keyof TraderData | undefined) ?? 'pnl'
    const prevSettings = prevPnlSettingsRef.current

    if (
      prevSettings.pnlWithFeeEnabled !== pnlWithFeeEnabled &&
      !isNaN(currentPage) &&
      currentPage > 1 &&
      ((sortByParam as string) === 'pnl' || (sortByParam as string) === 'realisedPnl')
    ) {
      setSearchParams({ [URL_PARAM_KEYS.HOME_PAGE]: '1' })
    }

    prevPnlSettingsRef.current = {
      pnlWithFeeEnabled,
    }
  }, [pnlWithFeeEnabled, searchParams, setSearchParams])

  // FETCH DATA
  const queryVariables = useMemo(() => {
    const index = 'copin.position_statistics'

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

    return { index, body }
  }, [requestData, selectedProtocols, timeOption, pnlWithFeeEnabled])

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
