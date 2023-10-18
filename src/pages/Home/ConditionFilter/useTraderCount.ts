import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTradersCounter } from 'apis/traderApis'
import { getFiltersFromFormValues } from 'components/ConditionFilterForm/helpers'
import { ConditionFormValues, FilterValues } from 'components/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { QUERY_KEYS } from 'utils/config/keys'

import { formatRankingRanges } from '../helpers/formatRankingRanges'
import { TradersContextData } from '../useTradersContext'
import { FilterTabEnum } from './configs'

export default function useTradersCount({
  defaultFormValues,
  timeOption,
  protocol,
  filterTab,
}: {
  defaultFormValues: ConditionFormValues<TraderData>
  timeOption: TradersContextData['timeOption']
  protocol: TradersContextData['protocol']
  filterTab?: TradersContextData['filterTab']
}) {
  const [ranges, setRanges] = useState<FilterValues[]>(getFiltersFromFormValues(defaultFormValues))
  const handleCallAPi = useMemo(
    () =>
      debounce(function (values: ConditionFormValues<TraderData>) {
        const filterFromForm = getFiltersFromFormValues(values)
        setRanges(filterFromForm)
      }, 1000),
    []
  )

  const { data: tradersCount, isFetching } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_COUNTER, ranges, timeOption, protocol],
    () =>
      getTradersCounter(
        protocol,
        {
          ranges: filterTab === FilterTabEnum.RANKING ? formatRankingRanges(ranges) : ranges,
        },
        timeOption.id
      ),
    { keepPreviousData: true, retry: 0 }
  )
  return { handleCallAPi, tradersCount, isFetching }
}
