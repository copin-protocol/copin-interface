import { ProtocolTokenMapping } from './trades'

const TIGRIS_PAIRS = {
  'TIGRIS_ARB-0': 'BTC',
  'TIGRIS_ARB-1': 'ETH',
  'TIGRIS_ARB-3': 'MATIC',
  'TIGRIS_ARB-4': 'LINK',
  'TIGRIS_ARB-13': 'BNB',
  'TIGRIS_ARB-14': 'ADA',
  'TIGRIS_ARB-15': 'ATOM',
  'TIGRIS_ARB-18': 'SOL',
  'TIGRIS_ARB-19': 'DOGE',
  'TIGRIS_ARB-20': 'LTC',
  'TIGRIS_ARB-21': 'BCH',
  'TIGRIS_ARB-23': 'DOT',
  'TIGRIS_ARB-24': 'XMR',
  'TIGRIS_ARB-25': 'SHIB',
  'TIGRIS_ARB-26': 'AVAX',
  'TIGRIS_ARB-27': 'UNI',
  'TIGRIS_ARB-29': 'NEAR',
  'TIGRIS_ARB-30': 'ALGO',
  'TIGRIS_ARB-35': 'ARB',
  'TIGRIS_ARB-36': 'PEPE',
  'TIGRIS_ARB-37': 'GMX',
  'TIGRIS_ARB-38': 'XRP',
  'TIGRIS_ARB-42': 'PYTH',
  'TIGRIS_ARB-43': 'TIA',
  'TIGRIS_ARB-44': 'MANTA',
  'TIGRIS_ARB-45': 'ORDI',
  'TIGRIS_ARB-46': 'SUI',
  'TIGRIS_ARB-47': 'SEI',
  'TIGRIS_ARB-48': 'TON',
}

export const TOKEN_TRADE_TIGRIS_ARB = Object.entries(TIGRIS_PAIRS).reduce<ProtocolTokenMapping>(
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
