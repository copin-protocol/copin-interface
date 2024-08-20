import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_BASE: TokenCollateralMapping = {
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'ETH',
    decimals: 18,
  },
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb': {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    symbol: 'DAI',
    decimals: 6,
    isStableCoin: true,
  },
}
