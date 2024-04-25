import { XCircle } from '@phosphor-icons/react'
import { useSize } from 'ahooks'
import React, { useEffect, useRef, useState } from 'react'

import Container from 'components/@ui/Container'
import BubbleChart, { BubbleChartData } from 'components/Charts/BubbleChart'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeSupport } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'

// const RED = '#EC313A'
// const GREEN = '#1CD787'
// const BLUE = '#0E70BE'

// const COLORS = [RED, BLUE, GREEN]

const OpeningPositionsBubble = ({ data, protocol }: { data: PositionData[]; protocol: ProtocolEnum }) => {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string>()
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
        onSelect: (data: BubbleChartData) => setSelectedId(data.id),
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

      {!!selectedId && (
        <Drawer
          isOpen={!!selectedId}
          onDismiss={() => setSelectedId(undefined)}
          mode="right"
          size={isMobile ? '100%' : '60%'}
          background="neutral6"
        >
          <Container sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3 }}
              onClick={() => setSelectedId(undefined)}
            />
            <PositionDetails protocol={protocol} id={selectedId} isShow={!!selectedId} />
          </Container>
        </Drawer>
      )}
    </div>
  )
}

export default OpeningPositionsBubble
