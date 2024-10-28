// TODO: Check when add new protocol
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { TokenCollateral } from 'utils/types'
import {
  ARBITRUM_MAINNET,
  BASE_MAINNET,
  BLAST_MAINNET,
  BNB_MAINNET,
  CHAINS,
  DYDX_MAINNET,
  FANTOM_MAINNET,
  HYPERLIQUID_TESTNET,
  MANTLE_MAINNET,
  MODE_MAINNET,
  OPBNB_MAINNET,
  OPTIMISM_MAINNET,
  OPTIMISM_SEPOLIA,
  POLYGON_MAINNET,
  SCROLL_MAINNET,
} from 'utils/web3/chains'

import { TOKEN_COLLATERAL_ARB } from './tokenCollateralArb'
import { TOKEN_COLLATERAL_BASE } from './tokenCollateralBase'
import { TOKEN_COLLATERAL_BLAST } from './tokenCollateralBlast'
import { TOKEN_COLLATERAL_BNB } from './tokenCollateralBnb'
import { TOKEN_COLLATERAL_FTM } from './tokenCollateralFtm'
import { TOKEN_COLLATERAL_MANTLE } from './tokenCollateralMantle'
import { TOKEN_COLLATERAL_MODE } from './tokenCollateralMode'
import { TOKEN_COLLATERAL_OPTIMISTIC } from './tokenCollateralOp'
import { TOKEN_COLLATERAL_OPBNB } from './tokenCollateralOpBnb'
import { TOKEN_COLLATERAL_POLYGON } from './tokenCollateralPolygon'
import { TOKEN_COLLATERAL_SCROLL } from './tokenCollateralScroll'
import { TOKEN_COLLATERAL_APOLLOX_BNB, TOKEN_TRADE_APOLLOX_BNB } from './tokenTradeApolloX'
import { TOKEN_TRADE_AVANTIS_BASE } from './tokenTradeAvantis'
import { TOKEN_TRADE_BLOOM_BLAST } from './tokenTradeBloom'
import { TOKEN_TRADE_BSX_BASE } from './tokenTradeBsx'
import { TOKEN_TRADE_DYDX } from './tokenTradeDyDx'
import { TOKEN_TRADE_EQUATION_ARB } from './tokenTradeEquation'
import { TOKEN_TRADE_GMX } from './tokenTradeGmx'
import { TOKEN_TRADE_GMX_V2 } from './tokenTradeGmxV2'
import { TOKEN_TRADE_GNS } from './tokenTradeGns'
import { TOKEN_TRADE_GNS_POLY } from './tokenTradeGnsPoly'
import { TOKEN_TRADE_HMX_ARB } from './tokenTradeHmx'
import { TOKEN_TRADE_HYPERLIQUID } from './tokenTradeHyperliquid'
import { TOKEN_TRADE_KILOEX_OPBNB } from './tokenTradeKiloEx'
import { TOKEN_TRADE_KTX_MANTLE } from './tokenTradeKtx'
import { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB } from './tokenTradeLevel'
import { TOKEN_TRADE_LOGX_BLAST, TOKEN_TRADE_LOGX_MODE } from './tokenTradeLogX'
import { TOKEN_COLLATERAL_MORPHEX_FANTOM, TOKEN_TRADE_MORPHEX_FANTOM } from './tokenTradeMorphex'
import { TOKEN_COLLATERAL_MUMMY_FANTOM, TOKEN_TRADE_MUMMY_FANTOM } from './tokenTradeMummy'
import { TOKEN_COLLATERAL_MUX_ARB, TOKEN_TRADE_MUX_ARB } from './tokenTradeMux'
import { TOKEN_TRADE_MYX_ARB } from './tokenTradeMyx'
import { TOKEN_TRADE_PERENNIAL_ARB } from './tokenTradePerennial'
import { TOKEN_TRADE_ROLLIE_SCROLL } from './tokenTradeRollie'
import { TOKEN_TRADE_SYNFUTURES_BASE } from './tokenTradeSynfutureBase'
import { TOKEN_TRADE_SYNTHETIX } from './tokenTradeSynthetix'
import { TOKEN_TRADE_SYNTHETIX_V3 } from './tokenTradeSynthetixV3'
import { TOKEN_TRADE_TIGRIS_ARB } from './tokenTradeTigris'
import { TOKEN_COLLATERAL_UNIDEX_ARB, TOKEN_TRADE_UNIDEX_ARB } from './tokenTradeUniDex'
import { TOKEN_TRADE_VELA_ARB } from './tokenTradeVela'
import { TOKEN_TRADE_YFX_ARB } from './tokenTradeYfx'

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
  [ProtocolEnum.GMX_V2]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    chainId: OPTIMISM_MAINNET,
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
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
  [ProtocolEnum.SYNTHETIX_V3]: {
    chainId: BASE_MAINNET,
    explorerUrl: CHAINS[BASE_MAINNET].blockExplorerUrl,
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

type TokenSupport = { [protocol in ProtocolEnum]: ProtocolTokenMapping }
type TokenCollateralSupport = { [protocol in ProtocolEnum]: { [address: string]: TokenCollateral } }
type TokenIgnore = { [key in CopyTradePlatformEnum]: string[] }

export const SYNTHETIX_V3_MARKET_IDS = {
  BTC: 200,
  ETH: 100,
}
export const TOKEN_TRADE_SUPPORT: TokenSupport = {
  [ProtocolEnum.GNS]: TOKEN_TRADE_GNS,
  [ProtocolEnum.GNS_POLY]: TOKEN_TRADE_GNS_POLY,
  [ProtocolEnum.GMX]: TOKEN_TRADE_GMX,
  [ProtocolEnum.GMX_V2]: TOKEN_TRADE_GMX_V2,
  [ProtocolEnum.KWENTA]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.LEVEL_BNB]: TOKEN_TRADE_LEVEL_BNB,
  [ProtocolEnum.LEVEL_ARB]: TOKEN_TRADE_LEVEL_ARB,
  [ProtocolEnum.MUX_ARB]: TOKEN_TRADE_MUX_ARB,
  [ProtocolEnum.EQUATION_ARB]: TOKEN_TRADE_EQUATION_ARB,
  [ProtocolEnum.BLOOM_BLAST]: TOKEN_TRADE_BLOOM_BLAST,
  [ProtocolEnum.APOLLOX_BNB]: TOKEN_TRADE_APOLLOX_BNB,
  [ProtocolEnum.AVANTIS_BASE]: TOKEN_TRADE_AVANTIS_BASE,
  [ProtocolEnum.TIGRIS_ARB]: TOKEN_TRADE_TIGRIS_ARB,
  [ProtocolEnum.LOGX_BLAST]: TOKEN_TRADE_LOGX_BLAST,
  [ProtocolEnum.LOGX_MODE]: TOKEN_TRADE_LOGX_MODE,
  [ProtocolEnum.MYX_ARB]: TOKEN_TRADE_MYX_ARB,
  [ProtocolEnum.HMX_ARB]: TOKEN_TRADE_HMX_ARB,
  [ProtocolEnum.DEXTORO]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.CYBERDEX]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.VELA_ARB]: TOKEN_TRADE_VELA_ARB,
  [ProtocolEnum.SYNTHETIX_V3]: TOKEN_TRADE_SYNTHETIX_V3,
  [ProtocolEnum.COPIN]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.KTX_MANTLE]: TOKEN_TRADE_KTX_MANTLE,
  [ProtocolEnum.YFX_ARB]: TOKEN_TRADE_YFX_ARB,
  [ProtocolEnum.KILOEX_OPBNB]: TOKEN_TRADE_KILOEX_OPBNB,
  [ProtocolEnum.ROLLIE_SCROLL]: TOKEN_TRADE_ROLLIE_SCROLL,
  [ProtocolEnum.PERENNIAL_ARB]: TOKEN_TRADE_PERENNIAL_ARB,
  [ProtocolEnum.MUMMY_FANTOM]: TOKEN_TRADE_MUMMY_FANTOM,
  [ProtocolEnum.MORPHEX_FANTOM]: TOKEN_TRADE_MORPHEX_FANTOM,
  [ProtocolEnum.HYPERLIQUID]: TOKEN_TRADE_HYPERLIQUID,
  [ProtocolEnum.SYNFUTURE_BASE]: TOKEN_TRADE_SYNFUTURES_BASE,
  [ProtocolEnum.DYDX]: TOKEN_TRADE_DYDX,
  [ProtocolEnum.BSX_BASE]: TOKEN_TRADE_BSX_BASE,
  [ProtocolEnum.UNIDEX_ARB]: TOKEN_TRADE_UNIDEX_ARB,
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
}

export const TOKEN_COLLATERAL_SUPPORT: TokenCollateralSupport = {
  [ProtocolEnum.KTX_MANTLE]: TOKEN_COLLATERAL_MANTLE,
  [ProtocolEnum.COPIN]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.SYNTHETIX_V3]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.VELA_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.DEXTORO]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.CYBERDEX]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.HMX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MYX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.LOGX_MODE]: TOKEN_COLLATERAL_MODE,
  [ProtocolEnum.LOGX_BLAST]: TOKEN_COLLATERAL_BLAST,
  [ProtocolEnum.TIGRIS_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.AVANTIS_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.APOLLOX_BNB]: { ...TOKEN_COLLATERAL_BNB, ...TOKEN_COLLATERAL_APOLLOX_BNB },
  [ProtocolEnum.BLOOM_BLAST]: TOKEN_COLLATERAL_BLAST,
  [ProtocolEnum.EQUATION_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.LEVEL_BNB]: TOKEN_COLLATERAL_BNB,
  [ProtocolEnum.LEVEL_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MUX_ARB]: { ...TOKEN_COLLATERAL_ARB, ...TOKEN_COLLATERAL_MUX_ARB },
  [ProtocolEnum.GNS]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.GNS_POLY]: TOKEN_COLLATERAL_POLYGON,
  [ProtocolEnum.GMX]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.GMX_V2]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.KWENTA]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_COLLATERAL_OPTIMISTIC,
  [ProtocolEnum.YFX_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.KILOEX_OPBNB]: TOKEN_COLLATERAL_OPBNB,
  [ProtocolEnum.ROLLIE_SCROLL]: TOKEN_COLLATERAL_SCROLL,
  [ProtocolEnum.PERENNIAL_ARB]: TOKEN_COLLATERAL_ARB,
  [ProtocolEnum.MUMMY_FANTOM]: { ...TOKEN_COLLATERAL_FTM, ...TOKEN_COLLATERAL_MUMMY_FANTOM },
  [ProtocolEnum.MORPHEX_FANTOM]: { ...TOKEN_COLLATERAL_FTM, ...TOKEN_COLLATERAL_MORPHEX_FANTOM },
  [ProtocolEnum.HYPERLIQUID]: {},
  [ProtocolEnum.SYNFUTURE_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.DYDX]: {},
  [ProtocolEnum.BSX_BASE]: TOKEN_COLLATERAL_BASE,
  [ProtocolEnum.UNIDEX_ARB]: { ...TOKEN_COLLATERAL_ARB, ...TOKEN_COLLATERAL_UNIDEX_ARB },
}

export const SYNTHETIX_MARKETS: { [key: number]: string[] } = {
  [OPTIMISM_MAINNET]: Object.keys(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  [OPTIMISM_SEPOLIA]: [
    '0x5463B99CdB8e0392F1cf381079De910Ab2ED762D',
    '0xa89402D83DeD4C71639Cf0Ca1f5FCc25EE4eB1A8',
    '0x2805E91bdf139E68EFfC79117f39b4C34e71B0Bb',
    '0xf3D4f959edb11594a5fEB13Fc11a74F096603779',
    '0x00e793B4ad1eCf68e660BB798c16a2Ea438C0A29',
    '0xC1D3237719867905F42B492030b5CBc8E24c8dA1',
    '0x1821b0d66d72E4a0a85B5B2a2941E76f237552Ba',
    '0xbFC138dFf9Ae45F3e4ae9Bf3aCB47CA8223196E4',
    '0x10e79fe757eD1d18536B2E509AF61235BceD69e0',
    '0x2e11a3638F12A37263b1B4226b61412f6BBB277c',
    '0x91DfFf9A9E4fE4F3BBD2F83c60A7fE335bbc316a',
    '0x01F226F3FB083165401c9e50FDE718b6a2b266A9',
    '0x867D147fDe1e29C37B6cFbA35A266C7A758489Ee',
    '0x58ed75617f2701Ec1Be85709dAB27cEcab327C04',
    '0xcA3988389C58F9C46245abbD6e3549744d516531',
    '0xc50E64e2E980a67BbD85B68A3Ad96aCB1c037921',
    '0x0d407B6B9261558249c3B7e68f2E237bC2aA1F02',
    '0x1120e7DDB511493040F41Add9bBe3F9c53b967E0',
    '0x0E9628026e53f4c805073d85554A87dBd2011268',
    '0x9Ef3B803ed63A7E2f6cA1C46e313d8db642AA864',
    '0x5D6e4263a203A1677Da38f175d95759adA27e6F9',
    '0x4EA91e75335Fa05182a7c8BD9D54A1f1ff6Ed29E',
    '0x08808c5B37e731bCcCd0Ae59f5681d0040022Af3',
    '0xBF1B83321d97734D11399Eabb38684dB33d8B3D6',
    '0xCa1Da01A412150b00cAD52b426d65dAB38Ab3830',
    '0xF60D392b73E4333ff7fb100235D235c0922cF9a4',
    '0xDDc8EcC1Fe191e5a156cb1e7cd00fE572bb272E5',
    '0xe14F12246A6965aB2E8ea52A1Be39B8f731bc4a4',
    '0x14fA3376E2ffa41708A0636009A35CAE8D8E2bc7',
    '0x18433f795e05E8FF387C0633aF4140e72cdd5A94',
    '0x6ee09cF4B660975D8Fdb041AE257BAc34f4aA589',
    '0xeA4662804B884EB6ed4DAe4323Ea20e04c07626d',
    '0x3a47Ec548435A4478B2042Cbdc56F94cB62c435F',
    '0xFFa9181926d4C6003213cAb599963D0614b0cA61',
    '0x041013BCB3637778B5056Bf5595318415EC21C0d',
    '0x5fc12B9E0284545b6d979b77436D3BaA3b0F612d',
    '0xE97AE65AB0108DDc4dF34b6Aff7B17D911C39931',
    '0x928B8C670D244ee09b8b57Cac7b6F042e6FC4306',
    '0xFf1AA6A6B8a8CDD82a7B275A65D9EF7fa5EcE2e6',
    '0x52a35CaED46a6c20B5c43a0D6BEDc4990800E492',
    '0x227F3d73Cf5618640fe3a0eF8404929aa99532c8',
    '0x3A2F7083C1617e4371bA723Bc27dED8A1Bd6AD90',
    '0x524c0B136F54941529b8c11214A05f958a89A6A6',
    '0x8262BaDdD5644b02f317eA1AD4E5cBC52B9bfd0b',
    '0x9763510E1E0057bE624Ded90e1916130cBe920df',
    '0x9c898362025AF668067947fA55500081B13fdC7e',
    '0x4398715c8742732F9A4e21664249D120b5436725',
    '0xa35575182f5985d6caA1E4e435e7EaF986232ef8',
    '0xD0dedf5199616297063C9Ad820F65ecB9d36851E',
    '0x06775cce8ec277b54aD2a85A74Dc4273330dd445',
    '0x537E59ddb03a95cD127870Ef95d87446f0E76A92',
    '0x345b046a097C937162116716e6a8449d0D1EFA88',
    '0x99CC961612B627C535a82819Ea291800D9E69783',
    '0xA5a6887a19c99D6Cf087B1c8e71539a519b7bFe6',
    '0xC49A8F98B4D7E033bF99008387D2C3fE0Ccc532c',
    '0x16665311Ea294747F10380a91f25193D8A9612A4',
    '0xaaEe25Fef392266cC85Ef110Aa098a1A3238E5A5',
    '0x01d6792DD0456b5bE831c4BD1F107eF524f89495',
    '0x393650685eE7f9b7aeB01E1b6881540af0d71ffF',
    '0x09be72F8DC6E5D327A116087A2b33e0DeC49CDC6',
    '0x3707CF43F93fDDE90aC0A06e6c7C052a8e8F335A',
    '0x0A0e4917e67054CdD06d07d12D4a8f623D2d7269',
    '0xc3beea442B907465C3632Fa7F3C9ee9E2b997994',
    '0x96ffa60CA169e648b098aFADCCEec4b8eE455ec4',
    '0x92BcE39eC30453b9b1f3FF14207653230e74cDC2',
    '0x0d9Ec064105A1B0A95F4C75c56E617CCa6b1931b',
    '0x01683A14CC451e46dBDf02050B96735C5FBcf9d3',
    '0xBbB5b6C8BaDd8b3B70B6816C65D94e4277614741',
    '0xff72A63fAb428545Ee7a6a7bd30323cc1Cc0b30c',
    '0xd3870Aa7A0950Fa181Ad7b8c244Db390C7c37F1B',
    '0xcE6f7404668089A1d61788BA3d4Bec6480f66aF4',
    '0xa98AA8febE4B61038Df2bc843C7F902faA7Faf8B',
    '0x846195Ecd35B602F82429670b7C251C142E8F148',
    '0x33073dCE3717383c157191E3dC3A881C5c51b12d',
  ],
}

export const getDefaultTokenTrade = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return Object.values(tokensSupport)[0]
}

export const getTokenTradeList = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return (tokensSupport ? Object.values(tokensSupport) : []) as TokenTrade[]
}

const normalizeSymbolOption = (symbol: string) => {
  switch (symbol) {
    case '1000BONK':
      return 'BONK'
    case '1000PEPE':
      return 'PEPE'
    case '1000FLOKI':
      return 'FLOKI'
    case '1000SHIB':
      return 'SHIB'
    case '1000LUNC':
      return 'LUNC'
    case '1000DOGS':
      return 'DOGS'
    default:
      return symbol
  }
}

export const getDefaultTokenOptions = (protocol: ProtocolEnum) => {
  const tokensSupport = getTokenTradeSupport(protocol)
  return Array.from(
    new Set(
      Object.values(tokensSupport)
        .map((_v) => (_v?.symbol ? normalizeSymbolOption(_v.symbol) : ''))
        .filter((_v) => !!_v)
    )
  ).map((key) => ({
    id: key,
    label: key,
    value: key,
  }))
}
export const getTokenOptions = ({ protocol, ignoredAll }: { protocol: ProtocolEnum; ignoredAll?: boolean }) => {
  const tokenOptions = getDefaultTokenOptions(protocol)
  if (!tokenOptions) return [ALL_OPTION]

  return ignoredAll ? tokenOptions : [ALL_OPTION, ...tokenOptions]
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

export function getTokenTradeSupport(protocol: ProtocolEnum): {
  [key: string]: TokenTrade | undefined
} {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const result = Object.entries(tokens).reduce<Record<string, TokenTrade | undefined>>((_r, [key, value]) => {
    const tokenTrade: TokenTrade = { symbol: value.symbol, address: key }
    return { ..._r, [key]: tokenTrade }
  }, {})
  return result
}

export function getSymbolByTokenTrade(protocol: ProtocolEnum): Record<string, string> {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const result = Object.entries(tokens).reduce<Record<string, string>>((_r, [key, value]) => {
    return { ..._r, [key]: value.symbol }
  }, {})
  return result
}
export function getIndexTokensBySymbol(protocol: ProtocolEnum): Record<string, string[]> {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const result = Object.entries(tokens).reduce<Record<string, string[]>>((_r, [key, value]) => {
    return { ..._r, [value.symbol]: [...(_r[value.symbol] ?? []), key] }
  }, {})
  return result
}

export function getSymbolsFromIndexTokens(protocol: ProtocolEnum, indexTokens: string[]): string[] {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const symbolByIndexToken = Object.entries(tokens).reduce<Record<string, string>>((_r, [key, value]) => {
    return { ..._r, [key]: value.symbol }
  }, {})
  const symbols = Array.from(new Set(indexTokens.map((indexToken) => symbolByIndexToken[indexToken]))).filter(
    (v) => !!v
  )
  return symbols
}

export function getIndexTokensFromSymbols(protocol: ProtocolEnum, symbols: string[]): string[] {
  const tokens = TOKEN_TRADE_SUPPORT[protocol] ?? {}
  const indexTokens: string[] = []
  Object.entries(tokens).forEach(([indexToken, tokenSymbol]) => {
    symbols.forEach((symbol) => {
      if (tokenSymbol.symbol.match(symbol)) indexTokens.push(indexToken)
    })
  })
  return indexTokens
}

export function getSymbolTradingView(symbol: string) {
  switch (symbol) {
    case '1000BONK':
    case 'kBONK':
      return 'BONK'
    case '1000PEPE':
    case 'kPEPE':
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
    case 'RNDR':
      return 'RENDER'
    default:
      return symbol
  }
}
export function getPriceTradingView(symbol: string, price?: number) {
  if (!price) return
  switch (symbol) {
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
      return price / 1000
    default:
      return price
  }
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
