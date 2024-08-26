import { TokenCollateral } from 'utils/types'

import { ProtocolTokenMapping } from './trades'

const MUX_PAIRS = {
  'MUX_ARB-3': 'ETH',
  'MUX_ARB-4': 'BTC',
  'MUX_ARB-5': 'AVAX',
  'MUX_ARB-6': 'BNB',
  'MUX_ARB-7': 'FTM',
  'MUX_ARB-9': 'OP',
  'MUX_ARB-10': 'ARB',
}
const TOKEN_COLLATERAL_MUX_ARB: Record<string, TokenCollateral> = {
  'MUX_ARB-0': {
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    symbol: 'USDC.e',
    decimals: 6,
    isStableCoin: true,
  },
  'MUX_ARB-1': {
    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
  'MUX_ARB-2': {
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    symbol: 'DAI',
    decimals: 18,
    isStableCoin: true,
  },
  'MUX_ARB-3': {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    symbol: 'WETH',
    decimals: 18,
  },
  'MUX_ARB-4': {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    symbol: 'WBTC',
    decimals: 8,
  },
  'MUX_ARB-5': {
    address: '0xD5Dc01dC5D0D7c8e8DE2847E687d8ba6f08b997f',
    symbol: 'AVAX',
    decimals: 18,
  },
  'MUX_ARB-6': {
    address: '0x20865e63B111B2649ef829EC220536c82C58ad7B',
    symbol: 'BNB',
    decimals: 18,
  },
  'MUX_ARB-7': {
    address: '0xd42785D323e608B9E99fa542bd8b1000D4c2Df37',
    symbol: 'FTM',
    decimals: 18,
  },
  'MUX_ARB-8': {
    address: '0x52095F518048fAFCfba0Ec9F93962df449Bc604e',
    symbol: 'BUSD',
    decimals: 18,
    isStableCoin: true,
  },
  'MUX_ARB-9': {
    address: '0x208CC654c0CD5e488b6E2fCeC1c22E4f673d89dD',
    symbol: 'OP',
    decimals: 18,
  },
  'MUX_ARB-10': {
    address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    symbol: 'ARB',
    decimals: 18,
  },
  'MUX_ARB-11': {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
}

const TOKEN_TRADE_MUX_ARB = Object.entries(MUX_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_MUX_ARB, TOKEN_COLLATERAL_MUX_ARB }
