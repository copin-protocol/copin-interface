import React, { useEffect, useRef } from 'react'

import Pie from 'components/Charts/Pie'

const RED = '#EC313A'
const GREEN = '#1CD787'
const BLUE = '#0E70BE'

const COLORS = [RED, BLUE, GREEN]

const ScoreChart = ({ data, width = 250, height = 250 }: any) => {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // if (statistics === undefined) return;
    const normalizeData = Object.keys(data).map((key, i) => ({
      name: key,
      value: Number((data[key] ?? 0).toFixed(1)),
      color: COLORS[Math.floor(i / 4)],
    }))
    const plot = Pie(normalizeData, {})
    if (!plot) return
    if (containerRef.current) containerRef.current.append(plot)
    return () => plot.remove()
  }, [data])

  return <div ref={containerRef} style={{ width }} />
}

export default ScoreChart
