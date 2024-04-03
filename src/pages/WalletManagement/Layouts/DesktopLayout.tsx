import { Box, Grid } from 'theme/base'

import { LayoutProps } from './types'

const DesktopLayout = ({ walletList, assetDistribution, header }: LayoutProps) => {
  return (
    <Grid
      sx={{
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `
          "HEADER HEADER" minmax(60px, 60px)
          "WALLETS DISTRIBUTION" minmax(0px, 1fr) / 1fr 400px
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
        {header}
      </Box>
      <Box
        id="WALLETS"
        sx={{
          gridArea: 'WALLETS / WALLETS',
          overflow: 'hidden',
        }}
      >
        {walletList}
      </Box>

      <Box
        id="DISTRIBUTION"
        sx={{
          gridArea: 'DISTRIBUTION / DISTRIBUTION',
          borderLeft: 'small',
          borderColor: 'neutral4',
          overflow: 'auto',
        }}
      >
        <Box sx={{ height: '100%', minHeight: 650 }}>{assetDistribution}</Box>
      </Box>
    </Grid>
  )
}

export default DesktopLayout
