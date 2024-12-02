import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { ARBITRUM_CHAIN, BASE_CHAIN, CHAINS } from 'utils/web3/chains'

// TODO: Check when add new DCP
const ExplorerLogo = ({
  protocol,
  exchange,
  explorerUrl,
  size = 20,
  sx = {},
  ...props
}: { protocol?: ProtocolEnum; explorerUrl?: string; size?: number; exchange?: CopyTradePlatformEnum } & BoxProps) => {
  let icon = ''
  if (protocol) {
    const protocolConfig = PROTOCOL_OPTIONS_MAPPING[protocol]
    if (protocolConfig) {
      const chainConfig = CHAINS[protocolConfig.chainId]
      icon = chainConfig.icon
    }
  }
  if (exchange) {
    let chainId: number | undefined = undefined
    switch (exchange) {
      case CopyTradePlatformEnum.GNS_V8:
        chainId = ARBITRUM_CHAIN
        break
      case CopyTradePlatformEnum.SYNTHETIX_V3:
        chainId = BASE_CHAIN
        break
    }
    if (chainId) {
      const chainConfig = CHAINS[chainId]
      icon = chainConfig.icon
    }
  }
  if (!icon) return null
  return (
    <Box sx={{ width: size, height: size, filter: 'grayscale(100%)', ':hover': { filter: 'none' }, ...sx }} {...props}>
      <Box
        as={explorerUrl ? 'a' : undefined}
        href={explorerUrl}
        target="_blank"
        rel="noreferrer"
        sx={{ height: size, display: 'block', lineHeight: `${size}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <img width="100%" src={`/images/chain_explorers/ic-${icon}-explorer.png`} alt={protocol} />
      </Box>
    </Box>
  )
}

export default ExplorerLogo
