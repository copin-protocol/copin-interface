import React from 'react'

import { Box, Flex, Grid } from 'theme/base'

const DesktopLayout = ({ children }: { children: JSX.Element[] }) => {
  return (
    <Grid
      sx={{
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `
    "ACCOUNT ACCOUNT ACCOUNT" minmax(60px, 60px)
    "BALANCES INFO POSITIONS" minmax(0px, 1fr) / 320px 1fr 510px
    `,
      }}
    >
      <Box
        id="ACCOUNT"
        sx={{
          gridArea: 'ACCOUNT / ACCOUNT / ACCOUNT',
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[0]}
      </Box>
      <Box
        id="BALANCES"
        flex="1"
        sx={{
          borderRight: 'small',
          borderColor: 'neutral4',
          gridArea: 'BALANCES / BALANCES / BALANCES',
        }}
      >
        {children[1]}
      </Box>

      <Box id="INFO" sx={{ gridArea: 'INFO / INFO / INFO' }}>
        <Flex flexDirection="column" height="100%">
          <Box height="260px">{children[2]}</Box>
          <Flex flexDirection="column" height="calc(100% - 260px)" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
            {children[3]}
          </Flex>
        </Flex>
      </Box>

      <Flex
        id="POSITIONS"
        flexDirection="column"
        sx={{
          gridArea: 'POSITIONS / POSITIONS / POSITIONS',
          borderLeft: 'small',
          borderColor: 'neutral4',
          height: '100%',
        }}
      >
        {children[4]}
      </Flex>
    </Grid>
  )
}

export default DesktopLayout
