import { ProtocolTokenMapping } from './trades'

const BSX_BASE_PAIRS = {
  'BSX_BASE-1': 'BTC',
  'BSX_BASE-2': 'ETH',
  'BSX_BASE-3': 'SOL',
  'BSX_BASE-4': 'WIF',
  'BSX_BASE-5': '1000PEPE', //kPEPE - x1000
  'BSX_BASE-6': 'BRETT',
  'BSX_BASE-7': 'TON',
  'BSX_BASE-8': 'SEI',
  'BSX_BASE-9': 'MIGGLES',
  'BSX_BASE-10': 'AERO',
  'BSX_BASE-11': 'EIGEN',
  'BSX_BASE-12': 'SCR',
  'BSX_BASE-13': 'DOGE',
}
export const TOKEN_TRADE_BSX_BASE = Object.entries(BSX_BASE_PAIRS).reduce<ProtocolTokenMapping>(
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
