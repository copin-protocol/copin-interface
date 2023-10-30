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
      {children[1]}
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
          <Box>
            {children[2]}
            {children[3]}
          </Box>
        </Box>
        <Box flex="0 0 500px">
          {children[5]}
          {/* <Flex flexDirection="column" height="100%">
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
          </Flex> */}
        </Box>
      </Flex>
    </>
  )
}

export default TabletLayout
