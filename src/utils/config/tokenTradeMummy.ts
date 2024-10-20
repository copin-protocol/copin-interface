import { TokenCollateral } from 'utils/types'

import { ProtocolTokenMapping } from './trades'

const MUMMY_PAIRS = {
  //V1
  '0xf1648C50d2863f780c57849D812b4B7686031A3D': 'BTC',
  '0x695921034f0387eAc4e11620EE91b1b15A6A09fE': 'ETH',
  '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': 'FTM',
  //V2
  'MUMMY_FANTOM-1': 'BTC',
  'MUMMY_FANTOM-2': 'ETH',
  'MUMMY_FANTOM-3': 'LINK',
  'MUMMY_FANTOM-4': 'FTM',
  'MUMMY_FANTOM-5': 'XRP',
  'MUMMY_FANTOM-6': 'BNB',
  'MUMMY_FANTOM-7': 'OP',
  'MUMMY_FANTOM-8': 'SOL',
  'MUMMY_FANTOM-9': 'ARB',
  'MUMMY_FANTOM-10': 'ORDI',
  'MUMMY_FANTOM-11': 'FET',
  'MUMMY_FANTOM-12': 'SUI',
  'MUMMY_FANTOM-13': 'PEPE',
  'MUMMY_FANTOM-14': 'TON',
  'MUMMY_FANTOM-15': 'NOT',
}

const TOKEN_COLLATERAL_MUMMY_FANTOM: Record<string, TokenCollateral> = {
  '0x695921034f0387eAc4e11620EE91b1b15A6A09fE': {
    address: '0x695921034f0387eAc4e11620EE91b1b15A6A09fE',
    symbol: 'WETH',
    decimals: 18,
  },
  '0xf1648C50d2863f780c57849D812b4B7686031A3D': {
    address: '0xf1648C50d2863f780c57849D812b4B7686031A3D',
    symbol: 'WBTC',
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
}

const TOKEN_TRADE_MUMMY_FANTOM = Object.entries(MUMMY_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_MUMMY_FANTOM, TOKEN_COLLATERAL_MUMMY_FANTOM }
