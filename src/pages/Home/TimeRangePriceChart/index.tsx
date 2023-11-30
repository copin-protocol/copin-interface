import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import TimeRangeSelection from 'components/Charts/TimeRangeSelection'
import { TimeframeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

const chartFrom = dayjs().utc().subtract(90, 'days').valueOf()
const chartTo = dayjs().utc().valueOf()

const TimeRangePriceChart = ({
  from,
  to,
  onChange,
  triggerResize,
  disabled,
}: {
  from: Date
  to?: Date
  onChange: (params: { from: Date; to: Date }) => void
  triggerResize?: any
  disabled?: boolean
}) => {
  const [rect, setRect] = useState<{ width: number; height: number }>({ width: window.innerWidth - 8, height: 240 })
  useEffect(() => {
    if (!chartRef.current) return
    const resize = () => {
      setRect({ width: chartRef.current?.clientWidth ?? 0, height: chartRef.current?.clientHeight ?? 0 })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [triggerResize])
  const chartRef = useRef<HTMLDivElement>(null)
  const { data } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, 'BTC', chartFrom, chartTo, TimeframeEnum.H4],
    () => getChartDataV2({ symbol: 'BTC', timeframe: TimeframeEnum.H4, from: chartFrom, to: chartTo }),
    {
      retry: 0,
    }
  )

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      {data && data.length > 0 && rect.width > 0 && rect.height > 0 && (
        <TimeRangeSelection
          data={data}
          width={rect.width}
          height={rect.height}
          from={from}
          to={to}
          onChange={onChange}
        />
      )}
    </div>
  )
}

export default TimeRangePriceChart
