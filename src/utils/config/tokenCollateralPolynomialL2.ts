import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_POLYNOMIAL_L2: TokenCollateralMapping = {
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
  },
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
  },
  '0x17C9D8Cef7Ef072844EEaEdE1F9f54C7E3fa8743': {
    address: '0x17C9D8Cef7Ef072844EEaEdE1F9f54C7E3fa8743',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc': {
    address: '0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc',
    symbol: 'SDAI',
    decimals: 18,
    isStableCoin: true,
  },
  '0x2A06DEAc3E863c23DD6a89Eeacd80aBA9E08B77B': {
    address: '0x2A06DEAc3E863c23DD6a89Eeacd80aBA9E08B77B',
    symbol: 'sUSDe',
    decimals: 18,
    isStableCoin: true,
  },
  '0x8e3cDfa056320BCeD6974F3e59469537703bDB2c': {
    address: '0x8e3cDfa056320BCeD6974F3e59469537703bDB2c',
    symbol: 'fxUSD',
    decimals: 18,
    isStableCoin: true,
  },
  '0x2369EB4a76d80fBeAa7Aa73e1e1f9EAeE88C07F4': {
    address: '0x2369EB4a76d80fBeAa7Aa73e1e1f9EAeE88C07F4',
    symbol: 'fxUSDC',
    decimals: 18,
    isStableCoin: true,
  },
  '0x6224dC817dC4D5c53fcF3eb08A4f84C456F9f38f': {
    address: '0x6224dC817dC4D5c53fcF3eb08A4f84C456F9f38f',
    symbol: 'USD0++',
    decimals: 18,
    isStableCoin: true,
  },
}
