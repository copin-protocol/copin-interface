import { ARBITRUM_MAINNET, OPTIMISM_MAINNET } from 'utils/web3/chains'

import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  label: string
  chainId: number
}

export const PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL]

// TODO: Check when add new protocol
export const PROTOCOL_OPTIONS_MAPPING: Record<ProtocolEnum, ProtocolOptionProps> = {
  [ProtocolEnum.GNS]: {
    id: ProtocolEnum.GNS,
    text: 'gTrade',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.GMX_V2]: {
    id: ProtocolEnum.GMX_V2,
    text: 'GMX V2',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.GMX]: {
    id: ProtocolEnum.GMX,
    text: 'GMX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.KWENTA]: {
    id: ProtocolEnum.KWENTA,
    text: 'Kwenta',
    label: 'Synthetix',
    chainId: OPTIMISM_MAINNET,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    id: ProtocolEnum.POLYNOMIAL,
    text: 'Polynomial',
    label: 'Synthetix',
    chainId: OPTIMISM_MAINNET,
  },
}
export const PROTOCOL_OPTIONS: ProtocolOptionProps[] = [
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX_V2],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.KWENTA],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.POLYNOMIAL],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GNS],
]
