import {
  ARBITRUM_MAINNET,
  BASE_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  MANTLE_MAINNET,
  MODE_MAINNET,
  OPTIMISM_MAINNET,
  POLYGON_MAINNET,
} from 'utils/web3/chains'

import { BUILD_MODE, RELEASED_PROTOCOLS } from './constants'
import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  label: string
  chainId: number
  isNew?: boolean
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
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    id: ProtocolEnum.POLYNOMIAL,
    text: 'Polynomial',
    label: 'Optimism',
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
    isNew: true,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    id: ProtocolEnum.EQUATION_ARB,
    text: 'Equation',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    id: ProtocolEnum.BLOOM_BLAST,
    text: 'Bloom',
    label: 'Blast',
    chainId: BLAST_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    id: ProtocolEnum.APOLLOX_BNB,
    text: 'ApolloX',
    label: 'BNB Chain',
    chainId: BNB_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    id: ProtocolEnum.AVANTIS_BASE,
    text: 'Avantis',
    label: 'Base',
    chainId: BASE_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    id: ProtocolEnum.TIGRIS_ARB,
    text: 'Tigris',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.LOGX_BLAST]: {
    id: ProtocolEnum.LOGX_BLAST,
    text: 'LogX',
    label: 'Blast',
    chainId: BLAST_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.LOGX_MODE]: {
    id: ProtocolEnum.LOGX_MODE,
    text: 'LogX',
    label: 'Mode',
    chainId: MODE_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.MYX_ARB]: {
    id: ProtocolEnum.MYX_ARB,
    text: 'MYX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.PINGU_ARB]: {
    id: ProtocolEnum.PINGU_ARB,
    text: 'Pingu',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.HMX_ARB]: {
    id: ProtocolEnum.HMX_ARB,
    text: 'HMX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.DEXTORO]: {
    id: ProtocolEnum.DEXTORO,
    text: 'DexToro',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.VELA_ARB]: {
    id: ProtocolEnum.VELA_ARB,
    text: 'Vela',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    id: ProtocolEnum.SYNTHETIX_V3,
    text: 'Synthetix V3',
    label: 'Base',
    chainId: BASE_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.COPIN]: {
    id: ProtocolEnum.COPIN,
    text: 'Copin',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    isNew: true,
  },
  [ProtocolEnum.KTX_MANTLE]: {
    id: ProtocolEnum.KTX_MANTLE,
    text: 'KTX',
    label: 'Mantle',
    chainId: MANTLE_MAINNET,
    isNew: true,
  },
}

export const PROTOCOL_OPTIONS: ProtocolOptionProps[] =
  BUILD_MODE === 'production'
    ? RELEASED_PROTOCOLS.map((e) => PROTOCOL_OPTIONS_MAPPING[e])
    : Object.values(ProtocolEnum).map((e) => PROTOCOL_OPTIONS_MAPPING[e])

export const PROTOCOLS_CROSS_MARGIN = [ProtocolEnum.HMX_ARB, ProtocolEnum.SYNTHETIX_V3]

// TODO: Check when add new protocol
export const PROTOCOL_LISTENER_MAPPING: Record<string, ProtocolEnum> = {
  gnsPoly: ProtocolEnum.GNS_POLY,
  gnsArb: ProtocolEnum.GNS,
  gmxV1Arb: ProtocolEnum.GMX,
  gmxV2Arb: ProtocolEnum.GMX_V2,
  muxArb: ProtocolEnum.MUX_ARB,
  equationArb: ProtocolEnum.EQUATION_ARB,
  levelArb: ProtocolEnum.LEVEL_ARB,
  levelBnb: ProtocolEnum.LEVEL_BNB,
  synthetixOp: ProtocolEnum.KWENTA,
  mirrorSignalSnxOp: ProtocolEnum.KWENTA,
  mirrorSignalGnsArb: ProtocolEnum.GNS,
  mirrorSignalLevelArb: ProtocolEnum.LEVEL_ARB,
  mirrorSignalLevelBnb: ProtocolEnum.LEVEL_BNB,
  velaArb: ProtocolEnum.VELA_ARB,
  avantisBase: ProtocolEnum.AVANTIS_BASE,
  ktxMantle: ProtocolEnum.KTX_MANTLE,
}
