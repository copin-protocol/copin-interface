// import { useReducer } from 'react'
import { Box, Flex, Grid } from 'theme/base'

import { LayoutProps } from './types'

const DesktopLayout = ({ children }: LayoutProps) => {
  // const [positionTopExpanded, toggleTopExpand] = useReducer((state) => !state, false)

  return (
    <Grid
      sx={{
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `
    "HEADER HEADER HEADER" minmax(60px, 60px)
    "CREATE WALLETS DISTRIBUTION" minmax(0px, 1fr) / ${'395px 1fr 360px'}
    `,
      }}
    >
      <Box
        id="HEADER"
        sx={{
          gridArea: 'HEADER / HEADER',
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[0]}
      </Box>
      <Box
        id="WALLETS"
        sx={{
          gridArea: 'WALLETS / WALLETS',
          overflow: 'hidden',
        }}
      >
        {children[1]}
      </Box>

      <Box
        id="CREATE"
        sx={{
          borderRight: 'small',
          borderColor: 'neutral4',
          overflow: 'auto',
        }}
      >
        <Flex flexDirection="column" height="100%">
          {children[2]}
        </Flex>
      </Box>
      <Box
        id="DISTRIBUTION"
        sx={{
          gridArea: 'DISTRIBUTION / DISTRIBUTION',
          borderLeft: 'small',
          borderColor: 'neutral4',
          overflow: 'auto',
          //       display: 'grid',
          //       gridTemplate: `
          // "CHART" minmax(436px, 1fr)
          // "HELP" ${positionTopExpanded ? '0px' : '250px'}
          // `,
        }}
      >
        {children[5]}
        {/* <Box
          sx={{
            gridArea: 'CHART',
            overflow: 'hidden',
            borderBottom: positionTopExpanded ? 'none' : 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          {children[5]}
        </Box>
        <Box sx={{ gridArea: 'HELP', position: 'relative' }}>
          <DirectionButton
            onClick={() => {
              toggleTopExpand()
            }}
            buttonSx={{
              display: 'block',
              top: positionTopExpanded ? undefined : '0px',
              bottom: positionTopExpanded ? '0px' : '0px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            direction={positionTopExpanded ? 'top' : 'bottom'}
          />
          {children[6]}
        </Box> */}
      </Box>
    </Grid>
  )
}

export default DesktopLayout
