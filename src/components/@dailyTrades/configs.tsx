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
  | 'size'
  | 'leverage'
  | 'collateral'
  | 'durationInSecond'
  | 'realisedPnl'
  | 'realisedRoi'
  | 'totalSize'
  | 'totalSizeInToken'
  | 'avgPrice'
  | 'totalPnl'
  | 'totalFee'
  | 'fee'
>
export const POSITION_RANGE_KEYS: { [key in keyof PositionRangeFields]: keyof PositionRangeFields } = {
  size: 'size',
  leverage: 'leverage',
  collateral: 'collateral',
  durationInSecond: 'durationInSecond',
  realisedPnl: 'realisedPnl',
  realisedRoi: 'realisedRoi',
  totalSize: 'totalSize',
  totalSizeInToken: 'totalSizeInToken',
  avgPrice: 'avgPrice',
  totalPnl: 'totalPnl',
  totalFee: 'totalFee',
  fee: 'fee',
}

export const POSITION_RANGE_CONFIG_MAPPING: { [key in keyof PositionRangeFields]: TableFilterConfig } = {
  size: { label: 'Value', unit: '$', type: 'number', urlParamKey: 'size' },
  leverage: { label: 'Leverage', unit: '✕', type: 'number', urlParamKey: 'leverage' },
  collateral: { label: 'Collateral', unit: '$', type: 'number', urlParamKey: 'collateral' },
  durationInSecond: { label: 'Duration', unit: 'min', type: 'number', urlParamKey: 'duration' },
  realisedPnl: { label: 'PnL', unit: '$', type: 'number', urlParamKey: 'pnl' },
  realisedRoi: { label: 'ROI', unit: '%', type: 'number', urlParamKey: 'realisedRoi' },
  // realisedRoi: { label: 'ROI', unit: '%', type: 'number', urlParamKey: 'roi' },
  totalSize: { label: 'Value', unit: '$', type: 'number', urlParamKey: 'totalSize' },
  totalSizeInToken: { label: 'Size', unit: '$', type: 'number', urlParamKey: 'totalSizeInToken' },
  avgPrice: { label: 'Avg. Price', unit: '$', type: 'number', urlParamKey: 'avgPrice' },
  totalPnl: { label: 'PnL', unit: '$', type: 'number', urlParamKey: 'totalPnl' },
  totalFee: { label: 'Fee', unit: '$', type: 'number', urlParamKey: 'totalFee' },
  fee: { label: 'Fee', unit: '$', type: 'number', urlParamKey: 'fee' },
}

export type OrderRangeFields = Pick<OrderData, 'leverage' | 'sizeDeltaNumber' | 'collateralDeltaNumber'>

export const ORDER_RANGE_KEYS: { [key in keyof OrderRangeFields]: keyof OrderRangeFields } = {
  leverage: 'leverage',
  sizeDeltaNumber: 'sizeDeltaNumber',
  collateralDeltaNumber: 'collateralDeltaNumber',
}

export const ORDER_RANGE_CONFIG_MAPPING: { [key in keyof OrderRangeFields]: TableFilterConfig } = {
  leverage: { label: 'Leverage', unit: '✕', type: 'number', urlParamKey: 'leverage' },
  sizeDeltaNumber: { label: 'Value', unit: '$', type: 'number', urlParamKey: 'size' },
  collateralDeltaNumber: { label: 'Collateral', unit: '$', type: 'number', urlParamKey: 'collateral' },
}
