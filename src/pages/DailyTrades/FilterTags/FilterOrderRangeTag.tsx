import { ORDER_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import FilterRangeTags from 'components/@widgets/TableFilter/FilterRangeTags'
import { resetRangeFilter } from 'components/@widgets/TableFilter/helpers'
import useSearchParams from 'hooks/router/useSearchParams'

import { useDailyOrdersContext } from '../Orders/useOrdersProvider'

export default function FilterOrderRangesTag() {
  const { setSearchParams } = useSearchParams()
  const { ranges } = useDailyOrdersContext()
  if (!ranges.length) return null
  return (
    <FilterRangeTags
      ranges={ranges}
      rangeConfigMapping={ORDER_RANGE_CONFIG_MAPPING}
      onClear={(key) => resetRangeFilter({ urlParamKey: key, setSearchParams })}
    />
  )
}
