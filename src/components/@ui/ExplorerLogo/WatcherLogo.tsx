import React from 'react'

import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'
import { CopyTradePlatformEnum } from 'utils/config/enums'

const WatcherLogo = ({
  platform,
  watcherUrl,
  size = 20,
  ...props
}: { platform: string; watcherUrl: string; size?: number } & BoxProps) => {
  let icon
  switch (platform) {
    case CopyTradePlatformEnum.BINGX:
      icon = 'BINGX'
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
      icon = 'SYNTHETIX'
      break
    default:
      icon = 'SYNTHETIX'
  }
  return (
    <Box sx={{ width: size, height: size, filter: 'grayscale(100%)', ':hover': { filter: 'none' } }} {...props}>
      <a href={watcherUrl} target="_blank" rel="noreferrer">
        <img width="100%" src={`/images/exchanges/${icon}.png`} alt={platform} />
      </a>
    </Box>
  )
}

export default WatcherLogo
