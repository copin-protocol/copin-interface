import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'

import { ARBITRUM_CHAIN, BASE_CHAIN, OPTIMISM_CHAIN } from './chains'

export const getCopyTradePlatformChain = (platform: CopyTradePlatformEnum) => {
  switch (platform) {
    case CopyTradePlatformEnum.GNS_V8:
      return ARBITRUM_CHAIN
    case CopyTradePlatformEnum.SYNTHETIX_V3:
      return BASE_CHAIN
    default:
      return OPTIMISM_CHAIN
  }
}

export const getCopyTradePlatformProtocol = (platform: CopyTradePlatformEnum) => {
  switch (platform) {
    case CopyTradePlatformEnum.GNS_V8:
      return ProtocolEnum.GNS
    case CopyTradePlatformEnum.HYPERLIQUID:
      return ProtocolEnum.HYPERLIQUID
    default:
      return ProtocolEnum.COPIN
  }
}
