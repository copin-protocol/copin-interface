import {
  ARBITRUM_MAINNET,
  BASE_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  FANTOM_MAINNET,
  HYPERLIQUID_TESTNET,
  MANTLE_MAINNET,
  MODE_MAINNET,
  OPBNB_MAINNET,
  OPTIMISM_MAINNET,
  POLYGON_MAINNET,
  SCROLL_MAINNET,
} from 'utils/web3/chains'

import { BUILD_MODE, RELEASED_PROTOCOLS } from './constants'
import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  label: string
  chainId: number
  isNew?: boolean
  isCross?: boolean
  key: number
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
    key: 1,
  },
  [ProtocolEnum.GMX]: {
    id: ProtocolEnum.GMX,
    text: 'GMX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    key: 2,
  },
  [ProtocolEnum.KWENTA]: {
    id: ProtocolEnum.KWENTA,
    text: 'Kwenta',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    key: 3,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    id: ProtocolEnum.POLYNOMIAL,
    text: 'Polynomial',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    key: 4,
  },
  [ProtocolEnum.GNS]: {
    id: ProtocolEnum.GNS,
    text: 'gTrade',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    key: 5,
  },
  [ProtocolEnum.GNS_POLY]: {
    id: ProtocolEnum.GNS_POLY,
    text: 'gTrade',
    label: 'Polygon',
    chainId: POLYGON_MAINNET,
    key: 6,
  },
  [ProtocolEnum.LEVEL_BNB]: {
    id: ProtocolEnum.LEVEL_BNB,
    text: 'Level',
    label: 'BNB Chain',
    chainId: BNB_MAINNET,
    key: 7,
  },
  [ProtocolEnum.LEVEL_ARB]: {
    id: ProtocolEnum.LEVEL_ARB,
    text: 'Level',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    key: 8,
  },
  [ProtocolEnum.MUX_ARB]: {
    id: ProtocolEnum.MUX_ARB,
    text: 'MUX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 9,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    id: ProtocolEnum.EQUATION_ARB,
    text: 'Equation',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 10,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    id: ProtocolEnum.BLOOM_BLAST,
    text: 'Bloom',
    label: 'Blast',
    chainId: BLAST_MAINNET,
    isNew: false,
    key: 11,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    id: ProtocolEnum.APOLLOX_BNB,
    text: 'ApolloX',
    label: 'BNB Chain',
    chainId: BNB_MAINNET,
    isNew: false,
    key: 12,
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    id: ProtocolEnum.AVANTIS_BASE,
    text: 'Avantis',
    label: 'Base',
    chainId: BASE_MAINNET,
    isNew: false,
    key: 13,
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    id: ProtocolEnum.TIGRIS_ARB,
    text: 'Tigris',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 14,
  },
  [ProtocolEnum.LOGX_BLAST]: {
    id: ProtocolEnum.LOGX_BLAST,
    text: 'LogX',
    label: 'Blast',
    chainId: BLAST_MAINNET,
    isNew: false,
    key: 15,
  },
  [ProtocolEnum.LOGX_MODE]: {
    id: ProtocolEnum.LOGX_MODE,
    text: 'LogX',
    label: 'Mode',
    chainId: MODE_MAINNET,
    isNew: false,
    key: 16,
  },
  [ProtocolEnum.MYX_ARB]: {
    id: ProtocolEnum.MYX_ARB,
    text: 'MYX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 17,
  },
  [ProtocolEnum.HMX_ARB]: {
    id: ProtocolEnum.HMX_ARB,
    text: 'HMX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    isCross: true,
    key: 18,
  },
  [ProtocolEnum.DEXTORO]: {
    id: ProtocolEnum.DEXTORO,
    text: 'DexToro',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    isNew: false,
    key: 19,
  },
  [ProtocolEnum.VELA_ARB]: {
    id: ProtocolEnum.VELA_ARB,
    text: 'Vela',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 20,
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    id: ProtocolEnum.SYNTHETIX_V3,
    text: 'Synthetix V3',
    label: 'Base',
    chainId: BASE_MAINNET,
    isNew: false,
    isCross: true,
    key: 21,
  },
  [ProtocolEnum.COPIN]: {
    id: ProtocolEnum.COPIN,
    text: 'Copin',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    isNew: true,
    key: 22,
  },
  [ProtocolEnum.KTX_MANTLE]: {
    id: ProtocolEnum.KTX_MANTLE,
    text: 'KTX',
    label: 'Mantle',
    chainId: MANTLE_MAINNET,
    isNew: false,
    key: 23,
  },
  [ProtocolEnum.CYBERDEX]: {
    id: ProtocolEnum.CYBERDEX,
    text: 'CyberDEX',
    label: 'Optimism',
    chainId: OPTIMISM_MAINNET,
    isNew: false,
    key: 24,
  },
  [ProtocolEnum.YFX_ARB]: {
    id: ProtocolEnum.YFX_ARB,
    text: 'YFX',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: false,
    key: 25,
  },
  [ProtocolEnum.KILOEX_OPBNB]: {
    id: ProtocolEnum.KILOEX_OPBNB,
    text: 'KiloEx',
    label: 'opBNB',
    chainId: OPBNB_MAINNET,
    isNew: false,
    key: 26,
  },
  [ProtocolEnum.ROLLIE_SCROLL]: {
    id: ProtocolEnum.ROLLIE_SCROLL,
    text: 'Rollie',
    label: 'Scroll',
    chainId: SCROLL_MAINNET,
    isNew: false,
    key: 27,
  },
  [ProtocolEnum.PERENNIAL_ARB]: {
    id: ProtocolEnum.PERENNIAL_ARB,
    text: 'Perennial',
    label: 'Arbitrum',
    chainId: ARBITRUM_MAINNET,
    isNew: true,
    key: 28,
  },
  [ProtocolEnum.MUMMY_FANTOM]: {
    id: ProtocolEnum.MUMMY_FANTOM,
    text: 'Mummy',
    label: 'Fantom',
    chainId: FANTOM_MAINNET,
    isNew: true,
    key: 29,
  },
  [ProtocolEnum.MORPHEX_FANTOM]: {
    id: ProtocolEnum.MORPHEX_FANTOM,
    text: 'Morphex',
    label: 'Fantom',
    chainId: FANTOM_MAINNET,
    isNew: true,
    key: 30,
  },
  [ProtocolEnum.HYPERLIQUID]: {
    id: ProtocolEnum.HYPERLIQUID,
    text: 'Hyperliquid',
    label: 'Hyperliquid',
    isNew: true,
    chainId: HYPERLIQUID_TESTNET,
    key: 31,
  },
  [ProtocolEnum.SYNFUTURE_BASE]: {
    id: ProtocolEnum.SYNFUTURE_BASE,
    text: 'Synfutures',
    label: 'BASE',
    chainId: BASE_MAINNET,
    isNew: true,
    key: 32,
  },
}

export const SELECTED_PROTOCOLS_ALL = 'all'

export const PROTOCOL_OPTIONS: ProtocolOptionProps[] =
  BUILD_MODE === 'production'
    ? RELEASED_PROTOCOLS.map((e) => PROTOCOL_OPTIONS_MAPPING[e])
    : Object.values(ProtocolEnum).map((e) => PROTOCOL_OPTIONS_MAPPING[e])

export const PROTOCOLS_CROSS_MARGIN = [ProtocolEnum.HMX_ARB, ProtocolEnum.SYNTHETIX_V3, ProtocolEnum.HYPERLIQUID]

export const PROTOCOLS_IN_TOKEN: ProtocolEnum[] = []

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
  yfxArb: ProtocolEnum.YFX_ARB,
  hmxArb: ProtocolEnum.HMX_ARB,
  myxArb: ProtocolEnum.MYX_ARB,
  apolloxBnb: ProtocolEnum.APOLLOX_BNB,
  synthetixV3Base: ProtocolEnum.SYNTHETIX_V3,
  kiloexOpbnb: ProtocolEnum.KILOEX_OPBNB,
  rollieScroll: ProtocolEnum.ROLLIE_SCROLL,
  logxBlast: ProtocolEnum.LOGX_BLAST,
  logxMode: ProtocolEnum.LOGX_MODE,
}
