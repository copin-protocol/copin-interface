import { PYTH_IDS_MAPPING } from './pythIds'

const PINGU_PAIRS = {
  'PINGU_ARB-BTC-USD': 'BTC',
  'PINGU_ARB-AAVE-USD': 'AAVE',
  'PINGU_ARB-ADA-USD': 'ADA',
  'PINGU_ARB-BNB-USD': 'BNB',
  'PINGU_ARB-MATIC-USD': 'MATIC',
  'PINGU_ARB-NEAR-USD': 'NEAR',
  'PINGU_ARB-SOL-USD': 'SOL',
  'PINGU_ARB-FLOKI-USD': 'FLOKI',
  'PINGU_ARB-DOGE-USD': 'DOGE',
  'PINGU_ARB-ETH-USD': 'ETH',
  'PINGU_ARB-ARB-USD': 'ARB',
  'PINGU_ARB-SUI-USD': 'SUI',
  'PINGU_ARB-PEPE-USD': 'PEPE',
  'PINGU_ARB-LTC-USD': 'LTC',
  'PINGU_ARB-XRP-USD': 'XRP',
  'PINGU_ARB-AVAX-USD': 'AVAX',
  'PINGU_ARB-LINK-USD': 'LINK',
  'PINGU_ARB-DOT-USD': 'DOT',
  'PINGU_ARB-TRX-USD': 'TRX',
  'PINGU_ARB-TON-USD': 'TON',
  'PINGU_ARB-UNI-USD': 'UNI',
  'PINGU_ARB-ATOM-USD': 'ATOM',
  'PINGU_ARB-XLM-USD': 'XLM',
  'PINGU_ARB-OP-USD': 'OP',
  'PINGU_ARB-APT-USD': 'APT',
  'PINGU_ARB-MKR-USD': 'MKR',
  'PINGU_ARB-APE-USD': 'APE',
  'PINGU_ARB-CRV-USD': 'CRV',
  'PINGU_ARB-MANTA-USD': 'MANTA',
  'PINGU_ARB-JUP-USD': 'JUP',
  'PINGU_ARB-DYM-USD': 'DYM',
  'PINGU_ARB-PYTH-USD': 'PYTH',
  'PINGU_ARB-WIF-USD': 'WIF',
  'PINGU_ARB-W-USD': 'W',
  'PINGU_ARB-ENA-USD': 'ENA',
  'PINGU_ARB-SHIB-USD': 'SHIB',
  'PINGU_ARB-BONK-USD': 'BONK',
  'PINGU_ARB-MEME-USD': 'MEME',
  'PINGU_ARB-GMX-USD': 'GMX',
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
const TOKEN_TRADE_PINGU_ARB = Object.entries(PINGU_PAIRS).reduce((result, [key, value]) => {
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

export { TOKEN_TRADE_PINGU_ARB }