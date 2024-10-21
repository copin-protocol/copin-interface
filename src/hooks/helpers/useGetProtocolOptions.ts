import { useMemo } from 'react'

import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS, PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export default function useGetProtocolOptions() {
  const result = useMemo(() => PROTOCOL_OPTIONS.filter((p) => p.id !== ProtocolEnum.BLOOM_BLAST), [])
  return result
}

export function useGetProtocolOptionsMapping() {
  return PROTOCOL_OPTIONS_MAPPING
}
