import { ARBITRUM_MAINNET, BLAST_MAINNET, BNB_MAINNET, OPTIMISM_MAINNET, POLYGON_MAINNET } from 'utils/web3/chains'

import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  label: string
  chainId: number
}

export const PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL]

// TODO: Check when add new protocol

//@ts-ignore
export const PROTOCOL_OPTIONS_MAPPING: Record<ProtocolEnum, ProtocolOptionProps> = {
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
  [ProtocolEnum.GNS]: {
    id: ProtocolEnum.GNS,
    text: 'gTrade',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.GNS_POLY]: {
    id: ProtocolEnum.GNS_POLY,
    text: 'gTrade',
    label: 'Polygon',
    chainId: POLYGON_MAINNET,
  },
  [ProtocolEnum.LEVEL_BNB]: {
    id: ProtocolEnum.LEVEL_BNB,
    text: 'Level',
    label: 'BNB Chain',
    chainId: BNB_MAINNET,
  },
  [ProtocolEnum.LEVEL_ARB]: {
    id: ProtocolEnum.LEVEL_ARB,
    text: 'Level',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.MUX_ARB]: {
    id: ProtocolEnum.MUX_ARB,
    text: 'MUX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    id: ProtocolEnum.EQUATION_ARB,
    text: 'Equation',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    id: ProtocolEnum.BLOOM_BLAST,
    text: 'Bloom',
    label: 'Blast',
    chainId: BLAST_MAINNET,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    id: ProtocolEnum.APOLLOX_BNB,
    text: 'ApolloX',
    label: 'BNB Chain',
    chainId: BNB_MAINNET,
  },
}

export const PROTOCOL_OPTIONS: ProtocolOptionProps[] = [
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX_V2],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.KWENTA],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.POLYNOMIAL],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GNS],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GNS_POLY],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.LEVEL_BNB],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.LEVEL_ARB],
  // PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.MUX_ARB],
  // PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.EQUATION_ARB],
  // PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.BLOOM_BLAST],
  // PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.APOLLOX_BNB],
]
