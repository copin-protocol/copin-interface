import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_MANTLE: TokenCollateralMapping = {
  '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111': {
    address: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',
    symbol: 'ETH',
    decimals: 18,
  },
  '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9': {
    address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE': {
    address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
}
