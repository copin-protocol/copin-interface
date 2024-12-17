import { ReactNode } from 'react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import { FULL_TITLE_MAPPING } from 'pages/PerpDEXsExplorer/constants/title'
import { renderTableTitleWithTooltip } from 'pages/PerpDEXsExplorer/helpers/renderHelper'

export const REMARKABLE_METRIC_FIELD: (keyof PerpDEXSourceResponse)[] = [
  'volume1d',
  'volume',
  'traders30d',
  'oi',
  'longRatio',
  'revenue30d',
  'feePerMillion30d',
  'averageFeeRate30d',
]

export const GENERAL_INFO_FIELD: (keyof PerpDEXSourceResponse)[][] = [
  ['type', 'marginModes', 'positionModes'],
  [
    'minTradingFee', // combine field
    'makerFee', // combine field
    'borrowFee',
    'hasFundingFee',
  ],
  ['oneClickTrading', 'collateralAssets', 'pairs', 'minCollateral', 'minLeverage'],
  ['token', 'invested', 'audit', 'runTime'],
  ['minReferralCommission', 'rewards'],
]

export const METRIC_FIELD: { title: ReactNode; fields: (keyof PerpDEXSourceResponse)[] }[] = [
  {
    title: renderTableTitleWithTooltip({ valueKey: 'volume', title: 'Volume' }),
    fields: ['volume1d', 'volume7d', 'volume30d', 'volume'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'volumeShare', title: 'Volume Share' }),
    fields: ['volumeShare1d', 'volumeShare7d', 'volumeShare30d', 'volumeShare'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'traders', title: 'Traders' }),
    fields: ['traders1d', 'traders7d', 'traders30d', 'traders'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'traderPnl', title: 'Trader PnL' }),
    fields: ['traderPnl1d', 'traderPnl7d', 'traderPnl30d', 'traderPnl'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'oi', title: 'Open Interest' }),
    fields: ['oi1d', 'oi7d', 'oi30d', 'oi'],
  },
  {
    title: renderTableTitleWithTooltip({
      valueKey: 'openInterestShare',
      title: 'Open Interest Share',
    }),
    fields: ['openInterestShare1d', 'openInterestShare7d', 'openInterestShare30d', 'openInterestShare'],
  },
  {
    title: renderTableTitleWithTooltip({
      valueKey: 'openInterestToVolumeRatio',
      title: 'Open Interest to Volume Ratio',
    }),
    fields: [
      'openInterestToVolumeRatio1d',
      'openInterestToVolumeRatio7d',
      'openInterestToVolumeRatio30d',
      'openInterestToVolumeRatio',
    ],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'longPnl', title: 'Long PnL' }),
    fields: ['longPnl1d', 'longPnl7d', 'longPnl30d', 'longPnl'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'shortPnl', title: 'Short PnL' }),
    fields: ['shortPnl1d', 'shortPnl7d', 'shortPnl30d', 'shortPnl'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'longLiquidations', title: 'Long LIQ' }),
    fields: ['longLiquidations1d', 'longLiquidations7d', 'longLiquidations30d', 'longLiquidations'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'shortLiquidations', title: 'Short LIQ' }),
    fields: ['shortLiquidations1d', 'shortLiquidations7d', 'shortLiquidations30d', 'shortLiquidations'],
  },
  {
    title: renderTableTitleWithTooltip({
      valueKey: 'avgPositionDuration',
      title: 'Average Position Duration',
    }),
    fields: ['avgPositionDuration1d', 'avgPositionDuration7d', 'avgPositionDuration30d', 'avgPositionDuration'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'avgPositionSize', title: 'Average Position Size' }),
    fields: ['avgPositionSize1d', 'avgPositionSize7d', 'avgPositionSize30d', 'avgPositionSize'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'longRatio', title: 'L/S Ratio' }),
    fields: ['longRatio1d', 'longRatio7d', 'longRatio30d', 'longRatio'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'revenue', title: 'Revenue' }),
    fields: ['revenue1d', 'revenue7d', 'revenue30d', 'revenue'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'liquidations', title: 'Liquidations' }),
    fields: ['liquidations1d', 'liquidations7d', 'liquidations30d', 'liquidations'],
  },
  {
    title: renderTableTitleWithTooltip({ valueKey: 'feePerMillion', title: 'Fee Per Million' }),
    fields: ['feePerMillion1d', 'feePerMillion7d', 'feePerMillion30d', 'feePerMillion'],
  },

  {
    title: renderTableTitleWithTooltip({ valueKey: 'averageFeeRate', title: 'Average Fee Rate' }),
    fields: ['averageFeeRate1d', 'averageFeeRate7d', 'averageFeeRate30d', 'averageFeeRate'],
  },
]
