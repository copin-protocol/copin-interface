import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import { GroupedFillsData } from 'entities/hyperliquid'
import { OrderData, PositionData } from 'entities/trader'

export type RangeValuesType = {
  gte?: number
  lte?: number
}
export enum DirectionFilterEnum {
  LONG = '1',
  SHORT = '0',
}

export type FillRangeFields = Pick<
  GroupedFillsData,
  'totalSize' | 'totalSizeInToken' | 'avgPrice' | 'totalPnl' | 'totalFee'
>

export type PositionRangeFields = Pick<
  PositionData,
  | 'size'
  | 'leverage'
  | 'collateral'
  | 'durationInSecond'
  | 'realisedPnl'
  | 'realisedRoi'
  // | 'averagePrice'
  | 'fee'
  // | 'totalSize'
  // | 'totalFee'
>

export const FILL_RANGE_KEYS: { [key in keyof FillRangeFields]: keyof FillRangeFields } = {
  totalSize: 'totalSize',
  totalSizeInToken: 'totalSizeInToken',
  avgPrice: 'avgPrice',
  totalPnl: 'totalPnl',
  totalFee: 'totalFee',
}

export const POSITION_RANGE_KEYS: { [key in keyof PositionRangeFields]: keyof PositionRangeFields } = {
  size: 'size',
  leverage: 'leverage',
  collateral: 'collateral',
  durationInSecond: 'durationInSecond',
  realisedPnl: 'realisedPnl',
  realisedRoi: 'realisedRoi',
  // averagePrice: 'averagePrice',
  fee: 'fee',
}

export const FILL_RANGE_CONFIG_MAPPING: { [key in keyof FillRangeFields]: TableFilterConfig } = {
  totalSize: { label: 'Value', unit: '$', type: 'number', urlParamKey: 'totalSize' },
  totalSizeInToken: { label: 'Size', unit: '$', type: 'number', urlParamKey: 'totalSizeInToken' },
  avgPrice: { label: 'Avg. Price', unit: '$', type: 'number', urlParamKey: 'avgPrice' },
  totalPnl: { label: 'PnL', unit: '$', type: 'number', urlParamKey: 'totalPnl' },
  totalFee: { label: 'Fee', unit: '$', type: 'number', urlParamKey: 'totalFee' },
}

export const POSITION_RANGE_CONFIG_MAPPING: { [key in keyof PositionRangeFields]: TableFilterConfig } = {
  size: { label: 'Value', unit: '$', type: 'number', urlParamKey: 'size' },
  leverage: { label: 'Leverage', unit: '✕', type: 'number', urlParamKey: 'leverage' },
  collateral: { label: 'Collateral', unit: '$', type: 'number', urlParamKey: 'collateral' },
  durationInSecond: { label: 'Duration', unit: 'min', type: 'number', urlParamKey: 'duration' },
  realisedPnl: { label: 'PnL', unit: '$', type: 'number', urlParamKey: 'pnl' },
  realisedRoi: { label: 'ROI', unit: '%', type: 'number', urlParamKey: 'realisedRoi' },
  // realisedRoi: { label: 'ROI', unit: '%', type: 'number', urlParamKey: 'roi' },
  // averagePrice: { label: 'Avg. Price', unit: '$', type: 'number', urlParamKey: 'avgPrice' },
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
