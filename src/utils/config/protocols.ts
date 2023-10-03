import { ARBITRUM_MAINNET, OPTIMISM_MAINNET } from 'utils/web3/chains'

import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  chainId: number
}

export const PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA]
export const PROTOCOL_OPTIONS_MAPPING: Record<ProtocolEnum, ProtocolOptionProps> = {
  [ProtocolEnum.GMX]: {
    id: ProtocolEnum.GMX,
    text: 'GMX',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.KWENTA]: {
    id: ProtocolEnum.KWENTA,
    text: 'Kwenta',
    chainId: OPTIMISM_MAINNET,
  },
}
export const PROTOCOL_OPTIONS: ProtocolOptionProps[] = [
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.KWENTA],
]
