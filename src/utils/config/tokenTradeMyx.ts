import { PYTH_IDS_MAPPING } from './pythIds'

const MYX_PAIRS = {
  'MYX_ARB-1': 'BTC',
  'MYX_ARB-2': 'ETH',
  'MYX_ARB-3': 'ARB',
  'MYX_ARB-4': 'SOL',
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
const TOKEN_TRADE_MYX_ARB = Object.entries(MYX_PAIRS).reduce((result, [key, value]) => {
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

export { TOKEN_TRADE_MYX_ARB }
