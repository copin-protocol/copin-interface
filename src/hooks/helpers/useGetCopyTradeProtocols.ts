import useInternalRole from 'hooks/features/useInternalRole'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

export default function useGetCopyTradeProtocols() {
  const isInternal = useInternalRole()
  return isInternal
    ? Object.values(ProtocolEnum).filter((protocol) => protocol !== ProtocolEnum.BLOOM_BLAST)
    : ALLOWED_COPYTRADE_PROTOCOLS
}
