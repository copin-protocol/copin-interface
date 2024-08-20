import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_OPTIMISTIC: TokenCollateralMapping = {
  '0x4200000000000000000000000000000000000042': {
    address: '0x4200000000000000000000000000000000000042',
    symbol: 'OP',
    decimals: 18,
  },
  '0x68f180fcCe6836688e9084f035309E29Bf0A2095': {
    address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    symbol: 'BTC',
    decimals: 8,
  },
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'ETH',
    decimals: 18,
  },
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58': {
    address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
  '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85': {
    address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': {
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    symbol: 'USDC.e',
    decimals: 6,
    isStableCoin: true,
  },
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': {
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    symbol: 'DAI',
    decimals: 18,
    isStableCoin: true,
  },
  '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
    address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
    symbol: 'sUSD',
    decimals: 18,
    isStableCoin: true,
  },
}
