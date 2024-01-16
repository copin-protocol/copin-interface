import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  timeOption,
  protocol,
  filterTab,
  ranges,
}: {
  ranges: FilterValues[]
  timeOption: TradersContextData['timeOption']
  protocol: TradersContextData['protocol']
  filterTab: TradersContextData['filterTab']
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
  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_COUNTER, _ranges, timeOption, protocol],
    () =>
      getTradersCounter(
        protocol,
        {
          ranges: filterTab === FilterTabEnum.RANKING ? formatRankingRanges(_ranges) : _ranges,
        },
        timeOption.id
      ),
    { keepPreviousData: true, retry: 0 }
  )
  return { data, isLoading: isFetching }
}

export function useTraderCountState({ defaultFormValues }: { defaultFormValues: ConditionFormValues<TraderData> }) {
  const [ranges, setRanges] = useState<FilterValues[]>(getFiltersFromFormValues(defaultFormValues))
  const handleChangeRanges = useCallback((formValues: ConditionFormValues<TraderData>) => {
    const _ranges = getFiltersFromFormValues(formValues)
    setRanges(_ranges)
  }, [])
  return { ranges, handleChangeRanges }
}
