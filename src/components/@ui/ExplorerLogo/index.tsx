import React from 'react'

import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'

// TODO: Check when add new protocol
const ExplorerLogo = ({
  protocol,
  explorerUrl,
  size = 20,
  sx = {},
  ...props
}: { protocol: string; explorerUrl?: string; size?: number } & BoxProps) => {
  let icon
  switch (protocol) {
    case ProtocolEnum.GNS:
    case ProtocolEnum.GMX:
    case ProtocolEnum.GMX_V2:
      icon = 'ARBITRUM'
      break
    case ProtocolEnum.KWENTA:
      icon = 'OPTIMISM'
      break
    case ProtocolEnum.LEVEL_BNB:
      icon = 'BNB'
      break
    default:
      icon = 'OPTIMISM'
  }
  return (
    <Box sx={{ width: size, height: size, filter: 'grayscale(100%)', ':hover': { filter: 'none' }, ...sx }} {...props}>
      <Box
        as={explorerUrl ? 'a' : undefined}
        href={explorerUrl}
        target="_blank"
        rel="noreferrer"
        sx={{ height: size, display: 'block', lineHeight: `${size}px` }}
      >
        <img width="100%" src={`/images/protocols/ic-${icon}-explorer.png`} alt={protocol} />
      </Box>
    </Box>
  )
}

export default ExplorerLogo
