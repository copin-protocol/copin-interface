import { PYTH_IDS_MAPPING } from './pythIds'

const TOKEN_TRADE_LEVEL_ARB = {
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
  '0x912CE59144191C1204E64559FE8253a0e49E6548': {
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    name: 'ARB',
    symbol: 'ARB',
    decimals: 18,
    priceFeedId: '',
  },
}

const TOKEN_TRADE_LEVEL_BNB = {
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c': {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 18,
    priceFeedId: '',
  },
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '',
  },
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    priceFeedId: '',
  },
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82': {
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    name: 'CAKE',
    symbol: 'CAKE',
    decimals: 18,
    priceFeedId: '',
  },
}

for (const key in TOKEN_TRADE_LEVEL_ARB) {
  const values = TOKEN_TRADE_LEVEL_ARB[key as keyof typeof TOKEN_TRADE_LEVEL_ARB]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

for (const key in TOKEN_TRADE_LEVEL_BNB) {
  const values = TOKEN_TRADE_LEVEL_BNB[key as keyof typeof TOKEN_TRADE_LEVEL_BNB]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

export { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB }
