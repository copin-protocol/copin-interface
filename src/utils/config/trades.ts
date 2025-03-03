// TODO: Check when add new protocol
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { TokenCollateral } from 'utils/types'
import {
  APE_MAINNET,
  ARBITRUM_MAINNET,
  AVALANCHE_MAINNET,
  BASE_MAINNET,
  BERA_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  CHAINS,
  CRONOS_MAINNET,
  DERIVE_MAINNET,
  DYDX_MAINNET,
  FANTOM_MAINNET,
  HYPERLIQUID_TESTNET,
  LINEA_MAINNET,
  MANTA_MAINNET,
  MANTLE_MAINNET,
  METIS_MAINNET,
  MODE_MAINNET,
  OPBNB_MAINNET,
  OPTIMISM_MAINNET,
  POLYGON_MAINNET,
  POLYNOMIAL_L2_MAINNET,
  SCROLL_MAINNET,
  SOLANA_MAINNET,
  XCHAIN_MAINNET,
  ZKSYNC_ERA_MAINNET,
} from 'utils/web3/chains'

import { TOKEN_COLLATERAL_APE } from './tokenCollateralApe'
import { TOKEN_COLLATERAL_APOLLOX_BASE, TOKEN_COLLATERAL_APOLLOX_BNB } from './tokenCollateralApollox'
import { TOKEN_COLLATERAL_ARB } from './tokenCollateralArb'
import { TOKEN_COLLATERAL_AVAX } from './tokenCollateralAvax'
import { TOKEN_COLLATERAL_BASE } from './tokenCollateralBase'
import { TOKEN_COLLATERAL_BERA } from './tokenCollateralBera'
import { TOKEN_COLLATERAL_BLAST } from './tokenCollateralBlast'
import { TOKEN_COLLATERAL_BNB } from './tokenCollateralBnb'
import { TOKEN_COLLATERAL_FTM } from './tokenCollateralFtm'
import { TOKEN_COLLATERAL_IDEX } from './tokenCollateralIdex'
import { TOKEN_COLLATERAL_LINEHUB } from './tokenCollateralLineHub'
import { TOKEN_COLLATERAL_LINEA } from './tokenCollateralLinea'
import { TOKEN_COLLATERAL_MANTA } from './tokenCollateralManta'
import { TOKEN_COLLATERAL_MANTLE } from './tokenCollateralMantle'
import { TOKEN_COLLATERAL_METIS } from './tokenCollateralMetis'
import { TOKEN_COLLATERAL_MODE } from './tokenCollateralMode'
import { TOKEN_COLLATERAL_MORPHEX_FANTOM } from './tokenCollateralMorphex'
import { TOKEN_COLLATERAL_MUMMY_FANTOM } from './tokenCollateralMummy'
import { TOKEN_COLLATERAL_MUX_ARB } from './tokenCollateralMux'
import { TOKEN_COLLATERAL_OPTIMISTIC } from './tokenCollateralOp'
import { TOKEN_COLLATERAL_OPBNB } from './tokenCollateralOpBnb'
import { TOKEN_COLLATERAL_POLYGON } from './tokenCollateralPolygon'
import { TOKEN_COLLATERAL_POLYNOMIAL_L2 } from './tokenCollateralPolynomialL2'
import { TOKEN_COLLATERAL_SCROLL } from './tokenCollateralScroll'
import { TOKEN_COLLATERAL_UNIDEX_ARB } from './tokenCollateralUniDex'
import { TOKEN_COLLATERAL_ZKSYNC_ERA } from './tokenCollateralZkSync'

type ProtocolProvider = { [key: string]: { chainId: number | 'dydx-mainnet-1' | null; explorerUrl: string } | null }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.LEVEL_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LEVEL_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MUX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS_POLY]: {
    chainId: POLYGON_MAINNET,
    explorerUrl: CHAINS[POLYGON_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GNS_APE]: {
    chainId: APE_MAINNET,
    explorerUrl: CHAINS[APE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX_V2_AVAX]: {
    chainId: AVALANCHE_MAINNET,
    explorerUrl: CHAINS[AVALANCHE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX_V2]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX_AVAX]: {
    chainId: AVALANCHE_MAINNET,
    explorerUrl: CHAINS[AVALANCHE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL_L2]: {
    chainId: POLYNOMIAL_L2_MAINNET,
    explorerUrl: CHAINS[POLYNOMIAL_L2_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.EQUATION_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BLOOM_BLAST]: {
    chainId: BLAST_MAINNET,
    explorerUrl: CHAINS[BLAST_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.APOLLOX_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.APOLLOX_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.AVANTIS_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.TIGRIS_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LOGX_BLAST]: {
    chainId: BLAST_MAINNET,
    explorerUrl: CHAINS[BLAST_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LOGX_MODE]: {
    chainId: MODE_MAINNET,
    explorerUrl: CHAINS[MODE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MYX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MYX_OPBNB]: {
    chainId: OPBNB_MAINNET,
    explorerUrl: CHAINS[OPBNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MYX_LINEA]: {
    chainId: LINEA_MAINNET,
    explorerUrl: CHAINS[LINEA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HMX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.DEXTORO]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.VELA_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYNTHETIX_V3_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYNTHETIX_V3]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYNTHETIX]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.COPIN]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KTX_MANTLE]: {
    chainId: MANTLE_MAINNET,
    explorerUrl: CHAINS[MANTLE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.CYBERDEX]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.YFX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KILOEX_OPBNB]: {
    chainId: OPBNB_MAINNET,
    explorerUrl: CHAINS[OPBNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KILOEX_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KILOEX_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KILOEX_MANTA]: {
    chainId: MANTA_MAINNET,
    explorerUrl: CHAINS[MANTA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.ROLLIE_SCROLL]: {
    chainId: SCROLL_MAINNET,
    explorerUrl: CHAINS[SCROLL_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.PERENNIAL_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MUMMY_FANTOM]: {
    chainId: FANTOM_MAINNET,
    explorerUrl: CHAINS[FANTOM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.MORPHEX_FANTOM]: {
    chainId: FANTOM_MAINNET,
    explorerUrl: CHAINS[FANTOM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HYPERLIQUID]: {
    chainId: HYPERLIQUID_TESTNET,
    explorerUrl: CHAINS[HYPERLIQUID_TESTNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYNFUTURE_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.DYDX]: {
    chainId: DYDX_MAINNET,
    explorerUrl: CHAINS[DYDX_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BSX_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.UNIDEX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.VERTEX_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.LINEHUB_LINEA]: {
    chainId: LINEA_MAINNET,
    explorerUrl: CHAINS[LINEA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.FOXIFY_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BMX_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.DEPERP_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HORIZON_BNB]: {
    chainId: BNB_MAINNET,
    explorerUrl: CHAINS[BNB_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.IDEX]: {
    chainId: XCHAIN_MAINNET,
    explorerUrl: CHAINS[XCHAIN_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HOLDSTATION_ZKSYNC]: {
    chainId: ZKSYNC_ERA_MAINNET,
    explorerUrl: CHAINS[ZKSYNC_ERA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.HOLDSTATION_BERA]: {
    chainId: BERA_MAINNET,
    explorerUrl: CHAINS[BERA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.ZENO_METIS]: {
    chainId: METIS_MAINNET,
    explorerUrl: CHAINS[METIS_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.SYMMIO_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.INTENTX_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.BASED_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.DERIVE]: {
    chainId: DERIVE_MAINNET,
    explorerUrl: CHAINS[DERIVE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.FULCROM_CRONOS]: {
    chainId: CRONOS_MAINNET,
    explorerUrl: CHAINS[CRONOS_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.JOJO_BASE]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.ELFI_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.JUPITER]: {
    chainId: SOLANA_MAINNET,
    explorerUrl: CHAINS[SOLANA_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.PERPETUAL_OP]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.PINGU_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
}
export interface TokenTrade {
  address: string
  // name: string
  symbol: string
  // decimals: number
  // priceFeedId: string
  // icon: string
}
export type ProtocolTokenMapping = { [address: string]: { symbol: string } }

export type TokenOptionProps = {
  id: string
  label: string
  value: string
}

export const ALL_TOKENS_ID = 'ALL'
export const ALL_OPTION: TokenOptionProps = {
  id: ALL_TOKENS_ID,
  label: 'ALL',
  value: ALL_TOKENS_ID,
}

type TokenCollateralSupport = { [protocol in ProtocolEnum]: { [address: string]: TokenCollateral } }
type TokenIgnore = { [key in CopyTradePlatformEnum]: string[] }

export const SYNTHETIX_V3_MARKET_IDS = {
  BTC: 200,
  ETH: 100,
}

export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.OTHERS]: [],
  [CopyTradePlatformEnum.GMX]: [],
  [CopyTradePlatformEnum.BINGX]: ['YFI', 'PERP', 'RPL', 'ZEC', 'RPL', 'UMA', 'BAL', 'XTZ'],
  [CopyTradePlatformEnum.BITGET]: [],
  [CopyTradePlatformEnum.BINANCE]: [],
  [CopyTradePlatformEnum.BYBIT]: [],
  [CopyTradePlatformEnum.OKX]: [],
  [CopyTradePlatformEnum.GATE]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V2]: [],
  [CopyTradePlatformEnum.SYNTHETIX_V3]: [],
  [CopyTradePlatformEnum.GNS_V8]: [],
  [CopyTradePlatformEnum.HYPERLIQUID]: [],
  [CopyTradePlatformEnum.COPIN_HYPERLIQUID]: [],
}

export const TOKEN_COLLATERAL_SUPPORT: TokenCollateralSupport = {
  [ProtocolEnum.KTX_MANTLE]: TOKEN_COLLATERAL_MANTLE,
  [ProtocolEnum.COPIN]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.SYNTHETIX_V3_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.SYNTHETIX_V3]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.SYNTHETIX]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.VELA_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.DEXTORO]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.CYBERDEX]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.HMX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MYX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MYX_OPBNB]: TOKEN_COLLATERAL_OPBNB,
  [ProtocolEnum.MYX_LINEA]: TOKEN_COLLATERAL_LINEA,
  [ProtocolEnum.LOGX_MODE]: TOKEN_COLLATERAL_MODE,
  [ProtocolEnum.LOGX_BLAST]: TOKEN_COLLATERAL_BLAST,
  [ProtocolEnum.TIGRIS_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.AVANTIS_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.APOLLOX_BNB]: { ...TOKEN_COLLATERAL_BNB, ...TOKEN_COLLATERAL_APOLLOX_BNB },
  [ProtocolEnum.APOLLOX_BASE]: { ...TOKEN_COLLATERAL_BASE, ...TOKEN_COLLATERAL_APOLLOX_BASE },
  [ProtocolEnum.BLOOM_BLAST]: TOKEN_COLLATERAL_BLAST,
  [ProtocolEnum.EQUATION_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.LEVEL_BNB]: TOKEN_COLLATERAL_BNB,
  [ProtocolEnum.LEVEL_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MUX_ARB]: { ...TOKEN_COLLATERAL_ARB, ...TOKEN_COLLATERAL_MUX_ARB },
  [ProtocolEnum.GNS]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.GNS_POLY]: TOKEN_COLLATERAL_POLYGON,
  [ProtocolEnum.GNS_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.GNS_APE]: TOKEN_COLLATERAL_APE,
  [ProtocolEnum.GMX]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.GMX_AVAX]: TOKEN_COLLATERAL_AVAX,
  [ProtocolEnum.GMX_V2]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.GMX_V2_AVAX]: TOKEN_COLLATERAL_AVAX,
  [ProtocolEnum.KWENTA]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.POLYNOMIAL_L2]: TOKEN_COLLATERAL_POLYNOMIAL_L2,
  [ProtocolEnum.YFX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.KILOEX_OPBNB]: TOKEN_COLLATERAL_OPBNB,
  [ProtocolEnum.KILOEX_BNB]: TOKEN_COLLATERAL_BNB,
  [ProtocolEnum.KILOEX_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.KILOEX_MANTA]: TOKEN_COLLATERAL_MANTA,
  [ProtocolEnum.ROLLIE_SCROLL]: TOKEN_COLLATERAL_SCROLL,
  [ProtocolEnum.PERENNIAL_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MUMMY_FANTOM]: { ...TOKEN_COLLATERAL_FTM, ...TOKEN_COLLATERAL_MUMMY_FANTOM },
  [ProtocolEnum.MORPHEX_FANTOM]: { ...TOKEN_COLLATERAL_FTM, ...TOKEN_COLLATERAL_MORPHEX_FANTOM },
  [ProtocolEnum.HYPERLIQUID]: {},
  [ProtocolEnum.SYNFUTURE_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.DYDX]: {},
  [ProtocolEnum.BSX_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.UNIDEX_ARB]: { ...TOKEN_COLLATERAL_ARB, ...TOKEN_COLLATERAL_UNIDEX_ARB },
  [ProtocolEnum.VERTEX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.LINEHUB_LINEA]: { ...TOKEN_COLLATERAL_LINEHUB, ...TOKEN_COLLATERAL_LINEA },
  [ProtocolEnum.FOXIFY_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.BMX_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.DEPERP_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.HORIZON_BNB]: TOKEN_COLLATERAL_BNB,
  [ProtocolEnum.IDEX]: TOKEN_COLLATERAL_IDEX,
  [ProtocolEnum.HOLDSTATION_ZKSYNC]: TOKEN_COLLATERAL_ZKSYNC_ERA,
  [ProtocolEnum.HOLDSTATION_BERA]: TOKEN_COLLATERAL_BERA,
  [ProtocolEnum.ZENO_METIS]: TOKEN_COLLATERAL_METIS,
  [ProtocolEnum.SYMMIO_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.INTENTX_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.BASED_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.DERIVE]: {},
  [ProtocolEnum.FULCROM_CRONOS]: {},
  [ProtocolEnum.JOJO_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.ELFI_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.JUPITER]: {},
  [ProtocolEnum.PERPETUAL_OP]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.PINGU_ARB]: TOKEN_COLLATERAL_ARB,
}

export const TIMEFRAME_NAMES = {
  // Minutes
  5: 'M5',
  15: 'M15',
  30: 'M30',
  60: 'H1',
  240: 'H4',
  1440: 'D1',
}

export function getSymbolTradingView(symbol: string) {
  switch (symbol) {
    case '1000BONK':
    case 'kBONK':
      return 'BONK'
    case '1000PEPE':
    case 'kPEPE':
    case 'MPEPE':
      return 'PEPE'
    case '1000FLOKI':
    case 'kFLOKI':
      return 'FLOKI'
    case '1000SHIB':
    case 'kSHIB':
      return 'SHIB'
    case '1000LUNC':
    case 'kLUNC':
      return 'LUNC'
    case '1000DOGS':
      return 'DOGS'
    case '1000RATS':
      return 'RATS'
    case '1000SATS':
      return 'SATS'
    case '1000MOG':
    case '1000000MOG':
    case '1MMOG':
      return 'MOG'
    case '1000X':
      return 'X'
    case '1000XEC':
      return 'XEC'
    case '1000WHY':
      return 'WHY'
    case '1MBABYDOGE':
      return 'BABYDOGE'
    case '1000CHEEMS':
    case '1MCHEEMS':
      return 'CHEEMS'
    case '1000000AIDOGE':
      return 'AIDOGE'
    case 'RNDR':
      return 'RENDER'
    case 'BTCDEGEN':
      return 'BTC'
    case 'ETHDEGEN':
      return 'ETH'
    case '1000NEIRO':
      return 'NEIRO'
    default:
      return symbol
  }
}
export function getPriceTradingView(symbol: string, price?: number) {
  if (!price) return
  switch (symbol) {
    case 'MPEPE':
    case '1MMOG':
    case '1MBABYDOGE':
    case '1000000MOG':
    case '1000000AIDOGE':
    case '1MCHEEMS':
      return price / 1000000
    case '1000BONK':
    case 'kBONK':
    case '1000PEPE':
    case 'kPEPE':
    case '1000FLOKI':
    case 'kFLOKI':
    case '1000SHIB':
    case 'kSHIB':
    case '1000LUNC':
    case 'kLUNC':
    case '1000DOGS':
    case '1000WHY':
    case '1000XEC':
    case '1000X':
    case '1000MOG':
    case '1000SATS':
    case '1000RATS':
    case '1000CHEEMS':
    case '1000NEIRO':
      return price / 1000
    default:
      return price
  }
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
