import { TokenCollateral } from 'utils/types'

import { ProtocolTokenMapping } from './trades'

const UNIDEX_ARB_PAIRS = {
  'UNIDEX_ARB-1': 'BTC',
  'UNIDEX_ARB-2': 'ETH',
  'UNIDEX_ARB-3': 'FTM',
  'UNIDEX_ARB-4': 'SOL',
  'UNIDEX_ARB-5': 'DOGE',
  'UNIDEX_ARB-6': 'AVAX',
  'UNIDEX_ARB-7': 'BNB',
  'UNIDEX_ARB-9': 'ADA',
  'UNIDEX_ARB-10': 'ATOM',
  'UNIDEX_ARB-11': 'NEAR',
  'UNIDEX_ARB-12': 'ARB',
  'UNIDEX_ARB-13': 'OP',
  'UNIDEX_ARB-14': 'LTC',
  'UNIDEX_ARB-15': 'GMX',
  'UNIDEX_ARB-18': 'INJ',
  'UNIDEX_ARB-19': 'TIA',
  'UNIDEX_ARB-20': 'AERO',
  'UNIDEX_ARB-21': 'MERL',
  'UNIDEX_ARB-22': 'SAFE',
  'UNIDEX_ARB-23': 'OMNI',
  'UNIDEX_ARB-24': 'REZ',
  'UNIDEX_ARB-25': 'ETHFI',
  'UNIDEX_ARB-26': 'BOME',
  'UNIDEX_ARB-27': 'ORDI',
  'UNIDEX_ARB-28': 'DYM',
  'UNIDEX_ARB-29': 'TAO',
  'UNIDEX_ARB-30': 'WLD',
  'UNIDEX_ARB-31': 'POPCAT',
  'UNIDEX_ARB-32': 'ZRO',
  'UNIDEX_ARB-33': 'RUNE',
  'UNIDEX_ARB-34': 'MEW',
  'UNIDEX_ARB-35': 'BEAM',
  'UNIDEX_ARB-36': 'STRK',
  'UNIDEX_ARB-37': 'AAVE',
  'UNIDEX_ARB-38': 'XRP',
  'UNIDEX_ARB-39': 'TON',
  'UNIDEX_ARB-40': 'NOT',
  'UNIDEX_ARB-41': 'RLB',
  'UNIDEX_ARB-42': 'ALICE',
  'UNIDEX_ARB-43': 'APE',
  'UNIDEX_ARB-44': 'APT',
  'UNIDEX_ARB-45': 'AVAIL',
  'UNIDEX_ARB-46': 'DEGEN',
  'UNIDEX_ARB-47': 'RDNT',
  'UNIDEX_ARB-48': 'SUI',
  'UNIDEX_ARB-49': 'PEPE',
  'UNIDEX_ARB-50': 'EIGEN',
}

const TOKEN_COLLATERAL_UNIDEX_ARB: Record<string, TokenCollateral> = {
  '0x565609fAF65B92F7be02468acF86f8979423e514': {
    address: '0x565609fAF65B92F7be02468acF86f8979423e514',
    symbol: 'AVAX',
    decimals: 18,
  },
}

const TOKEN_TRADE_UNIDEX_ARB = Object.entries(UNIDEX_ARB_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_UNIDEX_ARB, TOKEN_COLLATERAL_UNIDEX_ARB }
