import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

import { renderTrader } from 'pages/MyProfile/renderProps'
import { Box, Flex, Type } from 'theme/base'
import colors from 'theme/colors'

export interface ScoreChartData {
  subject: string
  value: number
  comparedValue?: number
  fullMark: number
}

const ScoreChart = ({
  data,
  wrapperWidth = '100%',
  width = 450,
  height = 450,
  hiddenAxisTitle = false,
  account,
  comparedAccount,
  outerRadius,
}: {
  data: ScoreChartData[]
  wrapperWidth?: number | string
  width?: number
  height?: number
  hiddenAxisTitle?: boolean
  account?: string
  comparedAccount?: string
  outerRadius?: number
}) => {
  const hasComparedData = data.every((values: any) => !!values.comparedValue)

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload.length) return <div></div>
    const value = payload[0].value || 0
    const comparedValue = payload[0]?.payload?.comparedValue || 0
    if (hasComparedData && account && comparedAccount) {
      return (
        <Flex sx={{ gap: 3, width: 320 }}>
          <Type.Caption sx={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
            <Box as="span" sx={{ mr: 2, display: 'inline', borderLeft: '4px solid', borderLeftColor: 'primary1' }} />
            <Box display="inline">{renderTrader(account)}</Box>
            <Box as="span">Better than {value.toFixed(0)}% traders</Box>
          </Type.Caption>
          <Type.Caption sx={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
            <Box as="span" sx={{ mr: 2, display: 'inline', borderLeft: '4px solid', borderLeftColor: 'orange1' }} />
            <Box display="inline">{renderTrader(comparedAccount)}</Box>
            <Box as="span">Better than {comparedValue.toFixed(0)}% traders</Box>
          </Type.Caption>
        </Flex>
      )
    }
    return <Type.Caption>Better than {value.toFixed(0)}% traders</Type.Caption>
  }
  return (
    <ResponsiveContainer width={wrapperWidth} height={height}>
      <RadarChart outerRadius={outerRadius} width={width} height={height} data={data}>
        <PolarGrid stroke={colors(true).neutral4} />
        <PolarAngleAxis
          domain={[0, 100]}
          color={colors(true).neutral3}
          dataKey="subject"
          fontSize={13}
          dy={4}
          tick={!hiddenAxisTitle}
        />
        {/* <Pola angle={30} domain={[0, 150]} /> */}
        <Radar
          isAnimationActive={false}
          name="Trader"
          dataKey="value"
          stroke={colors(true).primary1}
          fill={colors(true).primary1}
          fillOpacity={0.5}
        />
        {hasComparedData && (
          <Radar
            isAnimationActive={false}
            name="Compared Trader"
            dataKey="comparedValue"
            stroke={colors(true).orange2}
            fill={colors(true).orange2}
            fillOpacity={0.5}
          />
        )}
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
