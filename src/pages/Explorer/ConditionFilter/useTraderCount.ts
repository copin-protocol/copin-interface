import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTradersCounter, getTradersCounterGraphql } from 'apis/traderApis'
import { ConditionFormValues, FilterValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderCounter, TraderData } from 'entities/trader'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { extractFiltersFromFormValues } from 'utils/helpers/graphql'

import { formatRankingRanges } from '../helpers/formatRanges'
import { TradersContextData } from '../useTradersContext'
import { FilterTabEnum } from './configs'

export default function useTradersCount({
  type,
  protocols,
  filterTab,
  ranges,
  enabled = true,
  onSuccess,
}: {
  ranges: FilterValues[]
  type: TimeFilterByEnum
  protocols: ProtocolEnum[]
  filterTab: TradersContextData['filterTab']
  enabled?: boolean
  onSuccess?: (data?: TraderCounter[]) => void
}) {
  const [_ranges, setRanges] = useState<FilterValues[]>(ranges)
  const handleCallAPi = useMemo(
    () =>
      debounce(function (ranges: FilterValues[]) {
        setRanges(ranges)
      }, 1000),
    []
  )
  useEffect(() => {
    if (isEqual(ranges, _ranges)) return
    handleCallAPi(ranges)
  }, [ranges])

  const { data, isFetching, refetch } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_COUNTER, _ranges, type, protocols, enabled],
    () =>
      filterTab === FilterTabEnum.LABELS
        ? getTradersCounterGraphql([..._ranges, { field: 'protocol', in: protocols }, { field: 'type', match: type }])
        : getTradersCounter(
            protocols,
            {
              ranges: filterTab === FilterTabEnum.RANKING ? formatRankingRanges(_ranges) : _ranges,
            },
            type
          ),
    {
      keepPreviousData: true,
      retry: 0,
      enabled,
      onSuccess: (data) => {
        onSuccess?.(data)
      },
    }
  )
  return { data, isLoading: isFetching, refetch }
}

export function useTraderCountState({ defaultFormValues }: { defaultFormValues: ConditionFormValues<TraderData> }) {
  const [ranges, setRanges] = useState<FilterValues[]>(extractFiltersFromFormValues(defaultFormValues))

  const handleChangeRanges = (formValues: ConditionFormValues<TraderData>) => {
    const _ranges = extractFiltersFromFormValues(formValues)
    setRanges(_ranges)
  }
  return { ranges, handleChangeRanges }
}
