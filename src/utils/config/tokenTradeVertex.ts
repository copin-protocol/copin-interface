import { ProtocolTokenMapping } from './trades'

const VERTEX_ARB_PAIRS = {
  'VERTEX_ARB-2': 'BTC',
  'VERTEX_ARB-4': 'ETH',
  'VERTEX_ARB-6': 'ARB',
  'VERTEX_ARB-8': 'BNB',
  'VERTEX_ARB-10': 'XRP',
  'VERTEX_ARB-12': 'SOL',
  'VERTEX_ARB-14': 'POL',
  'VERTEX_ARB-16': 'SUI',
  'VERTEX_ARB-18': 'OP',
  'VERTEX_ARB-20': 'APT',
  'VERTEX_ARB-22': 'LTC',
  'VERTEX_ARB-24': 'BCH',
  'VERTEX_ARB-26': 'COMP',
  'VERTEX_ARB-28': 'MKR',
  'VERTEX_ARB-30': 'MPEPE', // x1M
  'VERTEX_ARB-34': 'DOGE',
  'VERTEX_ARB-36': 'LINK',
  'VERTEX_ARB-38': 'DYDX',
  'VERTEX_ARB-40': 'CRV',
  'VERTEX_ARB-44': 'TIA',
  'VERTEX_ARB-46': 'PYTH',
  'VERTEX_ARB-50': 'JTO',
  'VERTEX_ARB-52': 'AVAX',
  'VERTEX_ARB-54': 'INJ',
  'VERTEX_ARB-56': 'SNX',
  'VERTEX_ARB-58': 'ADA',
  'VERTEX_ARB-60': 'IMX',
  'VERTEX_ARB-62': 'MEME',
  'VERTEX_ARB-64': 'SEI',
  'VERTEX_ARB-66': 'BLUR',
  'VERTEX_ARB-68': 'STX',
  'VERTEX_ARB-70': 'NEAR',
  'VERTEX_ARB-72': 'LDO',
  'VERTEX_ARB-74': 'FIL',
  'VERTEX_ARB-76': 'WLD',
  'VERTEX_ARB-78': 'ICP',
  'VERTEX_ARB-80': 'DOT',
  'VERTEX_ARB-82': 'TRX',
  'VERTEX_ARB-84': 'GALA',
  'VERTEX_ARB-86': 'ATOM',
  'VERTEX_ARB-88': 'APE',
  'VERTEX_ARB-90': 'JUP',
  'VERTEX_ARB-96': 'GMCI30',
  'VERTEX_ARB-98': 'GMMEME',
  'VERTEX_ARB-100': 'TON',
  'VERTEX_ARB-102': 'FTM',
  'VERTEX_ARB-104': 'WIF',
  'VERTEX_ARB-106': 'ONDO',
  'VERTEX_ARB-108': 'ENA',
  'VERTEX_ARB-110': 'MNT',
  'VERTEX_ARB-114': 'BLAST',
  'VERTEX_ARB-130': 'AAVE',
  'VERTEX_ARB-132': 'ZRO',
  'VERTEX_ARB-134': 'EIGEN',
}

const TOKEN_TRADE_VERTEX_ARB = Object.entries(VERTEX_ARB_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_VERTEX_ARB }
