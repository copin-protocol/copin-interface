import FilterRangeTags from 'components/@widgets/TableFilter/FilterRangeTags'
import { resetRangeFilter } from 'components/@widgets/TableFilter/helpers'

import { TOP_POSITION_RANGE_CONFIG_MAPPING } from '../configs'
import useGetFilterRange from './useGetFilterRange'

export default function FilterPositionRangesTags({ allowedFilter }: { allowedFilter?: boolean }) {
  const { ranges, setSearchParams } = useGetFilterRange()
  if (!ranges.length) return null
  return (
    <FilterRangeTags
      ranges={ranges}
      rangeConfigMapping={TOP_POSITION_RANGE_CONFIG_MAPPING}
      onClear={allowedFilter ? (key) => resetRangeFilter({ urlParamKey: key, setSearchParams }) : undefined}
    />
  )
}
