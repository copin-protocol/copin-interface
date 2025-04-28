import { ProtocolEnum } from 'utils/config/enums'
import { TokenCollateral } from 'utils/types'

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

type TokenCollateralSupport = { [protocol in ProtocolEnum]: { [address: string]: TokenCollateral } }

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
  [ProtocolEnum.GMX_SOL]: {},
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
  [ProtocolEnum.OSTIUM_ARB]: TOKEN_COLLATERAL_ARB,
}
