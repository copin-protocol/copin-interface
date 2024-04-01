import React from 'react'

import { Box, Flex } from 'theme/base'

import { LayoutProps } from './types'

const TabletLayout = (props: LayoutProps) => {
  return (
    <>
      <Box
        width="100%"
        height={56}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {props.protocolStats}
      </Box>
      <Box
        width="100%"
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {props.traderInfo}
      </Box>

      <Flex
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Box
          flex="1"
          sx={{
            borderRight: 'small',
            borderColor: 'neutral4',
          }}
        >
          <Box>{props.traderStats}</Box>
        </Box>
        <Box flex="1" minHeight={700}>
          <Flex flexDirection="column" height="100%">
            <Box
              height={261}
              sx={{
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              {props.openingPositions}
            </Box>
            <Box sx={{ position: 'relative' }} flex="1">
              {props.closedPositions}
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex width="100%" height="300px">
        <Flex
          width="400px"
          alignItems="center"
          sx={{
            borderRight: 'small',
            borderColor: 'neutral4',
            flexShrink: 0,
          }}
        >
          {props.traderRanking}
        </Flex>
        <Box width="calc(100% - 350px)">
          {props.traderChartPositions}
          {/* <Box
            height={120}
            p={12}
            sx={{
              borderTop: 'small',
              borderColor: 'neutral4',
            }}
          >
            {children[4]}
          </Box> */}
        </Box>
      </Flex>
    </>
  )
}

export default TabletLayout
