import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'

export function DifferentialBar({
  sourceRate,
  targetRate,
  sourceColor = themeColors.green1,
  targetColor = themeColors.red1,
  height = 8,
}: {
  sourceRate: number // percentage
  targetRate: number // percentage
  sourceColor?: string
  targetColor?: string
  height?: number
}) {
  const isEdge = sourceRate === 100 || sourceRate === 0
  return (
    <Flex width="100%" height={height}>
      <Box
        width={`calc(${sourceRate}%)`}
        height="100%"
        sx={{
          background: sourceColor,
          clipPath: isEdge ? undefined : 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
        }}
      ></Box>
      {!isEdge && (
        <Box width="1px" sx={{ position: 'relative', flexShrink: 0 }}>
          {/* <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-block',
            borderStyle: 'solid',
            borderWidth: '4px',
            borderTopColor: sourceColor,
            borderLeftColor: 'green1',
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
          }}
          width="0"
          height="0"
        ></Box> */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'inline-block',
              width: `${height}px`,
              height: '100%',
              background: targetColor,
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            }}
          ></Box>
        </Box>
      )}
      <Box width={`calc(${targetRate}%)`} height="100%" sx={{ background: targetColor }}></Box>
    </Flex>
  )
}
