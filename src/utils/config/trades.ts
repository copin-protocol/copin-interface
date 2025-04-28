// TODO: Check when add new protocol
import { CopyTradePlatformEnum } from 'utils/config/enums'

import { GAINS_TRADE_PROTOCOLS } from './constants'
import { ProtocolEnum } from './enums'

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

// TODO: Refactor this to get from api
export function getSymbolTradingView({
  protocol,
  exchange,
  symbol,
}: {
  protocol?: ProtocolEnum
  exchange?: CopyTradePlatformEnum
  symbol: string
}) {
  const isHyperliquid =
    exchange === CopyTradePlatformEnum.HYPERLIQUID ||
    (exchange !== CopyTradePlatformEnum.GNS_V8 && protocol === ProtocolEnum.HYPERLIQUID)
  const isGains =
    exchange === CopyTradePlatformEnum.GNS_V8 ||
    (exchange !== CopyTradePlatformEnum.HYPERLIQUID && protocol && GAINS_TRADE_PROTOCOLS.includes(protocol))
  let _symbol = symbol ? symbol : undefined
  if (isHyperliquid) {
    switch (symbol) {
      case '1000NEIRO':
        _symbol = 'kNEIRO'
        break
      case '1000PEPE':
      case 'MPEPE':
        _symbol = 'kPEPE'
        break
      case '1000FLOKI':
        _symbol = 'kFLOKI'
        break
      case '1000LUNC':
        _symbol = 'kLUNC'
        break
      case '1000SHIB':
        _symbol = 'kSHIB'
        break
      case '1000DOGS':
        _symbol = 'kDOGS'
        break
      case '1000BONK':
        _symbol = 'kBONK'
        break
      default:
        break
    }
  } else if (isGains) {
    if (symbol.includes('_USD')) {
      _symbol = symbol.replace('_USD', '')
    } else if (symbol.includes('_')) {
      _symbol = symbol.replace('_', '/')
    } else {
      _symbol = symbol
    }
  } else {
    switch (symbol) {
      case '1000BONK':
      case 'kBONK':
        _symbol = 'BONK'
        break
      case '1000PEPE':
      case 'kPEPE':
      case 'MPEPE':
        _symbol = 'PEPE'
        break
      case '1000FLOKI':
      case 'kFLOKI':
        _symbol = 'FLOKI'
        break
      case '1000SHIB':
      case 'kSHIB':
        _symbol = 'SHIB'
        break
      case '1000LUNC':
      case 'kLUNC':
        _symbol = 'LUNC'
        break
      case '1000DOGS':
        _symbol = 'DOGS'
        break
      case '1000RATS':
        _symbol = 'RATS'
        break
      case '1000SATS':
        _symbol = 'SATS'
        break
      case '1000MOG':
      case '1000000MOG':
      case '1MMOG':
        _symbol = 'MOG'
        break
      case '1000X':
        _symbol = 'X'
        break
      case '1000XEC':
        _symbol = 'XEC'
        break
      case '1000WHY':
        _symbol = 'WHY'
        break
      case '1MBABYDOGE':
        _symbol = 'BABYDOGE'
        break
      case '1000CHEEMS':
      case '1MCHEEMS':
        _symbol = 'CHEEMS'
        break
      case '1000000AIDOGE':
        _symbol = 'AIDOGE'
        break
      case 'RNDR':
        _symbol = 'RENDER'
        break
      case 'BTCDEGEN':
        _symbol = 'BTC'
        break
      case 'ETHDEGEN':
        _symbol = 'ETH'
        break
      case '1000NEIRO':
        _symbol = 'NEIRO'
        break
      default:
        break
    }
  }
  return { isHyperliquid, isGains, symbol: _symbol }
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
