import { PYTH_IDS_MAPPING } from './pythIds'

const HMX_ARB_PAIRS = {
  'HMX_ARB-0': 'ETH',
  'HMX_ARB-1': 'BTC',
  'HMX_ARB-12': 'ADA',
  'HMX_ARB-13': 'MATIC',
  'HMX_ARB-14': 'SUI',
  'HMX_ARB-15': 'ARB',
  'HMX_ARB-16': 'OP',
  'HMX_ARB-17': 'LTC',
  'HMX_ARB-20': 'BNB',
  'HMX_ARB-21': 'SOL',
  'HMX_ARB-23': 'XRP',
  'HMX_ARB-25': 'LINK',
  'HMX_ARB-27': 'DOGE',
  'HMX_ARB-32': 'BCH',
  'HMX_ARB-33': 'MEME',
  'HMX_ARB-35': 'JTO',
  'HMX_ARB-36': 'STX',
  'HMX_ARB-37': 'ORDI',
  'HMX_ARB-38': 'TIA',
  'HMX_ARB-39': 'AVAX',
  'HMX_ARB-40': 'INJ',
  'HMX_ARB-41': 'DOT',
  'HMX_ARB-42': 'SEI',
  'HMX_ARB-43': 'ATOM',
  'HMX_ARB-44': '1000PEPE',
  'HMX_ARB-45': 'SHIB',
  'HMX_ARB-47': 'ICP',
  'HMX_ARB-48': 'MANTA',
  'HMX_ARB-49': 'STRK',
  'HMX_ARB-50': 'PYTH',
  'HMX_ARB-51': 'PENDLE',
  'HMX_ARB-52': 'W',
  'HMX_ARB-53': 'ENA',
}

type TokenValues = Record<
  string,
  {
    address: string
    name: string
    symbol: string
    decimals: number
    priceFeedId: string
  }
>
const TOKEN_TRADE_HMX_ARB = Object.entries(HMX_ARB_PAIRS).reduce((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      address: key,
      name: value,
      symbol: value,
      decimals: 18,
      priceFeedId: PYTH_IDS_MAPPING[value as keyof typeof PYTH_IDS_MAPPING] ?? '',
    },
  }
}, {} as TokenValues)

export { TOKEN_TRADE_HMX_ARB }
