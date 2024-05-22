import { PYTH_IDS_MAPPING } from './pythIds'

const TOKEN_TRADE_LOGX_BLAST = {
  '0x73c369F61c90f03eb0Dd172e95c90208A28dC5bc': {
    address: '0x73c369F61c90f03eb0Dd172e95c90208A28dC5bc',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 18,
    priceFeedId: '',
  },
  '0x4300000000000000000000000000000000000004': {
    address: '0x4300000000000000000000000000000000000004',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '',
  },
}

const TOKEN_TRADE_LOGX_MODE = {
  '0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF': {
    address: '0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 18,
    priceFeedId: '',
  },
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '',
  },
}

for (const key in TOKEN_TRADE_LOGX_BLAST) {
  const values = TOKEN_TRADE_LOGX_BLAST[key as keyof typeof TOKEN_TRADE_LOGX_BLAST]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

for (const key in TOKEN_TRADE_LOGX_MODE) {
  const values = TOKEN_TRADE_LOGX_MODE[key as keyof typeof TOKEN_TRADE_LOGX_MODE]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

export { TOKEN_TRADE_LOGX_BLAST, TOKEN_TRADE_LOGX_MODE }
