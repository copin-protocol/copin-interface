import React, { useEffect, useRef } from 'react'

import Scatterplot from 'components/Charts/Scatterplot'

const TradersChart = ({
  data,
  x,
  y,
  xLabel,
  yLabel,
  selectedIndex,
  width = 650,
  height = 400,
  onSelect,
  onDeselect,
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectRef = useRef<any>()
  const deselectRef = useRef<any>()

  useEffect(() => {
    if (data === undefined) return
    const { plot, select, deselect } = Scatterplot(data, {
      x: (d: any) => d[x],
      y: (d: any) => d[y],
      xLabel,
      yLabel,
      stroke: 'white',
      width,
      height,
      marginBottom: 48,
      title: (d: any) => d.account,
      url: (d: any) => `/trader/${d.account}`,
      onSelect,
      onDeselect,
    })
    selectRef.current = select
    deselectRef.current = deselect
    if (!plot) return
    if (containerRef.current) containerRef.current.append(plot)
    return () => plot.remove()
  }, [data])

  useEffect(() => {
    if (selectedIndex != null) {
      if (selectRef.current) selectRef.current(selectedIndex)
    } else {
      if (deselectRef.current) deselectRef.current(selectedIndex)
    }
  }, [selectedIndex])

  return <div ref={containerRef} style={{ width }} />
}

export default TradersChart
