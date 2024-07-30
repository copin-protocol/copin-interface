import { ProtocolTokenMapping } from './trades'

const YFX_PAIRS = {
  '0x2C05422A5Ea16c9AcB104cFD874aE2eFaf4b9945': 'BTC',
  '0x9eF06FEA110F3AB5865726EcFECb21378B2ffdd0': 'ETH',
  '0x6A5f6e627C8Bc8ff88bF6C38c38DA00FBeec79A1': 'ARB',
  '0x60bb481fa62E451dD5eC33a60bAdc947C44Fe241': 'SOL',
  '0x6AEacEc464e7F563013faccEF33b2Cf7F57D59c0': 'DOGE',
}

const TOKEN_TRADE_YFX_ARB = Object.entries(YFX_PAIRS).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_YFX_ARB }
