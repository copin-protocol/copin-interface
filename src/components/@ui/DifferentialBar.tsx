import { Box, Flex } from 'theme/base'

export function DifferentialBar({
  sourceRate,
  targetRate,
  height = 8,
}: {
  sourceRate: number // percentage
  targetRate: number // percentage
  height?: number
}) {
  return (
    <Flex width="100%" height={height}>
      <Box width={`calc(${sourceRate}% - 6px)`} height="100%" bg="green1"></Box>
      <Box width="12px" sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-block',
            borderStyle: 'solid',
            borderWidth: '4px',
            borderTopColor: 'green1',
            borderLeftColor: 'green1',
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
          }}
          width="0"
          height="0"
        ></Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'inline-block',
            borderStyle: 'solid',
            borderWidth: '4px',
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            borderBottomColor: 'red1',
            borderRightColor: 'red1',
          }}
          width="0"
          height="0"
        ></Box>
      </Box>
      <Box width={`calc(${targetRate}% - 6px)`} height="100%" bg="red1"></Box>
    </Flex>
  )
}
