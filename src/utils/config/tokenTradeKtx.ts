import { PYTH_IDS_MAPPING } from './pythIds'

export const KTX_MANTLE_TOKEN = {
  '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2': 'BTC',
  '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111': 'ETH',
  '0xcDA86A272531e8640cD7F1a92c01839911B90bb0': 'ETH',
  '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8': 'MNT',
  '0x58538e6A46E07434d7E7375Bc268D3cb839C0133': 'ENA',
}

export const KTX_MANTLE_COLLATERAL = {
  '0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2': 'BTC',
  '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111': 'ETH',
  '0xcDA86A272531e8640cD7F1a92c01839911B90bb0': 'ETH',
  '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8': 'MNT',
  '0x58538e6A46E07434d7E7375Bc268D3cb839C0133': 'ENA',
  '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE': 'USDT',
  '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34': 'USDE',
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

const TOKEN_TRADE_KTX_MANTLE = Object.entries(KTX_MANTLE_TOKEN).reduce((result, [key, value]) => {
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

const TOKEN_COLLATERAL_KTX_MANTLE = Object.entries(KTX_MANTLE_COLLATERAL).reduce((result, [key, value]) => {
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

export { TOKEN_TRADE_KTX_MANTLE, TOKEN_COLLATERAL_KTX_MANTLE }
