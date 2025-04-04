import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_BLAST: TokenCollateralMapping = {
  '0x4300000000000000000000000000000000000004': {
    address: '0x4300000000000000000000000000000000000004',
    symbol: 'ETH',
    decimals: 18,
  },
  '0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692': {
    address: '0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692',
    symbol: 'BTC',
    decimals: 8,
  },
  '0x4300000000000000000000000000000000000003': {
    address: '0x4300000000000000000000000000000000000003',
    symbol: 'USDB',
    decimals: 18,
    isStableCoin: true,
  },
}
