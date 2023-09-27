import React from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Type } from 'theme/base'
import colors from 'theme/colors'

const ScoreChart = ({ data, width = 450, height = 450 }: any) => {
  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload.length) return <div></div>
    const value = payload[0].value
    return <Type.Caption>Better than {value.toFixed(0)}% traders</Type.Caption>
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart outerRadius={90} width={width} height={height} data={data}>
        <PolarGrid stroke={colors(true).neutral4} />
        <PolarAngleAxis domain={[0, 100]} color={colors(true).neutral3} dataKey="subject" fontSize={13} dy={4} />
        {/* <Pola angle={30} domain={[0, 150]} /> */}
        <Radar
          isAnimationActive={false}
          name="Trader"
          dataKey="value"
          stroke={colors(true).primary1}
          fill={colors(true).primary1}
          fillOpacity={0.5}
        />
        <Tooltip
          cursor={false}
          content={renderTooltip}
          wrapperStyle={{
            background: colors(true).neutral7,
            padding: '2px 6px',
            border: `1px solid ${colors(true).neutral4}`,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default ScoreChart
