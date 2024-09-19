import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS, PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export default function useGetProtocolOptions() {
  return PROTOCOL_OPTIONS.filter((p) => p.id !== ProtocolEnum.BLOOM_BLAST)
}

export function useGetProtocolOptionsMapping() {
  return PROTOCOL_OPTIONS_MAPPING
}
