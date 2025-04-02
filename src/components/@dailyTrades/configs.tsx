import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import { OrderData, PositionData } from 'entities/trader'

export type RangeValuesType = {
  gte?: number
  lte?: number
}
export enum DirectionFilterEnum {
  LONG = '1',
  SHORT = '0',
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

export const POSITION_RANGE_CONFIG_MAPPING: { [key in keyof PositionRangeFields]: TableFilterConfig } = {
  size: { label: 'Size', unit: '$', type: 'number', urlParamKey: 'size' },
  leverage: { label: 'Leverage', unit: '✕', type: 'number', urlParamKey: 'leverage' },
  collateral: { label: 'Collateral', unit: '$', type: 'number', urlParamKey: 'collateral' },
  durationInSecond: { label: 'Duration', unit: 'min', type: 'number', urlParamKey: 'duration' },
  realisedPnl: { label: 'PnL', unit: '$', type: 'number', urlParamKey: 'pnl' },
  realisedRoi: { label: 'ROI', unit: '%', type: 'number', urlParamKey: 'roi' },
}

export type OrderRangeFields = Pick<OrderData, 'leverage' | 'sizeDeltaNumber' | 'collateralDeltaNumber'>

export const ORDER_RANGE_KEYS: { [key in keyof OrderRangeFields]: keyof OrderRangeFields } = {
  leverage: 'leverage',
  sizeDeltaNumber: 'sizeDeltaNumber',
  collateralDeltaNumber: 'collateralDeltaNumber',
}

export const ORDER_RANGE_CONFIG_MAPPING: { [key in keyof OrderRangeFields]: TableFilterConfig } = {
  leverage: { label: 'Leverage', unit: '✕', type: 'number', urlParamKey: 'leverage' },
  sizeDeltaNumber: { label: 'Size', unit: '$', type: 'number', urlParamKey: 'size' },
  collateralDeltaNumber: { label: 'Collateral', unit: '$', type: 'number', urlParamKey: 'collateral' },
}
