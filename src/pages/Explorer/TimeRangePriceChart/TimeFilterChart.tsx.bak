import React, { useEffect, useRef } from 'react'

import RangeFilterFinancial from 'components/Charts/RangeFilterFinancial'
import { DrawChartData } from 'entities/chart'

const TimeFilterChart = ({
  data,
  width,
  height,
  from,
  to,
  onChange,
  disabled,
}: {
  data: DrawChartData[]
  width: number
  height: number
  from: Date
  to: Date
  onChange: (params: { from: Date; to: Date }) => void
  disabled?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<(from: Date, to: Date) => void>()
  const lastRangeRef = useRef<{ from: Date; to: Date }>()
  useEffect(() => {
    // if (statistics === undefined) return;
    const { plot, select } = RangeFilterFinancial(data, {
      disabled,
      width,
      height,
      label: 'BTC/USD',
      onChange: ({ from, to }) => {
        if (!lastRangeRef.current) return
        from.setHours(0, 0, 0, 0)
        to.setHours(0, 0, 0, 0)
        if (
          lastRangeRef.current.from.getTime() === from.getTime() &&
          lastRangeRef.current.to.getTime() === to.getTime()
        )
          return
        onChange({ from, to })
      },
    })
    if (!plot) return
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    lastRangeRef.current = { from, to }
    selectRef.current = select
    if (containerRef.current) {
      containerRef.current.append(plot)
      select(from, to)
    }

    return () => {
      plot.remove()
    }
  }, [data, width, height])

  useEffect(() => {
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    if (
      lastRangeRef.current &&
      lastRangeRef.current.from.getTime() === from.getTime() &&
      lastRangeRef.current.to.getTime() === to.getTime()
    )
      return
    lastRangeRef.current = { from, to }
    if (selectRef.current) selectRef.current(from, to)
  }, [from, to])

  return <div className="time-filter-chart" ref={containerRef} style={{ width, height }} />
}

export default TimeFilterChart
