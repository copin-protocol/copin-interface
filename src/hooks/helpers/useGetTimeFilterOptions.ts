import { useMemo } from 'react'

import { ALL_TIME_FILTER_OPTIONS, TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import useInternalRole from 'hooks/features/useInternalRole'

export default function useGetTimeFilterOptions() {
  const isInternal = useInternalRole()
  const timeFilterOptions = useMemo(() => {
    return isInternal ? ALL_TIME_FILTER_OPTIONS : TIME_FILTER_OPTIONS
  }, [isInternal])
  const defaultTimeOption = isInternal ? ALL_TIME_FILTER_OPTIONS[4] : TIME_FILTER_OPTIONS[3] // Default 30 days
  return { timeFilterOptions, defaultTimeOption }
}
