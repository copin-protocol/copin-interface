import dayjs from 'dayjs'
import { CandlestickData } from 'lightweight-charts'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import { ProtocolEnum, TimeframeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getTokenTradeSupport } from 'utils/config/trades'

import { TimeRangeProps } from './ChartPositions/types'

type ChartDataArgs = {
  indexToken: string
  protocol: ProtocolEnum
  timeframe: TimeframeEnum
  timeRange?: TimeRangeProps
}

const useChartPositionData = ({ protocol, indexToken, timeframe = TimeframeEnum.H1, timeRange }: ChartDataArgs) => {
  const tokenTrade = getTokenTradeSupport(protocol)?.[indexToken]
  const to = useMemo(() => (timeRange ? timeRange.to : dayjs().utc().valueOf()), [timeRange])
  const from = useMemo(
    () => (timeRange ? dayjs(timeRange.from).utc().valueOf() : dayjs(to).utc().subtract(365, 'day').valueOf()),
    [timeRange, to]
  )

  const timezone = useMemo(() => new Date().getTimezoneOffset() * 60, [])
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, tokenTrade?.symbol, from, to, timeframe],
    () => getChartDataV2({ symbol: tokenTrade?.symbol ?? '', timeframe, from, to }),
    {
      retry: 0,
      enabled: !!tokenTrade?.symbol,
    }
  )
  const chartData = useMemo(
    () =>
      data
        ?.map((e) => {
          return {
            open: e.open,
            close: e.close,
            high: e.high,
            low: e.low,
            time: dayjs(e.timestamp).utc().unix() - timezone,
          } as CandlestickData
        })
        ?.sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0)) ?? [],
    [data, timezone]
  )
  return { data, chartData, isLoading, timezone, from, to, tokenTrade }
}

export default useChartPositionData
