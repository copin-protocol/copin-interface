import React from 'react'

import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'

const ExplorerLogo = ({
  protocol,
  explorerUrl,
  size = 20,
  ...props
}: { protocol: string; explorerUrl: string; size?: number } & BoxProps) => {
  let icon
  switch (protocol) {
    case ProtocolEnum.GMX:
      icon = 'ARBITRUM'
      break
    case ProtocolEnum.KWENTA:
      icon = 'OPTIMISM'
      break
    default:
      icon = 'OPTIMISM'
  }
  return (
    <Box sx={{ width: size, height: size, filter: 'grayscale(100%)', ':hover': { filter: 'none' } }} {...props}>
      <a href={explorerUrl} target="_blank" rel="noreferrer">
        <img width="100%" src={`/images/protocols/ic-${icon}-explorer.png`} alt={protocol} />
      </a>
    </Box>
  )
}

export default ExplorerLogo
