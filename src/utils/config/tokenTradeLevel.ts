import { ProtocolTokenMapping } from './trades'

const TOKEN_TRADE_LEVEL_ARB: ProtocolTokenMapping = {
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': {
    symbol: 'BTC',
  },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
    symbol: 'ETH',
  },
  '0x912CE59144191C1204E64559FE8253a0e49E6548': {
    symbol: 'ARB',
  },
}

const TOKEN_TRADE_LEVEL_BNB: ProtocolTokenMapping = {
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c': {
    symbol: 'BTC',
  },
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': {
    symbol: 'ETH',
  },
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': {
    symbol: 'BNB',
  },
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82': {
    symbol: 'CAKE',
  },
}

export { TOKEN_TRADE_LEVEL_ARB, TOKEN_TRADE_LEVEL_BNB }
