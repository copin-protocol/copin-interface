import React, { useState } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
import { Box, Flex, Grid } from 'theme/base'

import { LayoutComponents } from './types'

export default function ManagementLayoutDesktop({ balanceMenu, mainSection, positionsTable, stats }: LayoutComponents) {
  const [mainExpanded, setMainExpanded] = useState(false)
  const handleExpand = () => {
    setMainExpanded((prev) => !prev)
  }
  return (
    <Grid
      sx={{
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `"MAIN RIGHT" 100% / 1fr minmax(${mainExpanded ? '0px' : '500px'}, ${
          mainExpanded ? '0px' : '500px'
        })`,
      }}
    >
      <Box
        sx={{
          gridArea: 'MAIN',
          borderRight: 'small',
          borderColor: 'neutral4',
          position: 'relative',
        }}
      >
        <Flex flexDirection="column" height="100%">
          <Box flexShrink={0} sx={{ overflow: 'hidden', borderBottom: 'small', borderColor: 'neutral4' }}>
            {balanceMenu}
          </Box>
          <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
            {mainSection}
          </Box>
        </Flex>
        <DirectionButton
          onClick={handleExpand}
          buttonSx={{ right: mainExpanded ? '0px' : '-16px', top: '-2px' }}
          direction={mainExpanded ? 'left' : 'right'}
        />
      </Box>
      <Box
        sx={{
          gridArea: 'RIGHT',
          overflow: 'hidden',
        }}
      >
        <Flex flexDirection="column" height="100%">
          <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
            {positionsTable}
          </Box>
          <Box height="235px" flexShrink={0} sx={{ overflow: 'hidden' }}>
            {stats}
          </Box>
        </Flex>
      </Box>
    </Grid>
  )
}
