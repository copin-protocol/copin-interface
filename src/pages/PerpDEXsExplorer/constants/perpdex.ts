import { MarginModeEnum, PerpDEXTypeEnum, PositionModeEnum } from 'utils/config/enums'

export const PERP_DEX_TYPE_MAPPING = {
  [PerpDEXTypeEnum.ORDERBOOK]: {
    label: 'Orderbook',
    color: 'orange2',
    value: PerpDEXTypeEnum.ORDERBOOK,
  },
  [PerpDEXTypeEnum.INDEX]: {
    label: 'Index',
    color: '#CFDDFC',
    value: PerpDEXTypeEnum.INDEX,
  },
}

export const MARGIN_MODE_MAPPING = {
  [MarginModeEnum.ISOLATED]: {
    label: 'Isolated',
    color: '#B3F084',
    value: MarginModeEnum.ISOLATED,
  },
  [MarginModeEnum.CROSS]: {
    label: 'Cross',
    color: '#C286F0',
    value: MarginModeEnum.CROSS,
  },
}

export const POSITION_MODE_MAPPING = {
  [PositionModeEnum.ONE_WAY]: {
    label: 'One-way',
    color: '#7AA6FF',
    value: PositionModeEnum.ONE_WAY,
  },
  [PositionModeEnum.HEDGE]: {
    label: 'Hedge',
    color: 'orange1',
    value: PositionModeEnum.HEDGE,
  },
}

export const COLLATERAL_ASSETS: string[] = ['USDC', 'USDT', 'ETH', 'BTC', 'DAI', 'USDB', 'SUSD']
