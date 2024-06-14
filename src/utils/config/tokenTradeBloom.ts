import { ProtocolTokenMapping } from './trades'

const BLOOM_BLAST_PAIRS = {
  'BLOOM_BLAST-0': 'ETH',
  'BLOOM_BLAST-1': 'BTC',
  'BLOOM_BLAST-2': 'SOL',
  'BLOOM_BLAST-3': 'BLUR',
  'BLOOM_BLAST-4': 'ARB',
  'BLOOM_BLAST-5': 'OP',
  'BLOOM_BLAST-6': 'DOGE',
}
export const TOKEN_TRADE_BLOOM_BLAST = Object.entries(BLOOM_BLAST_PAIRS).reduce<ProtocolTokenMapping>(
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
