// TODO: Check when add new protocol
import { ProtocolEnum } from 'utils/config/enums'
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
  [ProtocolEnum.GMX_SOL]: {
    chainId: SOLANA_MAINNET,
    explorerUrl: CHAINS[SOLANA_MAINNET].blockExplorerUrl,
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
  [ProtocolEnum.OSTIUM_ARB]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
}
