import { ProtocolTokenMapping } from './trades'

const VELA_PAIRS = {
  'VELA_ARB-1': 'BTC',
  'VELA_ARB-2': 'ETH',
  'VELA_ARB-3': 'LTC',
  'VELA_ARB-4': 'ADA',
  'VELA_ARB-5': 'DOGE',
  'VELA_ARB-6': 'SHIB',
  'VELA_ARB-7': 'ARB',
  'VELA_ARB-8': 'SOL',
  'VELA_ARB-9': 'MATIC',
  'VELA_ARB-10': 'AVAX',
  'VELA_ARB-31': 'ATOM',
  'VELA_ARB-32': 'DOT',
  'VELA_ARB-33': 'BNB',
  'VELA_ARB-34': 'PEPE',
  'VELA_ARB-35': 'XRP',
  'VELA_ARB-36': 'CRV',
  'VELA_ARB-37': 'MKR',
  'VELA_ARB-38': 'OP',
  'VELA_ARB-39': 'LINK',
  'VELA_ARB-40': 'INJ',
  'VELA_ARB-41': 'PYTH',
  'VELA_ARB-42': 'BONK',
  'VELA_ARB-43': 'TIA',
  'VELA_ARB-44': 'SEI',
  'VELA_ARB-45': 'SUI',
  'VELA_ARB-46': 'KAS',
  'VELA_ARB-47': 'TAO',
  'VELA_ARB-48': 'NEAR',
  'VELA_ARB-49': 'FET',
  'VELA_ARB-50': 'W',
  'VELA_ARB-51': 'WIF',
  'VELA_ARB-52': 'TON',
  'VELA_ARB-53': 'FLOKI',
  'VELA_ARB-54': 'MEME',
  'VELA_ARB-55': 'BOME',
  'VELA_ARB-56': 'UNI',
  'VELA_ARB-57': 'FTM',
  'VELA_ARB-58': 'AAVE',
  'VELA_ARB-59': 'GMX',
}

const TOKEN_TRADE_VELA_ARB = Object.entries(VELA_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_VELA_ARB }
