import { POSITION_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import FilterRangeTags from 'components/@widgets/TableFilter/FilterRangeTags'
import { resetRangeFilter } from 'components/@widgets/TableFilter/helpers'
import useSearchParams from 'hooks/router/useSearchParams'

import { useDailyPositionsContext } from '../Positions/usePositionsProvider'

export default function FilterPositionRangesTag() {
  const { setSearchParams } = useSearchParams()
  const { ranges } = useDailyPositionsContext()
  if (!ranges.length) return null
  return (
    <>
      <FilterRangeTags
        ranges={ranges}
        rangeConfigMapping={POSITION_RANGE_CONFIG_MAPPING}
        onClear={(key) => resetRangeFilter({ urlParamKey: key, setSearchParams })}
      />
    </>
  )
}
