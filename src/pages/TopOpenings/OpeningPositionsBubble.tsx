import { useSize } from 'ahooks'
import { useEffect, useRef, useState } from 'react'

import BubbleChart, { BubbleChartData } from 'components/@charts/BubbleChartPositions'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import { PositionData } from 'entities/trader'
import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeSupport } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'

const OpeningPositionsBubble = ({ data }: { data: PositionData[] }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedId, setSelectedId] = useState<string>()
  const [selectedProtocol, setSelectedProtocol] = useState<string>()
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const size = useSize(wrapperRef)
  const sizeRef = useRef<{ width: number; height: number }>()
  const chartRef = useRef<{ node: SVGSVGElement | null; onDataUpdated: (data: BubbleChartData[]) => void }>()

  const transformData = (data: PositionData[]) =>
    data.map((item) => ({
      id: item.id,
      title: addressShorten(item.account),
      value: item.size,
      token: getTokenTradeSupport(item.protocol)?.[item.indexToken]?.symbol ?? '',
      leverage: item.leverage,
      isLong: item.isLong,
      protocol: item.protocol,
    }))

  useEffect(() => {
    if (!size) return
    // if (statistics === undefined) return;
    const transformedData = transformData(data)
    if (
      chartRef.current &&
      sizeRef.current &&
      sizeRef.current.width === size.width &&
      sizeRef.current.height === size.height
    ) {
      const node = chartRef.current.onDataUpdated(transformedData)
      if (containerRef.current) containerRef.current.append(node as any)
    } else {
      const chart = BubbleChart(transformedData, {
        width: size.width,
        height: size.height,
        onSelect: (data: BubbleChartData) => {
          setSelectedId(data.id)
          setSelectedProtocol(data.protocol)
          setOpenDrawer(true)
        },
      })
      if (!chart) return
      chartRef.current = chart
      sizeRef.current = size
      if (containerRef.current) containerRef.current.append(chart.node as any)
    }

    return () => {
      chartRef.current?.node && chartRef.current.node.remove()
    }
  }, [data, size])

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      {size && <div ref={containerRef} style={{ width: size.width, height: size.height }} />}
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={() => setOpenDrawer(false)}
        protocol={selectedProtocol as ProtocolEnum}
        id={selectedId}
        chartProfitId="top-opening-bubble-chart"
      />
    </div>
  )
}

export default OpeningPositionsBubble
