import dayjs from 'dayjs'
import isEqual from 'lodash/isEqual'
import { useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { checkAvailableDataApi, generateDataApi, getTradersByTimeRangeApi } from 'apis/traderApis'
import { RequestBodyApiData } from 'apis/types'
import { CheckAvailableResultData } from 'entities/trader'
import { CheckAvailableStatus, ProtocolEnum } from 'utils/config/enums'
import { TimeRange } from 'utils/types'

const useRangeFilterData = ({
  protocol,
  tab,
  timeRange,
  requestData,
  isRangeSelection,
}: {
  protocol: ProtocolEnum
  tab: string
  timeRange: TimeRange
  requestData: RequestBodyApiData
  isRangeSelection: boolean
}) => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [progress, setProgress] = useState<CheckAvailableResultData>({})

  const { enableAllRequest, from, to, timeRangeTimestamp } = useMemo(() => {
    const enableAllRequest = !!timeRange?.from && !!timeRange?.to
    const from = dayjs(timeRange.from).utc().valueOf()
    const to = dayjs(timeRange.to).utc().valueOf()
    const timeRangeTimestamp = { from, to }
    return { enableAllRequest, from, to, timeRangeTimestamp }
  }, [timeRange])

  const prevTimeRangeTime = useRef<typeof timeRangeTimestamp>()
  // Generate
  const { data: isGenerated } = useQuery(
    ['generate_data', timeRange, tab, protocol],
    () => {
      setIsRequesting(true)
      setProgress({})
      return generateDataApi(protocol, { from, to })
    },
    {
      enabled: enableAllRequest && !isEqual(prevTimeRangeTime.current, timeRangeTimestamp) && isRangeSelection,
      retry: 5,
      retryDelay: 3_000,
    }
  )
  // Check Available
  const { data: checkAvailable } = useQuery(
    ['check_available_data', timeRange, tab, protocol],
    () => {
      setIsRequesting(true)
      return checkAvailableDataApi(protocol, timeRangeTimestamp)
    },
    {
      enabled:
        enableAllRequest &&
        !!isGenerated &&
        progress?.status !== CheckAvailableStatus.FINISH &&
        !isEqual(prevTimeRangeTime.current, timeRangeTimestamp) &&
        isRangeSelection,
      onSuccess: (data) => setProgress(data),
      refetchInterval: progress?.status !== CheckAvailableStatus.FINISH ? 3_000 : false,
    }
  )

  // Get list Trader
  const { data: rangeTraders } = useQuery(
    ['get_traders', timeRange, requestData, tab, protocol],
    () => {
      setIsRequesting(true)
      return getTradersByTimeRangeApi({
        protocol,
        params: timeRangeTimestamp,
        body: requestData,
      })
    },
    {
      enabled: enableAllRequest && checkAvailable?.status === CheckAvailableStatus.FINISH && isRangeSelection,
      onSettled: () => {
        prevTimeRangeTime.current = timeRangeTimestamp
        setIsRequesting(false)
      },
      keepPreviousData: true,
    }
  )
  return {
    rangeTraders,
    loadingRangeTraders: isRequesting,
    loadingRangeProgress: progress,
  }
}

export default useRangeFilterData
