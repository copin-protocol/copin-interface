import { ProtocolTokenMapping } from './trades'

export const KTX_MANTLE_TOKEN = {
  '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2': 'BTC',
  '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111': 'ETH',
  '0xcDA86A272531e8640cD7F1a92c01839911B90bb0': 'ETH',
  '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8': 'MNT',
  '0x58538e6A46E07434d7E7375Bc268D3cb839C0133': 'ENA',
}

// export const KTX_MANTLE_COLLATERAL = {
//   '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2': 'BTC',
//   '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111': 'ETH',
//   '0xcDA86A272531e8640cD7F1a92c01839911B90bb0': 'ETH',
//   '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8': 'MNT',
//   '0x58538e6A46E07434d7E7375Bc268D3cb839C0133': 'ENA',
//   '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE': 'USDT',
//   '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34': 'USDE',
// }

const TOKEN_TRADE_KTX_MANTLE = Object.entries(KTX_MANTLE_TOKEN).reduce<ProtocolTokenMapping>((result, [key, value]) => {
  return {
    ...result,
    [key]: {
      symbol: value,
    },
  }
}, {})

export { TOKEN_TRADE_KTX_MANTLE }
