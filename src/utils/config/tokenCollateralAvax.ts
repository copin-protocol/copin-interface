import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_AVAX: TokenCollateralMapping = {
  '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7': {
    address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
  '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E': {
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a': {
    address: '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a',
    symbol: 'DAI', // Old DAI
    decimals: 18,
    isStableCoin: true,
  },
  '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70': {
    address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    symbol: 'DAI', // New DAI
    decimals: 18,
    isStableCoin: true,
  },
  '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB': {
    address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    symbol: 'ETH',
    decimals: 18,
  },
  '0x50b7545627a5162F82A992c33b87aDc75187B218': {
    address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
    symbol: 'BTC',
    decimals: 8,
  },
}
