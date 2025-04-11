import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { DCP_SERVICE_KEY } from 'utils/config/keys'

export const getCopyService = ({
  protocol,
  exchange,
  isInternal,
}: {
  protocol: ProtocolEnum
  exchange?: CopyTradePlatformEnum
  isInternal?: boolean
}) => {
  if (exchange == CopyTradePlatformEnum.GNS_V8 || exchange == CopyTradePlatformEnum.SYNTHETIX_V2) {
    return DCP_SERVICE_KEY
  }
  return
}
