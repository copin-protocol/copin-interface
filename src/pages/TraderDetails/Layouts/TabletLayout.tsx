import React from 'react'

import { Box, Flex } from 'theme/base'

import { LayoutProps } from './types'

const TabletLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Box
        width="100%"
        height={60}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[0]}
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
          <Box>{children[1]}</Box>
        </Box>
        <Box flex="0 0 500px">
          <Flex flexDirection="column" height="100%">
            <Box
              height={261}
              sx={{
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              {children[5]}
            </Box>
            <Box sx={{ position: 'relative' }} flex="1">
              {children[6]}
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
          {children[2]}
        </Flex>
        <Box width="calc(100% - 350px)" p={12}>
          {children[3]}
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
