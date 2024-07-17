import { ProtocolTokenMapping } from './trades'

const AVANTIS_PAIRS = {
  'AVANTIS_BASE-0': 'ETH',
  'AVANTIS_BASE-1': 'BTC',
  'AVANTIS_BASE-2': 'SOL',
  'AVANTIS_BASE-3': 'BNB',
  'AVANTIS_BASE-4': 'ARB',
  'AVANTIS_BASE-5': 'DOGE',
  'AVANTIS_BASE-6': 'AVAX',
  'AVANTIS_BASE-7': 'OP',
  'AVANTIS_BASE-8': 'MATIC',
  'AVANTIS_BASE-9': 'TIA',
  'AVANTIS_BASE-10': 'SEI',
  'AVANTIS_BASE-22': 'SHIB',
  'AVANTIS_BASE-23': 'PEPE',
  'AVANTIS_BASE-24': 'BONK',
  'AVANTIS_BASE-25': 'WIF',
  'AVANTIS_BASE-26': 'RNDR',
  'AVANTIS_BASE-27': 'WLD',
  'AVANTIS_BASE-28': 'FET',
  'AVANTIS_BASE-29': 'ARKM',
  'AVANTIS_BASE-30': 'PENDLE',
  'AVANTIS_BASE-31': 'ONDO',
  'AVANTIS_BASE-32': 'PRIME',
  'AVANTIS_BASE-33': 'DYM',
  'AVANTIS_BASE-34': 'ORDI',
  'AVANTIS_BASE-35': 'STX',
  'AVANTIS_BASE-36': 'ENA',
  'AVANTIS_BASE-37': 'AERO',
  'AVANTIS_BASE-38': 'ETHFI',
  'AVANTIS_BASE-39': 'JUP',
  'AVANTIS_BASE-40': 'REZ',
  'AVANTIS_BASE-41': 'LINK',
  'AVANTIS_BASE-42': 'LDO',
  'AVANTIS_BASE-43': 'NEAR',
  'AVANTIS_BASE-44': 'INJ',
  'AVANTIS_BASE-45': 'ZK',
  'AVANTIS_BASE-46': 'ZRO',
  'AVANTIS_BASE-47': 'BLAST',
}

export const TOKEN_TRADE_AVANTIS_BASE = Object.entries(AVANTIS_PAIRS).reduce<ProtocolTokenMapping>(
  (result, [key, value]) => {
    return {
      ...result,
      [key]: {
        symbol: value,
      },
    }
  },
  {}
)
