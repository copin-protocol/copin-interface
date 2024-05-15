import { PYTH_IDS_MAPPING } from './pythIds'

const BLOOM_BLAST_PAIRS = {
  'BLOOM_BLAST-0': 'ETH',
  'BLOOM_BLAST-1': 'BTC',
  'BLOOM_BLAST-2': 'SOL',
  'BLOOM_BLAST-3': 'BLUR',
  'BLOOM_BLAST-4': 'ARB',
  'BLOOM_BLAST-5': 'OP',
  'BLOOM_BLAST-6': 'DOGE',
}

type TokenValues = Record<
  string,
  {
    address: string
    name: string
    symbol: string
    decimals: number
    priceFeedId: string
  }
>

export const TOKEN_TRADE_BLOOM_BLAST = Object.entries(BLOOM_BLAST_PAIRS).reduce((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      address: key,
      name: value,
      symbol: value,
      decimals: 18,
      priceFeedId: PYTH_IDS_MAPPING[value as keyof typeof PYTH_IDS_MAPPING] ?? '',
    },
  }
}, {} as TokenValues)
