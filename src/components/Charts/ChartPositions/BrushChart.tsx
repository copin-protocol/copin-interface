import { useSize } from 'ahooks'
import dayjs from 'dayjs'
import React, { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'

import { getChartDataV2 } from 'apis/positionApis'
import { ChartData, DrawChartData } from 'entities/chart'
import { TimeframeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import BrushBar from '../BrushBar'

// const RED = '#EC313A'
// const GREEN = '#1CD787'
// const BLUE = '#0E70BE'

// const COLORS = [RED, BLUE, GREEN]

const BrushChart = ({
  symbol,
  chartDimensions,
  onBrush,
  from,
  to,
}: {
  symbol: string
  chartDimensions: { width: number; height: number }
  onBrush: (extent: [number, number]) => void
  from?: Date
  to?: Date
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const size = useSize(wrapperRef)
  const sizeRef = useRef<{ width: number; height: number }>()
  const chartRef = useRef<{ node: SVGSVGElement | null; select: (from: Date, to: Date) => SVGSVGElement | null }>()

  const { data } = useQuery(
    [QUERY_KEYS.GET_CHART_DATA, symbol, TimeframeEnum.D1],
    () =>
      getChartDataV2({
        symbol,
        timeframe: TimeframeEnum.D1,
        from: Date.now() - 365 * 24 * 3600 * 1000,
        to: Date.now(),
      }),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )

  const transformData = (data: ChartData[]) =>
    data.map(
      (item) =>
        ({
          open: item.open,
          low: item.low,
          high: item.high,
          close: item.close,
          time: dayjs(item.timestamp).toDate(),
        } as DrawChartData)
    )

  useEffect(() => {
    if (!size || !data) return
    // if (statistics === undefined) return;
    const transformedData = transformData(data)
    if (
      chartRef.current &&
      sizeRef.current &&
      sizeRef.current.width === size.width &&
      sizeRef.current.height === size.height
    ) {
      if (from && to) {
        const maxTimestamp = dayjs(transformedData[transformedData.length - 1].time)
          .local()
          .valueOf()
        const fromTimestamp = dayjs(from).local().valueOf()
        const toTimestamp = dayjs(from).local().valueOf()
        const diff = toTimestamp - fromTimestamp
        let node
        if (toTimestamp > maxTimestamp) {
          node = chartRef.current?.select(
            dayjs(maxTimestamp - diff)
              .utc()
              .toDate(),
            dayjs(maxTimestamp).local().toDate()
          )
        } else {
          node = chartRef.current?.select(from, to)
        }

        if (containerRef.current && node) {
          containerRef.current.append(node as any)
        }
      }
    } else {
      const chart = BrushBar(transformedData, {
        width: size.width,
        height: size.height,
        label: '',
        onChange: ({ from, to }: { from: Date; to: Date }) => {
          onBrush([from.getTime() / 1000, to.getTime() / 1000])
        },
      })
      if (!chart) return
      chartRef.current = chart
      sizeRef.current = size
      if (containerRef.current && chart.node) {
        containerRef.current.append(chart.node as any)
      }
    }

    return () => {
      chartRef.current?.node && chartRef.current.node.remove()
    }
  }, [data, from, onBrush, size, to])

  return (
    <div ref={wrapperRef} style={{ width: chartDimensions.width, height: chartDimensions.height }}>
      <div ref={containerRef} />
    </div>
  )
}

export default BrushChart
