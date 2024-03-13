import { PYTH_IDS_MAPPING } from './pythIds'

const TOKEN_TRADE_GMX_V2 = {
  '0x47c031236e19d024b42f8AE6780E44A573170703': {
    address: '0x47c031236e19d024b42f8AE6780E44A573170703',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 22,
    priceFeedId: '',
  },
  '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336': {
    address: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 12,
    priceFeedId: '',
  },
  '0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9': {
    address: '0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9',
    name: 'SOL',
    symbol: 'SOL',
    decimals: 21,
    priceFeedId: '',
  },
  '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407': {
    address: '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407',
    name: 'ARB',
    symbol: 'ARB',
    decimals: 12,
    priceFeedId: '',
  },
  '0x7f1fa204bb700853D36994DA19F830b6Ad18455C': {
    address: '0x7f1fa204bb700853D36994DA19F830b6Ad18455C',
    name: 'LINK',
    symbol: 'LINK',
    decimals: 12,
    priceFeedId: '',
  },
  '0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4': {
    address: '0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4',
    name: 'DOGE',
    symbol: 'DOGE',
    decimals: 22,
    priceFeedId: '',
  },
  '0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c': {
    address: '0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c',
    name: 'XRP',
    symbol: 'XRP',
    decimals: 24,
    priceFeedId: '',
  },
  '0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50': {
    address: '0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50',
    name: 'UNI',
    symbol: 'UNI',
    decimals: 12,
    priceFeedId: '',
  },
  '0xD9535bB5f58A1a75032416F2dFe7880C30575a41': {
    address: '0xD9535bB5f58A1a75032416F2dFe7880C30575a41',
    name: 'LTC',
    symbol: 'LTC',
    decimals: 22,
    priceFeedId: '',
  },
  '0x2d340912Aa47e33c90Efb078e69E70EFe2B34b9B': {
    address: '0x2d340912Aa47e33c90Efb078e69E70EFe2B34b9B',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 12,
    priceFeedId: '',
  },
  '0x248C35760068cE009a13076D573ed3497A47bCD4': {
    address: '0x248C35760068cE009a13076D573ed3497A47bCD4',
    name: 'ATOM',
    symbol: 'ATOM',
    decimals: 24,
    priceFeedId: '',
  },
  '0x63Dc80EE90F26363B3FCD609007CC9e14c8991BE': {
    address: '0x63Dc80EE90F26363B3FCD609007CC9e14c8991BE',
    name: 'NEAR',
    symbol: 'NEAR',
    decimals: 6,
    priceFeedId: '',
  },
  '0x1CbBa6346F110c8A5ea739ef2d1eb182990e4EB2': {
    address: '0x1CbBa6346F110c8A5ea739ef2d1eb182990e4EB2',
    name: 'AAVE',
    symbol: 'AAVE',
    decimals: 12,
    priceFeedId: '',
  },
  '0x7BbBf946883a5701350007320F525c5379B8178A': {
    address: '0x7BbBf946883a5701350007320F525c5379B8178A',
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 12,
    priceFeedId: '',
  },
}

for (const key in TOKEN_TRADE_GMX_V2) {
  const values = TOKEN_TRADE_GMX_V2[key as keyof typeof TOKEN_TRADE_GMX_V2]
  values.priceFeedId = PYTH_IDS_MAPPING[values.symbol as keyof typeof PYTH_IDS_MAPPING] ?? ''
}

export { TOKEN_TRADE_GMX_V2 }
