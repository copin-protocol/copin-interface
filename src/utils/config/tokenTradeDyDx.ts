import { ProtocolTokenMapping } from './trades'

const DYDX_PAIRS = {
  'DYDX-BTC-USD': 'BTC',
  'DYDX-ETH-USD': 'ETH',
  'DYDX-LINK-USD': 'LINK',
  'DYDX-MATIC-USD': 'MATIC',
  'DYDX-CRV-USD': 'CRV',
  'DYDX-SOL-USD': 'SOL',
  'DYDX-ADA-USD': 'ADA',
  'DYDX-AVAX-USD': 'AVAX',
  'DYDX-FIL-USD': 'FIL',
  'DYDX-LTC-USD': 'LTC',
  'DYDX-DOGE-USD': 'DOGE',
  'DYDX-ATOM-USD': 'ATOM',
  'DYDX-DOT-USD': 'DOT',
  'DYDX-UNI-USD': 'UNI',
  'DYDX-BCH-USD': 'BCH',
  'DYDX-TRX-USD': 'TRX',
  'DYDX-NEAR-USD': 'NEAR',
  'DYDX-MKR-USD': 'MKR',
  'DYDX-XLM-USD': 'XLM',
  'DYDX-ETC-USD': 'ETC',
  'DYDX-COMP-USD': 'COMP',
  'DYDX-WLD-USD': 'WLD',
  'DYDX-APE-USD': 'APE',
  'DYDX-APT-USD': 'APT',
  'DYDX-ARB-USD': 'ARB',
  'DYDX-BLUR-USD': 'BLUR',
  'DYDX-LDO-USD': 'LDO',
  'DYDX-OP-USD': 'OP',
  'DYDX-PEPE-USD': 'PEPE',
  'DYDX-SEI-USD': 'SEI',
  'DYDX-SHIB-USD': 'SHIB',
  'DYDX-SUI-USD': 'SUI',
  'DYDX-XRP-USD': 'XRP',
  'DYDX-TIA-USD': 'TIA',
  'DYDX-JUP-USD': 'JUP',
  'DYDX-AAVE-USD': 'AAVE',
  'DYDX-BNB-USD': 'BNB',
  'DYDX-JTO-USD': 'JTO',
  'DYDX-ORDI-USD': 'ORDI',
  'DYDX-EOS-USD': 'EOS',
  'DYDX-ICP-USD': 'ICP',
  'DYDX-DYM-USD': 'DYM',
  'DYDX-STRK-USD': 'STRK',
  'DYDX-FET-USD': 'FET',
  'DYDX-WOO-USD': 'WOO',
  'DYDX-PYTH-USD': 'PYTH',
  'DYDX-BONK-USD': 'BONK',
  'DYDX-AGIX-USD': 'AGIX',
  'DYDX-RENDER-USD': 'RENDER',
  'DYDX-STX-USD': 'STX',
  'DYDX-INJ-USD': 'INJ',
  'DYDX-IMX-USD': 'IMX',
  'DYDX-HBAR-USD': 'HBAR',
  'DYDX-ALGO-USD': 'ALGO',
  'DYDX-GRT-USD': 'GRT',
  'DYDX-MANA-USD': 'MANA',
  'DYDX-RUNE-USD': 'RUNE',
  'DYDX-AXL-USD': 'AXL',
  'DYDX-AEVO-USD': 'AEVO',
  'DYDX-ASTR-USD': 'ASTR',
  'DYDX-SNX-USD': 'SNX',
  'DYDX-ARKM-USD': 'ARKM',
  'DYDX-DYDX-USD': 'DYDX',
  'DYDX-CHZ-USD': 'CHZ',
  'DYDX-WIF-USD': 'WIF',
  'DYDX-ETHFI-USD': 'ETHFI',
  'DYDX-TON-USD': 'TON',
  'DYDX-W-USD': 'W',
  'DYDX-MOTHER-USD': 'MOTHER',
  'DYDX-MOG-USD': 'MOG',
  'DYDX-TREMP-USD': 'TREMP',
  'DYDX-BODEN-USD': 'BODEN',
  'DYDX-ZRO-USD': 'ZRO',
  'DYDX-ZK-USD': 'ZK',
  'DYDX-TLOS-USD': 'TLOS',
  'DYDX-ONDO-USD': 'ONDO',
  'DYDX-ENA-USD': 'ENA',
  'DYDX-IO-USD': 'IO',
  'DYDX-AR-USD': 'AR',
  'DYDX-KAS-USD': 'KAS',
  'DYDX-NOT-USD': 'NOT',
  'DYDX-ENS-USD': 'ENS',
  'DYDX-FLOKI-USD': 'FLOKI',
  'DYDX-TAO-USD': 'TAO',
  'DYDX-FTM-USD': 'FTM',
  'DYDX-SAFE-USD': 'SAFE',
  'DYDX-TAIKO-USD': 'TAIKO',
  'DYDX-AKT-USD': 'AKT',
  'DYDX-CAKE-USD': 'CAKE',
  'DYDX-BRETT-USD': 'BRETT',
  'DYDX-SATS-USD': 'SATS',
  'DYDX-BLAST-USD': 'BLAST',
  'DYDX-XMR-USD': 'XMR',
  'DYDX-THETA-USD': 'THETA',
  'DYDX-ENJ-USD': 'ENJ',
  'DYDX-1INCH-USD': '1INCH',
  'DYDX-XTZ-USD': 'XTZ',
  'DYDX-UMA-USD': 'UMA',
  'DYDX-CVX-USD': 'CVX',
  'DYDX-SUSHI-USD': 'SUSHI',
  'DYDX-ZRX-USD': 'ZRX',
  'DYDX-PENDLE-USD': 'PENDLE',
  'DYDX-DEGEN-USD': 'DEGEN',
  'DYDX-MNT-USD': 'MNT',
  'DYDX-JASMY-USD': 'JASMY',
  'DYDX-CORE-USD': 'CORE',
  'DYDX-PEOPLE-USD': 'PEOPLE',
  'DYDX-GMX-USD': 'GMX',
  'DYDX-POPCAT-USD': 'POPCAT',
  'DYDX-PRIME-USD': 'PRIME',
  'DYDX-GALA-USD': 'GALA',
  'DYDX-AXS-USD': 'AXS',
  'DYDX-XAI-USD': 'XAI',
  'DYDX-MEW-USD': 'MEW',
  'DYDX-BEAM-USD': 'BEAM',
  'DYDX-NEO-USD': 'NEO',
  'DYDX-EGLD-USD': 'EGLD',
  'DYDX-ALT-USD': 'ALT',
  'DYDX-PIXEL-USD': 'PIXEL',
  'DYDX-TURBO-USD': 'TURBO',
  'DYDX-BOME-USD': 'BOME',
  'DYDX-TRB-USD': 'TRB',
  'DYDX-ZEN-USD': 'ZEN',
  'DYDX-BICO-USD': 'BICO',
  'DYDX-OM-USD': 'OM',
  'DYDX-DMAIL-USD': 'DMAIL',
  'DYDX-MAVIA-USD': 'MAVIA',
  'DYDX-ZERO-USD': 'ZERO',
  'DYDX-VRTX-USD': 'VRTX',
  'DYDX-MICHI-USD': 'MICHI',
  'DYDX-AURORA-USD': 'AURORA',
  'DYDX-FOXY-USD': 'FOXY',
  'DYDX-PAXG-USD': 'PAXG',
  'DYDX-GME-USD': 'GME',
  'DYDX-DRIFT-USD': 'DRIFT',
  'DYDX-EURC-USD': 'EURC',
}

const TOKEN_TRADE_DYDX = Object.entries(DYDX_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_DYDX }
