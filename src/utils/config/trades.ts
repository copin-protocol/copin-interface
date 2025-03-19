// TODO: Check when add new protocol
import { CopyTradePlatformEnum } from 'utils/config/enums'

export { PROTOCOL_PROVIDER } from './protocolProviderConfig'

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

type TokenIgnore = { [key in CopyTradePlatformEnum]: string[] }

export const SYNTHETIX_V3_MARKET_IDS = {
  BTC: 200,
  ETH: 100,
}
export interface TokenTrade {
  address: string
  // name: string
  symbol: string
  // decimals: number
  // priceFeedId: string
  // icon: string
}

export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.OTHERS]: [],
  [CopyTradePlatformEnum.APEX]: [],
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

export { TOKEN_COLLATERAL_SUPPORT } from './tokenCollateralSupport'

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
