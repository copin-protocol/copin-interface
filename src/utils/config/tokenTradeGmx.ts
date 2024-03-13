import { PYTH_IDS_MAPPING } from './pythIds'

const TOKEN_TRADE_GMX = {
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 8,
    priceFeedId: '',
  },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '',
  },

  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': {
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    name: 'LINK',
    symbol: 'LINK',
    decimals: 18,
    priceFeedId: '',
  },
  '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': {
    address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    name: 'UNI',
    symbol: 'UNI',
    decimals: 18,
    priceFeedId: '',
  },
}

for (const key in TOKEN_TRADE_GMX) {
  const values = TOKEN_TRADE_GMX[key as keyof typeof TOKEN_TRADE_GMX]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

export { TOKEN_TRADE_GMX }
