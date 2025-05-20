import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'

export default function useGetTimeFilterOptions() {
  // const isInternal = useInternalRole()
  // const timeFilterOptions = useMemo(() => {
  //   return isInternal ? ALL_TIME_FILTER_OPTIONS : TIME_FILTER_OPTIONS
  // }, [isInternal])
  const defaultTimeOption = ALL_TIME_FILTER_OPTIONS[4] // Default 30 days
  return { timeFilterOptions: ALL_TIME_FILTER_OPTIONS, defaultTimeOption }
}
