import { ProtocolTokenMapping, TokenCollateral } from './trades'

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

const TOKEN_TRADE_MUX_ARB = Object.entries(MUX_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})
const TOKEN_COLLATERAL_MUX_ARB = Object.entries(MUX_COLLATERALS).reduce<Record<string, TokenCollateral>>(
  (result, [key, value]) => {
    return {
      ...result,
      [key]: {
        address: key,
        symbol: value,
        decimals: 18,
      },
    }
  },
  {}
)
export { TOKEN_TRADE_MUX_ARB, TOKEN_COLLATERAL_MUX_ARB }
