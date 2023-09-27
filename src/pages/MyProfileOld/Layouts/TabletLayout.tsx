import React from 'react'

import { Box, Flex } from 'theme/base'

const TabletLayout = ({ children }: { children: JSX.Element[] }) => {
  return (
    <>
      <Box
        sx={{
          height: 60,
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[0]}
      </Box>
      <Flex>
        <Box width={350} sx={{ position: 'relative', borderRight: 'small', borderColor: 'neutral4' }}>
          <Box sx={{ position: 'sticky', top: 0, width: '100%' }}>{children[1]}</Box>
        </Box>
        <Box flex="1">
          {[2, 3, 4].map((i) => (
            <Box
              key={`children-${i}`}
              sx={{
                borderTop: 'small',
                borderColor: 'neutral4',
              }}
            >
              {children[i]}
            </Box>
          ))}
        </Box>
      </Flex>
    </>
  )
}

export default TabletLayout
