import { TokenCollateral } from 'utils/types'

import { ProtocolTokenMapping } from './trades'

const MORPHEX_PAIRS = {
  '0xf1648C50d2863f780c57849D812b4B7686031A3D': 'BTC',
  '0x448d59B4302aB5d2dadf9611bED9457491926c8e': 'BTC',
  '0xfe7eDa5F2c56160d406869A8aA4B2F365d544C7B': 'ETH',
  '0x695921034f0387eAc4e11620EE91b1b15A6A09fE': 'ETH',
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': 'FTM',
}

const TOKEN_COLLATERAL_MORPHEX_FANTOM: Record<string, TokenCollateral> = {
  '0x2F733095B80A04b38b0D10cC884524a3d09b836a': {
    address: '0x2F733095B80A04b38b0D10cC884524a3d09b836a',
    symbol: 'USDC.e',
    decimals: 6,
    isStableCoin: true,
  },
  '0xf1648C50d2863f780c57849D812b4B7686031A3D': {
    address: '0xf1648C50d2863f780c57849D812b4B7686031A3D',
    symbol: 'WBTC',
    decimals: 8,
  },
  '0x695921034f0387eAc4e11620EE91b1b15A6A09fE': {
    address: '0x695921034f0387eAc4e11620EE91b1b15A6A09fE',
    symbol: 'WETH',
    decimals: 8,
  },
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': {
    address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    symbol: 'WFTM',
    decimals: 18,
  },
  '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf': {
    address: '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf',
    symbol: 'USDC',
    decimals: 6,
    isStableCoin: true,
  },
  '0xcc1b99dDAc1a33c201a742A1851662E87BC7f22C': {
    address: '0xcc1b99dDAc1a33c201a742A1851662E87BC7f22C',
    symbol: 'USDT',
    decimals: 6,
    isStableCoin: true,
  },
  '0xfe7eDa5F2c56160d406869A8aA4B2F365d544C7B': {
    address: '0xfe7eDa5F2c56160d406869A8aA4B2F365d544C7B',
    symbol: 'ETH', //axlETH
    decimals: 18,
  },
  '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4': {
    address: '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4',
    symbol: 'USDC', //axlUSDC
    decimals: 6,
    isStableCoin: true,
  },
  '0xd226392C23fb3476274ED6759D4a478db3197d82': {
    address: '0xd226392C23fb3476274ED6759D4a478db3197d82',
    symbol: 'USDT', //axlUSDT
    decimals: 6,
    isStableCoin: true,
  },
  '0x448d59B4302aB5d2dadf9611bED9457491926c8e': {
    address: '0x448d59B4302aB5d2dadf9611bED9457491926c8e',
    symbol: 'BTC', //axlBTC
    decimals: 8,
  },
}

const TOKEN_TRADE_MORPHEX_FANTOM = Object.entries(MORPHEX_PAIRS).reduce<ProtocolTokenMapping>(
  (result, [key, value]) => {
    return {
      ...result,
      [key]: {
        symbol: value,
      },
    }
  },
  {}
)

export { TOKEN_TRADE_MORPHEX_FANTOM, TOKEN_COLLATERAL_MORPHEX_FANTOM }
