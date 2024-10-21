import { OrderData, PositionData } from 'entities/trader'

export type RangeValuesType = {
  gte?: number
  lte?: number
}

export type PositionRangeFields = Pick<
  PositionData,
  'size' | 'leverage' | 'collateral' | 'durationInSecond' | 'realisedPnl' | 'realisedRoi'
>
export const POSITION_RANGE_KEYS: { [key in keyof PositionRangeFields]: keyof PositionRangeFields } = {
  size: 'size',
  leverage: 'leverage',
  collateral: 'collateral',
  durationInSecond: 'durationInSecond',
  realisedPnl: 'realisedPnl',
  realisedRoi: 'realisedRoi',
}

export const POSITION_RANGE_CONFIG_MAPPING: { [key in keyof PositionRangeFields]: { title: string; unit: string } } = {
  size: { title: 'Size', unit: '$' },
  leverage: { title: 'Leverage', unit: 'x' },
  collateral: { title: 'Collateral', unit: '$' },
  durationInSecond: { title: 'Duration', unit: 'min' },
  realisedPnl: { title: 'PnL', unit: '$' },
  realisedRoi: { title: 'ROI', unit: '%' },
}

export type OrderRangeFields = Pick<OrderData, 'leverage' | 'sizeDeltaNumber'>

export const ORDER_RANGE_KEYS: { [key in keyof OrderRangeFields]: keyof OrderRangeFields } = {
  leverage: 'leverage',
  sizeDeltaNumber: 'sizeDeltaNumber',
}

export const ORDER_RANGE_CONFIG_MAPPING: { [key in keyof OrderRangeFields]: { title: string; unit: string } } = {
  leverage: { title: 'Leverage', unit: 'x' },
  sizeDeltaNumber: { title: 'Size', unit: '$' },
}
