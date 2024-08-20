import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_MODE: TokenCollateralMapping = {
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'ETH',
    decimals: 18,
  },
  '0xd988097fb8612cc24eeC14542bC03424c656005f': {
    address: '0xd988097fb8612cc24eeC14542bC03424c656005f',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0xf0F161fDA2712DB8b566946122a5af183995e2eD': {
    address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
}
