import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getTradersCounter } from 'apis/traderApis'
import { ConditionFormValues, FilterValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { extractFiltersFromFormValues } from 'utils/helpers/graphql'

import { formatRankingRanges } from '../helpers/formatRankingRanges'
import { TradersContextData } from '../useTradersContext'
import { FilterTabEnum } from './configs'

export default function useTradersCount({
  timeOption,
  protocols,
  filterTab,
  ranges,
}: {
  ranges: FilterValues[]
  timeOption: TradersContextData['timeOption']
  protocols: ProtocolEnum[]
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
    [QUERY_KEYS.GET_TRADER_FILTER_COUNTER, _ranges, timeOption, protocols],
    () =>
      getTradersCounter(
        protocols,
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
  const [ranges, setRanges] = useState<FilterValues[]>(extractFiltersFromFormValues(defaultFormValues))

  const handleChangeRanges = (formValues: ConditionFormValues<TraderData>) => {
    const _ranges = extractFiltersFromFormValues(formValues)
    setRanges(_ranges)
  }
  return { ranges, handleChangeRanges }
}
