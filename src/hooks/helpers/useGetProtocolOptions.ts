import { PROTOCOL_OPTIONS, PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

export default function useGetProtocolOptions() {
  return PROTOCOL_OPTIONS
}

export function useGetProtocolOptionsMapping() {
  return PROTOCOL_OPTIONS_MAPPING
}
