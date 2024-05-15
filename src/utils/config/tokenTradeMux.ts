import { PYTH_IDS_MAPPING } from './pythIds'

const MUX_PAIRS = {
  'MUX_ARB-3': 'ETH',
  'MUX_ARB-4': 'BTC',
  'MUX_ARB-5': 'AVAX',
  'MUX_ARB-6': 'BNB',
  'MUX_ARB-7': 'FTM',
  'MUX_ARB-9': 'OP',
  'MUX_ARB-10': 'ARB',
}
const MUX_COLLATERALS = {
  'MUX_ARB-0': 'USDC.e',
  'MUX_ARB-1': 'USDT',
  'MUX_ARB-2': 'DAI',
  'MUX_ARB-3': 'WETH',
  'MUX_ARB-4': 'WBTC',
  'MUX_ARB-5': 'AVAX',
  'MUX_ARB-6': 'BNB',
  'MUX_ARB-7': 'FTM',
  'MUX_ARB-8': 'BUSD',
  'MUX_ARB-9': 'OP',
  'MUX_ARB-10': 'ARB',
  'MUX_ARB-11': 'USDC',
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
const TOKEN_TRADE_MUX_ARB = Object.entries(MUX_PAIRS).reduce((result, [key, value]) => {
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
const TOKEN_COLLATERAL_MUX_ARB = Object.entries(MUX_COLLATERALS).reduce((result, [key, value]) => {
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
export { TOKEN_TRADE_MUX_ARB, TOKEN_COLLATERAL_MUX_ARB }
