import { ProtocolTokenMapping } from './trades'

const MYX_PAIRS = {
  'MYX_ARB-1': 'BTC',
  'MYX_ARB-2': 'ETH',
  'MYX_ARB-3': 'ARB',
  'MYX_ARB-4': 'SOL',
}

const TOKEN_TRADE_MYX_ARB = Object.entries(MYX_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_MYX_ARB }
