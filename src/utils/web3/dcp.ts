import { CopyTradePlatformEnum } from 'utils/config/enums'

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
