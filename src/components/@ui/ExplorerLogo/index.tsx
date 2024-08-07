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
    case ProtocolEnum.LEVEL_ARB:
    case ProtocolEnum.MUX_ARB:
    case ProtocolEnum.EQUATION_ARB:
    case ProtocolEnum.TIGRIS_ARB:
    case ProtocolEnum.MYX_ARB:
    case ProtocolEnum.HMX_ARB:
    case ProtocolEnum.VELA_ARB:
    case ProtocolEnum.YFX_ARB:
      icon = 'ARBITRUM'
      break
    case ProtocolEnum.KWENTA:
    case ProtocolEnum.POLYNOMIAL:
    case ProtocolEnum.DEXTORO:
    case ProtocolEnum.CYBERDEX:
    case ProtocolEnum.COPIN:
      icon = 'OPTIMISM'
      break
    case ProtocolEnum.LEVEL_BNB:
    case ProtocolEnum.APOLLOX_BNB:
      icon = 'BNB'
      break
    case ProtocolEnum.GNS_POLY:
      icon = 'POLYGON'
      break
    case ProtocolEnum.BLOOM_BLAST:
    case ProtocolEnum.LOGX_BLAST:
      icon = 'BLAST'
      break
    case ProtocolEnum.AVANTIS_BASE:
    case ProtocolEnum.SYNTHETIX_V3:
      icon = 'BASE'
      break
    case ProtocolEnum.LOGX_MODE:
      icon = 'MODE'
      break
    case ProtocolEnum.KTX_MANTLE:
      icon = 'MANTLE'
      break
    case ProtocolEnum.KILOEX_OPBNB:
      icon = 'OPBNB'
      break
    case ProtocolEnum.ROLLIE_SCROLL:
      icon = 'SCROLL'
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
