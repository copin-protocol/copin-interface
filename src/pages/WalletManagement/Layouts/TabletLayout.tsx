import { Box } from 'theme/base'

import { LayoutProps } from './types'

const TabletLayout = ({ header, walletList, assetDistribution }: LayoutProps) => {
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
        {header}
      </Box>
      {walletList}
      <Box
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          height: 650,
        }}
      >
        {assetDistribution}
      </Box>
    </>
  )
}

export default TabletLayout
