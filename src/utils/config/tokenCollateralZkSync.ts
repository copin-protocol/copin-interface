import { TokenCollateralMapping } from 'utils/types'

export const TOKEN_COLLATERAL_ZKSYNC_ERA: TokenCollateralMapping = {
  '0x000000000000000000000000000000000000800A': {
    address: '0x000000000000000000000000000000000000800A',
    symbol: 'ETH',
    decimals: 18,
  },
  '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011': {
    address: '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011',
    symbol: 'BTC',
    decimals: 8,
  },
  '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E': {
    address: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
    symbol: 'ZK',
    decimals: 18,
  },
  '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4': {
    address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    symbol: 'USDC',
    decimals: 18,
    isStableCoin: true,
  },
  '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C': {
    address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    symbol: 'USDT',
    decimals: 18,
    isStableCoin: true,
  },
}
