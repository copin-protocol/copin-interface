import { ArrowSquareOut } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import MarketGroup from 'components/@ui/MarketGroup'
import IconGroup from 'components/@widgets/IconGroup'
import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import PerpDEXTitle from 'pages/PerpDEXsExplorer/components/PerpDEXTitle'
import TableFilterIcon from 'pages/PerpDEXsExplorer/components/TableFilterIcon'
import { COLLATERAL_ASSETS } from 'pages/PerpDEXsExplorer/constants/perpdex'
import { TITLE_MAPPING } from 'pages/PerpDEXsExplorer/constants/title'
import {
  getLSRatioColumnConfig,
  getNormalValueColumnConfig,
  getSignValueColumnConfig,
  getValueChangeColumnConfig,
} from 'pages/PerpDEXsExplorer/helpers/getValueColumnConfig'
import {
  renderAudit,
  renderChangeValue,
  renderLSRatio,
  renderMarginModeItems,
  renderNormalValue,
  renderPerpDexTypeItems,
  renderPositionModeItems,
  renderSignValue,
  renderTableText,
  renderTableTitleWithTooltip,
} from 'pages/PerpDEXsExplorer/helpers/renderHelper'
import { ExternalResource } from 'pages/PerpDEXsExplorer/types'
import { getColumnSearchText } from 'pages/PerpDEXsExplorer/utils'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Image, Type } from 'theme/base'
import { MarginModeEnum, PerpDEXTypeEnum, PositionModeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { parseCollateralColorImage } from 'utils/helpers/transform'

export const TABLE_RANGE_FILTER_CONFIGS: Partial<Record<keyof PerpDEXSourceResponse, TableFilterConfig>> = {
  // traders
  traders1d: { type: 'number', urlParamKey: 'traders1d', label: TITLE_MAPPING['traders1d'] },
  traders7d: { type: 'number', urlParamKey: 'traders7d', label: TITLE_MAPPING['traders7d'] },
  traders30d: { type: 'number', urlParamKey: 'traders30d', label: TITLE_MAPPING['traders30d'] },
  traders: { type: 'number', urlParamKey: 'traders', label: TITLE_MAPPING['traders'] },
  // trader pnl
  traderPnl1d: { type: 'number', urlParamKey: 'traderPnl1d', unit: '$', label: TITLE_MAPPING['traderPnl1d'] },
  traderPnl7d: { type: 'number', urlParamKey: 'traderPnl7d', unit: '$', label: TITLE_MAPPING['traderPnl7d'] },
  traderPnl30d: { type: 'number', urlParamKey: 'traderPnl30d', unit: '$', label: TITLE_MAPPING['traderPnl30d'] },
  traderPnl: { type: 'number', urlParamKey: 'traderPnl', unit: '$', label: TITLE_MAPPING['traderPnl'] },
  // OI
  oi: { type: 'number', urlParamKey: 'oi', label: TITLE_MAPPING['oi'], unit: '$' },
  oi1d: { type: 'number', urlParamKey: 'oi1d', label: TITLE_MAPPING['oi1d'], unit: '$' },
  oi7d: { type: 'number', urlParamKey: 'oi7d', label: TITLE_MAPPING['oi7d'], unit: '$' },
  oi30d: { type: 'number', urlParamKey: 'oi30d', label: TITLE_MAPPING['oi30d'], unit: '$' },
  // long pnl
  longPnl: { type: 'number', urlParamKey: 'longPnl', label: TITLE_MAPPING['longPnl'], unit: '$' },
  longPnl1d: { type: 'number', urlParamKey: 'longPnl1d', label: TITLE_MAPPING['longPnl1d'], unit: '$' },
  longPnl7d: { type: 'number', urlParamKey: 'longPnl7d', label: TITLE_MAPPING['longPnl7d'], unit: '$' },
  longPnl30d: { type: 'number', urlParamKey: 'longPnl30d', label: TITLE_MAPPING['longPnl30d'], unit: '$' },
  // Short pnl
  shortPnl: { type: 'number', urlParamKey: 'shortPnl', label: TITLE_MAPPING['shortPnl'], unit: '$' },
  shortPnl1d: { type: 'number', urlParamKey: 'shortPnl1d', label: TITLE_MAPPING['shortPnl1d'], unit: '$' },
  shortPnl7d: { type: 'number', urlParamKey: 'shortPnl7d', label: TITLE_MAPPING['shortPnl7d'], unit: '$' },
  shortPnl30d: { type: 'number', urlParamKey: 'shortPnl30d', label: TITLE_MAPPING['shortPnl30d'], unit: '$' },
  // long liquid
  longLiquidations: {
    type: 'number',
    urlParamKey: 'longLiquidations',
    label: TITLE_MAPPING['longLiquidations'],
    unit: '$',
  },
  longLiquidations1d: {
    type: 'number',
    urlParamKey: 'longLiquidations1d',
    label: TITLE_MAPPING['longLiquidations1d'],
    unit: '$',
  },
  longLiquidations7d: {
    type: 'number',
    urlParamKey: 'longLiquidations7d',
    label: TITLE_MAPPING['longLiquidations7d'],
    unit: '$',
  },
  longLiquidations30d: {
    type: 'number',
    urlParamKey: 'longLiquidations30d',
    label: TITLE_MAPPING['longLiquidations30d'],
    unit: '$',
  },
  // Short liquid
  shortLiquidations: {
    type: 'number',
    urlParamKey: 'shortLiquidations',
    label: TITLE_MAPPING['shortLiquidations'],
    unit: '$',
  },
  shortLiquidations1d: {
    type: 'number',
    urlParamKey: 'shortLiquidations1d',
    label: TITLE_MAPPING['shortLiquidations1d'],
    unit: '$',
  },
  shortLiquidations7d: {
    type: 'number',
    urlParamKey: 'shortLiquidations7d',
    label: TITLE_MAPPING['shortLiquidations7d'],
    unit: '$',
  },
  shortLiquidations30d: {
    type: 'number',
    urlParamKey: 'shortLiquidations30d',
    label: TITLE_MAPPING['shortLiquidations30d'],
    unit: '$',
  },
  // Avg position Duration
  avgPositionDuration: {
    type: 'duration',
    urlParamKey: 'avgPositionDuration',
    label: TITLE_MAPPING['avgPositionDuration'],
    unit: 'h',
  },
  avgPositionDuration1d: {
    type: 'duration',
    urlParamKey: 'avgPositionDuration1d',
    label: TITLE_MAPPING['avgPositionDuration1d'],
    unit: 'h',
  },
  avgPositionDuration7d: {
    type: 'duration',
    urlParamKey: 'avgPositionDuration7d',
    label: TITLE_MAPPING['avgPositionDuration7d'],
    unit: 'h',
  },
  avgPositionDuration30d: {
    type: 'duration',
    urlParamKey: 'avgPositionDuration30d',
    label: TITLE_MAPPING['avgPositionDuration30d'],
    unit: 'h',
  },
  // Avg position Size
  avgPositionSize: {
    type: 'number',
    urlParamKey: 'avgPositionSize',
    label: TITLE_MAPPING['avgPositionSize'],
    unit: '$',
  },
  avgPositionSize1d: {
    type: 'number',
    urlParamKey: 'avgPositionSize1d',
    label: TITLE_MAPPING['avgPositionSize1d'],
    unit: '$',
  },
  avgPositionSize7d: {
    type: 'number',
    urlParamKey: 'avgPositionSize7d',
    label: TITLE_MAPPING['avgPositionSize7d'],
    unit: '$',
  },
  avgPositionSize30d: {
    type: 'number',
    urlParamKey: 'avgPositionSize30d',
    label: TITLE_MAPPING['avgPositionSize30d'],
    unit: '$',
  },
  // Revenue
  revenue: { type: 'number', urlParamKey: 'revenue', label: TITLE_MAPPING['revenue'], unit: '$' },
  revenue1d: { type: 'number', urlParamKey: 'revenue1d', label: TITLE_MAPPING['revenue1d'], unit: '$' },
  revenue7d: { type: 'number', urlParamKey: 'revenue7d', label: TITLE_MAPPING['revenue7d'], unit: '$' },
  revenue30d: { type: 'number', urlParamKey: 'revenue30d', label: TITLE_MAPPING['revenue30d'], unit: '$' },
  // Liquidations
  liquidations: { type: 'number', urlParamKey: 'liquidations', label: TITLE_MAPPING['liquidations'], unit: '$' },
  liquidations1d: { type: 'number', urlParamKey: 'liquidations1d', label: TITLE_MAPPING['liquidations1d'], unit: '$' },
  liquidations7d: { type: 'number', urlParamKey: 'liquidations7d', label: TITLE_MAPPING['liquidations7d'], unit: '$' },
  liquidations30d: {
    type: 'number',
    urlParamKey: 'liquidations30d',
    label: TITLE_MAPPING['liquidations30d'],
    unit: '$',
  },
  // hasFundingFee
  hasFundingFee: {
    type: 'select',
    urlParamKey: 'hasFundingFee',
    options: [
      { label: 'All', value: undefined },
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    label: TITLE_MAPPING['hasFundingFee'],
  },
  // oneClickTrading
  oneClickTrading: {
    type: 'select',
    urlParamKey: 'oneClickTrading',
    options: [
      { label: 'All', value: undefined },
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    label: TITLE_MAPPING['oneClickTrading'],
  },
  // type
  type: {
    type: 'select',
    urlParamKey: 'type',
    options: [
      { label: 'All type', value: undefined },
      { label: 'Orderbook', value: PerpDEXTypeEnum.ORDERBOOK },
      { label: 'Index', value: PerpDEXTypeEnum.INDEX },
    ],
    label: TITLE_MAPPING['type'],
  },
  // margin mode'
  marginModes: {
    type: 'select',
    urlParamKey: 'marginModes',
    options: [
      { label: 'All', value: undefined },
      { label: 'Isolated', value: MarginModeEnum.ISOLATED },
      { label: 'Cross', value: MarginModeEnum.CROSS },
    ],
    label: TITLE_MAPPING['marginModes'],
  },
  // position mode
  positionModes: {
    type: 'select',
    urlParamKey: 'positionModes',
    options: [
      { label: 'All', value: undefined },
      { label: 'Hedge', value: PositionModeEnum.HEDGE },
      { label: 'One-way', value: PositionModeEnum.ONE_WAY },
    ],
    label: TITLE_MAPPING['positionModes'],
  },
  // runtime
  // collateral assets
  collateralAssets: {
    type: 'multiSelect',
    urlParamKey: 'collateralAssets',
    multiSelectOptions: COLLATERAL_ASSETS.map((collataralSymbol) => {
      return {
        label: (
          <Image width={16} height={16} sx={{ flexShrink: 0 }} src={parseCollateralColorImage(collataralSymbol)} />
        ),
        value: collataralSymbol,
      }
    }),
    label: TITLE_MAPPING['collateralAssets'],
  },
  // pairs
  pairs: { type: 'pairs', label: TITLE_MAPPING['pairs'] },

  // ref commission / sort ref commission
  minReferralCommission: {
    type: 'number',
    listParamKey: ['minReferralCommission', 'maxReferralCommission'],
    listLabel: [TITLE_MAPPING['minReferralCommission'], TITLE_MAPPING['maxReferralCommission']],
    listUnit: ['%', '%'],
  },

  minLeverage: {
    type: 'number',
    urlParamKey: 'minLeverage',
    label: 'Leverage',
    unit: '✕',
  },

  // trading fees
  minTradingFee: {
    type: 'number',
    listParamKey: ['minTradingFee', 'maxTradingFee'],
    listLabel: [TITLE_MAPPING['minTradingFee'], TITLE_MAPPING['maxTradingFee']],
    listUnit: ['%', '%'],
  },

  // Min collateral
  minCollateral: { type: 'number', urlParamKey: 'minCollateral', label: TITLE_MAPPING['minCollateral'], unit: '$' },
  // Invested
  invested: { type: 'number', urlParamKey: 'minCollateral', label: TITLE_MAPPING['invested'], unit: '$' },
  // Maker fee
  // makerFee: { type: 'number', urlParamKey: 'makerFee', label: TITLE_MAPPING['makerFee'], unit: '%' },
  // Taker fee
  // takerFee: { type: 'number', urlParamKey: 'takerFee', label: TITLE_MAPPING['takerFee'], unit: '%' },
  // borrowing fee
  borrowFee: { type: 'number', urlParamKey: 'borrowFee', label: TITLE_MAPPING['borrowFee'], unit: '%' },
}

export const columns: ColumnData<PerpDEXSourceResponse, ExternalResource>[] = [
  {
    dataIndex: undefined,
    key: undefined,
    title: 'PERP DEX',
    style: { minWidth: 240, width: 240, maxWidth: 240 },
    render(data, index, externalResource, isChildren) {
      return <PerpDEXTitle data={data} isChildren={!!isChildren} />
    },
  },
  {
    key: 'volume1d',
    title: renderTableTitleWithTooltip('volume1d'),
    text: renderTableText('volume1d'),
    searchText: getColumnSearchText('volume1d'),
    style: { minWidth: 150, width: 150, maxWidth: 150 },
    sortBy: 'volume1d',
    render(data, index, externalResource) {
      const percent = externalResource?.maxVolume1d ? ((data?.volume1d ?? 0) / externalResource.maxVolume1d) * 100 : 100
      return (
        <Box sx={{ width: '100%', height: '100%', py: '3px', position: 'relative' }}>
          <Type.Caption sx={{ width: `${percent}%`, height: '100%', bg: '#4EAEFD33' }}></Type.Caption>
          <Flex sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, px: 12, alignItems: 'center' }}>
            {renderChangeValue({
              data,
              valueKey: 'volume1d',
              valuePrefix: '$',
              changeValueSuffix: '%',
              externalResource,
            })}
          </Flex>
        </Box>
      )
    },
  },
  // // getValueChangeColumnConfig({ valueKey: 'volume1d', title: 'VOLUME (1D)', valuePrefix: '$' }),
  getValueChangeColumnConfig({ valueKey: 'volume7d', valuePrefix: '$', width: 140 }),
  getValueChangeColumnConfig({
    valueKey: 'volume30d',
    valuePrefix: '$',
    width: 140,
  }),
  getNormalValueColumnConfig({ valueKey: 'volume', valuePrefix: '$', width: 140 }),
  getNormalValueColumnConfig({
    valueKey: 'volumeShare1d',
    width: 105,
    type: 'percentage',
  }),
  getNormalValueColumnConfig({ valueKey: 'volumeShare7d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'volumeShare30d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'volumeShare', type: 'percentage', width: 105 }),
  getValueChangeColumnConfig({ valueKey: 'traders1d', width: 105 }),
  getValueChangeColumnConfig({ valueKey: 'traders7d', width: 120 }),
  getValueChangeColumnConfig({ valueKey: 'traders30d', width: 120 }),
  getNormalValueColumnConfig({
    valueKey: 'traders',
    width: 150,
    topValueHighlighting: true,
  }),
  getSignValueColumnConfig({
    valueKey: 'traderPnl1d',
    valuePrefix: '$',
    width: 170,
  }),
  getSignValueColumnConfig({
    valueKey: 'traderPnl7d',
    valuePrefix: '$',
    width: 170,
  }),
  getSignValueColumnConfig({
    valueKey: 'traderPnl30d',
    valuePrefix: '$',
    width: 170,
  }),
  getSignValueColumnConfig({ valueKey: 'traderPnl', valuePrefix: '$', width: 170 }),
  getNormalValueColumnConfig({ valueKey: 'oi1d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'oi7d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'oi30d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'oi', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestShare1d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestShare7d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestShare30d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestShare', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestToVolumeRatio1d', type: 'greaterThanZero', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestToVolumeRatio7d', type: 'greaterThanZero', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestToVolumeRatio30d', type: 'greaterThanZero', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'openInterestToVolumeRatio', type: 'greaterThanZero', width: 105 }),
  getSignValueColumnConfig({ valueKey: 'longPnl1d', valuePrefix: '$', width: 160 }),
  getSignValueColumnConfig({ valueKey: 'longPnl7d', valuePrefix: '$', width: 160 }),
  getSignValueColumnConfig({
    valueKey: 'longPnl30d',
    valuePrefix: '$',
    width: 160,
  }),
  getSignValueColumnConfig({ valueKey: 'longPnl', valuePrefix: '$', width: 160 }),
  getSignValueColumnConfig({
    valueKey: 'shortPnl1d',
    valuePrefix: '$',
    width: 160,
  }),
  getSignValueColumnConfig({
    valueKey: 'shortPnl7d',
    valuePrefix: '$',
    width: 160,
  }),
  getSignValueColumnConfig({
    valueKey: 'shortPnl30d',
    valuePrefix: '$',
    width: 160,
  }),
  getSignValueColumnConfig({ valueKey: 'shortPnl', valuePrefix: '$', width: 160 }),
  getNormalValueColumnConfig({ valueKey: 'longLiquidations1d', valuePrefix: '$', width: 160 }),
  getNormalValueColumnConfig({ valueKey: 'longLiquidations7d', valuePrefix: '$', width: 160 }),
  getNormalValueColumnConfig({
    valueKey: 'longLiquidations30d',
    valuePrefix: '$',
    width: 160,
  }),
  getNormalValueColumnConfig({ valueKey: 'longLiquidations', valuePrefix: '$', width: 160 }),
  getNormalValueColumnConfig({
    valueKey: 'shortLiquidations1d',
    valuePrefix: '$',
    width: 160,
  }),
  getNormalValueColumnConfig({
    valueKey: 'shortLiquidations7d',
    valuePrefix: '$',
    width: 160,
  }),
  getNormalValueColumnConfig({
    valueKey: 'shortLiquidations30d',
    valuePrefix: '$',
    width: 160,
  }),
  getNormalValueColumnConfig({ valueKey: 'shortLiquidations', valuePrefix: '$', width: 160 }),
  getNormalValueColumnConfig({
    valueKey: 'avgPositionDuration1d',
    type: 'timeDuration',
    width: 120,
  }),
  getNormalValueColumnConfig({
    valueKey: 'avgPositionDuration7d',
    type: 'timeDuration',
    width: 120,
  }),
  getNormalValueColumnConfig({
    valueKey: 'avgPositionDuration30d',
    type: 'timeDuration',
    width: 120,
  }),
  getNormalValueColumnConfig({ valueKey: 'avgPositionDuration', type: 'timeDuration', width: 110 }),
  getNormalValueColumnConfig({ valueKey: 'avgPositionSize1d', width: 120, valuePrefix: '$' }),
  getNormalValueColumnConfig({ valueKey: 'avgPositionSize7d', width: 120, valuePrefix: '$' }),
  getNormalValueColumnConfig({ valueKey: 'avgPositionSize30d', width: 120, valuePrefix: '$' }),
  getNormalValueColumnConfig({ valueKey: 'avgPositionSize', width: 120, valuePrefix: '$' }),
  getLSRatioColumnConfig({ valueKey: 'longRatio1d' }),
  getLSRatioColumnConfig({ valueKey: 'longRatio7d' }),
  getLSRatioColumnConfig({ valueKey: 'longRatio30d' }),
  getLSRatioColumnConfig({ valueKey: 'longRatio' }),
  getNormalValueColumnConfig({ valueKey: 'revenue1d', valuePrefix: '$', width: 150 }),
  getNormalValueColumnConfig({ valueKey: 'revenue7d', valuePrefix: '$', width: 150 }),
  getNormalValueColumnConfig({ valueKey: 'revenue30d', valuePrefix: '$', width: 150 }),
  getNormalValueColumnConfig({ valueKey: 'revenue', valuePrefix: '$', width: 150 }),
  getNormalValueColumnConfig({ valueKey: 'liquidations1d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'liquidations7d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'liquidations30d', valuePrefix: '$', width: 120 }),
  getNormalValueColumnConfig({ valueKey: 'liquidations', valuePrefix: '$', width: 120 }),
  {
    key: 'minTradingFee',
    title: renderTableTitleWithTooltip('minTradingFee', 'TRADING FEE'),
    searchText: 'Trading Fee',
    text: 'Trading Fee',
    style: { minWidth: 180, width: 180, maxWidth: 180, textAlign: 'right' },
    sortBy: 'minTradingFee',
    filterComponent: <TableFilterIcon valueKey={'minTradingFee'} />,
    render(data) {
      return (
        <Type.Caption color={data.minTradingFee === 0 && data.maxTradingFee === 0 ? 'neutral3' : 'neutral1'}>
          {data.minTradingFee != null ? `${formatNumber(data.minTradingFee)}%` : '--'} -{' '}
          {data.maxTradingFee != null ? `${formatNumber(data.maxTradingFee)}%` : '--'}
        </Type.Caption>
      )
    },
  },
  // getNormalValueColumnConfig({ valueKey: 'makerFee', valueSuffix: '%', width: 130 }),
  // getNormalValueColumnConfig({ valueKey: 'takerFee', valueSuffix: '%', width: 130 }),
  {
    key: 'makerFee',
    title: renderTableTitleWithTooltip('makerFee', 'MARKER/ TAKER FEE'),
    searchText: 'Marker/Taker fee',
    text: 'Marker/Taker fee',
    style: { minWidth: 180, width: 180, maxWidth: 180, textAlign: 'right' },
    sortBy: 'makerFee',
    filterComponent: <TableFilterIcon valueKey={'makerFee'} />,
    render(data) {
      return (
        <Type.Caption color={data.makerFee === 0 && data.takerFee === 0 ? 'neutral3' : 'neutral1'}>
          {data.makerFee != null ? `${formatNumber(data.makerFee)}%` : '--'} -{' '}
          {data.takerFee != null ? `${formatNumber(data.takerFee)}%` : '--'}
        </Type.Caption>
      )
    },
  },
  getNormalValueColumnConfig({ valueKey: 'borrowFee', valueSuffix: '%', width: 140 }),
  getNormalValueColumnConfig({
    valueKey: 'hasFundingFee',
    type: 'boolean',
    textAlign: 'center',
    width: 140,
    hasSort: false,
  }),
  {
    key: 'type',
    title: renderTableTitleWithTooltip('type'),
    searchText: getColumnSearchText('type'),
    text: renderTableText('type'),
    style: { minWidth: 70, width: 70, pl: 3, textAlign: 'left' },
    filterComponent: <TableFilterIcon valueKey={'type'} />,
    render(data) {
      return <Flex sx={{ width: '100%', justifyContent: 'start', gap: 1 }}>{renderPerpDexTypeItems({ data })}</Flex>
    },
  },
  getNormalValueColumnConfig({ valueKey: 'feePerMillion1d', type: 'greaterThanZero', valuePrefix: '$', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'feePerMillion7d', type: 'greaterThanZero', valuePrefix: '$', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'feePerMillion30d', type: 'greaterThanZero', valuePrefix: '$', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'feePerMillion', type: 'greaterThanZero', valuePrefix: '$', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'averageFeeRate1d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'averageFeeRate7d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'averageFeeRate30d', type: 'percentage', width: 105 }),
  getNormalValueColumnConfig({ valueKey: 'averageFeeRate', type: 'percentage', width: 105 }),
  {
    key: 'marginModes',
    title: renderTableTitleWithTooltip('marginModes'),
    searchText: getColumnSearchText('marginModes'),
    text: renderTableText('marginModes'),
    style: { minWidth: 150, width: 150, textAlign: 'left', pl: 4 },
    filterComponent: <TableFilterIcon valueKey={'marginModes'} />,
    render(data) {
      return <Flex sx={{ width: '100%', justifyContent: 'start', gap: 1 }}>{renderMarginModeItems({ data })}</Flex>
    },
  },
  {
    key: 'positionModes',
    title: renderTableTitleWithTooltip('positionModes'),
    searchText: getColumnSearchText('positionModes'),
    text: renderTableText('positionModes'),
    style: { minWidth: 150, width: 150, textAlign: 'left', gap: 1 },
    filterComponent: <TableFilterIcon valueKey={'positionModes'} />,
    render(data) {
      return <Flex sx={{ width: '100%', justifyContent: 'start', gap: 1 }}>{renderPositionModeItems({ data })}</Flex>
    },
  },
  getNormalValueColumnConfig({
    valueKey: 'oneClickTrading',
    type: 'boolean',
    textAlign: 'center',
    width: 70,
    hasSort: false,
  }),
  // TODO: filter runtime
  getNormalValueColumnConfig({ valueKey: 'runTime', type: 'date', width: 100 }),
  {
    key: 'collateralAssets',
    title: renderTableTitleWithTooltip('collateralAssets'),
    text: renderTableText('collateralAssets'),
    style: { minWidth: 130, width: 130, textAlign: 'center', px: 12 },
    filterComponent: <TableFilterIcon valueKey={'collateralAssets'} />,
    render(data) {
      return (
        <Flex sx={{ width: '100%', justifyContent: 'center' }}>
          <IconGroup iconNames={data?.collateralAssets ?? []} iconUriFactory={parseCollateralColorImage} />
        </Flex>
      )
    },
  },
  getNormalValueColumnConfig({ valueKey: 'minCollateral', valuePrefix: '$', width: 160 }),
  {
    key: 'minLeverage',
    text: 'Leverage',
    title: renderTableTitleWithTooltip('minLeverage', 'LEVERAGE'),
    style: { minWidth: 150, width: 130, maxWidth: 130, textAlign: 'right' },
    sortBy: 'minLeverage',
    filterComponent: <TableFilterIcon valueKey={'minLeverage'} />,
    render(data) {
      return (
        <Type.Caption color="neutral1">
          {data.minLeverage != null ? `${formatNumber(data.minLeverage)}✕` : '--'} -{' '}
          {data.maxLeverage != null ? `${formatNumber(data.maxLeverage)}✕` : '--'}
        </Type.Caption>
      )
    },
  },
  {
    key: 'pairs',
    title: renderTableTitleWithTooltip('pairs'),
    searchText: getColumnSearchText('pairs'),
    text: renderTableText('pairs'),
    style: { minWidth: 120, width: 120, textAlign: 'center' },
    filterComponent: <TableFilterIcon valueKey={'pairs'} />,
    render(data) {
      return (
        <Flex sx={{ width: '100%', justifyContent: 'center' }}>
          <MarketGroup symbols={data.pairs} />
        </Flex>
      )
    },
  },

  getNormalValueColumnConfig({ valueKey: 'invested', valuePrefix: '$', width: 120 }),
  {
    key: 'audit',
    searchText: getColumnSearchText('audit'),
    title: renderTableTitleWithTooltip('audit'),
    text: renderTableText('audit'),
    style: { minWidth: 100, width: 100, maxWidth: 100, textAlign: 'right' },
    render(data) {
      return <Flex sx={{ width: '100%', justifyContent: 'end' }}>{renderAudit({ data })}</Flex>
    },
  },
  {
    key: 'minReferralCommission',
    title: renderTableTitleWithTooltip('minReferralCommission', 'REF COMMISSION'),
    searchText: 'Ref Commission',
    text: 'Ref Commission',
    style: { minWidth: 160, width: 160, maxWidth: 160, textAlign: 'right' },
    sortBy: 'minReferralCommission',
    filterComponent: <TableFilterIcon valueKey={'minReferralCommission'} />,
    render(data) {
      return (
        <Type.Caption color="neutral1">
          {data.minReferralCommission != null ? `${formatNumber(data.minReferralCommission)}%` : '--'} -{' '}
          {data.maxReferralCommission != null ? `${formatNumber(data.maxReferralCommission)}%` : '--'}
        </Type.Caption>
      )
    },
  },
  // {
  //   key: 'rewards',
  //   title: getTableTitleWithTooltip('rewards'),
  //   text: getTableText('rewards'),
  //   searchText: getColumnSearchText('rewards'),
  //   style: { minWidth: 100, width: 100, maxWidth: 100, textAlign: 'right' },
  //   render(data) {
  //     return <Type.Caption color="neutral1">{data.rewards}</Type.Caption>
  //   },
  // },

  getNormalValueColumnConfig({
    valueKey: 'rewards',
    type: 'boolean',
    textAlign: 'center',
    width: 70,
    hasSort: false,
  }),
  // Todo: link
  {
    key: 'tradeUrl',
    title: renderTableTitleWithTooltip('tradeUrl'),
    text: renderTableText('tradeUrl'),
    searchText: getColumnSearchText('tradeUrl'),
    // dataIndex: 'tradeUrl',
    // key: undefined,
    style: { minWidth: 100, width: 100, maxWidth: 100, textAlign: 'right' },
    render(data) {
      if (!data.tradeUrl) return '--'
      return (
        <Flex sx={{ width: '100%', justifyContent: 'end' }}>
          <Flex
            as="a"
            href={data.tradeUrl}
            target="_blank"
            sx={{
              alignItems: 'center',
              gap: 1,
              color: 'primary1',
              '&:hover': { color: 'primary2' },
            }}
          >
            <Type.Caption>Trade</Type.Caption> <ArrowSquareOut size={16} />
          </Flex>
        </Flex>
      )
    },
  },
]

export const RENDER_COLUMN_DATA_MAPPING: Partial<
  Record<
    keyof PerpDEXSourceResponse,
    ({
      data,
    }: {
      data: PerpDEXSourceResponse
      externalResource?: ExternalResource
      index?: number
      isChildren?: boolean
    }) => ReactNode
  >
> = {
  volume1d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'volume1d', externalResource, valuePrefix: '$', changeValueSuffix: '%' })
  },
  volume7d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'volume7d', externalResource, changeValueSuffix: '%' })
  },
  volume30d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'volume30d', externalResource, changeValueSuffix: '%' })
  },
  volume: ({ data, externalResource }) => {
    return renderNormalValue({
      data,
      valueKey: 'volume',
      type: 'number',
      prefix: '$',
      topValueHighlighting: true,
      externalResource,
    })
  },
  oneClickTrading: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'oneClickTrading', type: 'boolean' })
  },
  traders: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'traders', type: 'number' })
  },
  traders1d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'traders1d', externalResource })
  },
  traders7d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'traders7d', externalResource })
  },
  traders30d: ({ data, externalResource }) => {
    return renderChangeValue({ data, valueKey: 'traders30d', externalResource })
  },
  traderPnl: ({ data }) => {
    return renderSignValue({ data, valueKey: 'traderPnl', valuePrefix: '$' })
  },
  traderPnl1d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'traderPnl1d', valuePrefix: '$' })
  },
  traderPnl7d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'traderPnl7d', valuePrefix: '$' })
  },
  traderPnl30d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'traderPnl30d', valuePrefix: '$' })
  },
  oi: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'oi', type: 'number', prefix: '$' })
  },
  oi1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'oi1d', type: 'number', prefix: '$' })
  },
  oi7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'oi7d', type: 'number', prefix: '$' })
  },
  oi30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'oi30d', type: 'number', prefix: '$' })
  },
  longPnl: ({ data }) => {
    return renderSignValue({ data, valueKey: 'longPnl', valuePrefix: '$' })
  },
  longPnl1d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'longPnl1d', valuePrefix: '$' })
  },
  longPnl7d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'longPnl7d', valuePrefix: '$' })
  },
  longPnl30d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'longPnl30d', valuePrefix: '$' })
  },
  shortPnl: ({ data }) => {
    return renderSignValue({ data, valueKey: 'shortPnl', valuePrefix: '$' })
  },
  shortPnl1d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'shortPnl1d', valuePrefix: '$' })
  },
  shortPnl7d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'shortPnl7d', valuePrefix: '$' })
  },
  shortPnl30d: ({ data }) => {
    return renderSignValue({ data, valueKey: 'shortPnl30d', valuePrefix: '$' })
  },
  longLiquidations: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'longLiquidations', type: 'number', prefix: '$' })
  },
  longLiquidations1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'longLiquidations1d', type: 'number', prefix: '$' })
  },
  longLiquidations7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'longLiquidations7d', type: 'number', prefix: '$' })
  },
  longLiquidations30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'longLiquidations30d', type: 'number', prefix: '$' })
  },
  shortLiquidations: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'shortLiquidations', type: 'number', prefix: '$' })
  },
  shortLiquidations1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'shortLiquidations1d', type: 'number', prefix: '$' })
  },
  shortLiquidations7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'shortLiquidations7d', type: 'number', prefix: '$' })
  },
  shortLiquidations30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'shortLiquidations30d', type: 'number', prefix: '$' })
  },
  avgPositionDuration: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionDuration', type: 'timeDuration' })
  },
  avgPositionDuration1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionDuration1d', type: 'timeDuration' })
  },
  avgPositionDuration7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionDuration7d', type: 'timeDuration' })
  },
  avgPositionDuration30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionDuration30d', type: 'timeDuration' })
  },
  avgPositionSize: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionSize', type: 'number', prefix: '$' })
  },
  avgPositionSize1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionSize1d', type: 'number', prefix: '$' })
  },
  avgPositionSize7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionSize7d', type: 'number', prefix: '$' })
  },
  avgPositionSize30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'avgPositionSize30d', type: 'number', prefix: '$' })
  },
  longRatio: ({ data }) => {
    return renderLSRatio({ data, valueKey: 'longRatio' })
  },
  longRatio1d: ({ data }) => {
    return renderLSRatio({ data, valueKey: 'longRatio1d' })
  },
  longRatio7d: ({ data }) => {
    return renderLSRatio({ data, valueKey: 'longRatio7d' })
  },
  longRatio30d: ({ data }) => {
    return renderLSRatio({ data, valueKey: 'longRatio30d' })
  },
  revenue: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'revenue', type: 'number', prefix: '$' })
  },
  revenue1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'revenue1d', type: 'number', prefix: '$' })
  },
  revenue7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'revenue7d', type: 'number', prefix: '$' })
  },
  revenue30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'revenue30d', type: 'number', prefix: '$' })
  },
  liquidations: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'liquidations', type: 'number', prefix: '$' })
  },
  liquidations1d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'liquidations1d', type: 'number', prefix: '$' })
  },
  liquidations7d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'liquidations7d', type: 'number', prefix: '$' })
  },
  liquidations30d: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'liquidations30d', type: 'number', prefix: '$' })
  },
  type: ({ data }) => {
    return <Flex sx={{ width: '100%', alignItems: 'center', gap: 1 }}>{renderPerpDexTypeItems({ data })}</Flex>
  },
  marginModes: ({ data }) => {
    return <Flex sx={{ width: '100%', alignItems: 'center', gap: 1 }}>{renderMarginModeItems({ data })}</Flex>
  },
  positionModes: ({ data }) => {
    return <Flex sx={{ width: '100%', alignItems: 'center', gap: 1 }}>{renderPositionModeItems({ data })}</Flex>
  },
  runTime: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'runTime', type: 'date' })
  },
  collateralAssets: ({ data }) => {
    return (
      <Flex sx={{ width: '100%', justifyContent: 'left' }}>
        <IconGroup iconNames={data?.collateralAssets ?? []} iconUriFactory={parseCollateralColorImage} />
      </Flex>
    )
  },
  minLeverage: ({ data }) => {
    return (
      <Type.Caption color="neutral1">
        {data.minLeverage != null ? `${formatNumber(data.minLeverage)}✕` : '--'} -{' '}
        {data.maxLeverage != null ? `${formatNumber(data.maxLeverage)}✕` : '--'}
      </Type.Caption>
    )
  },
  minCollateral: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'minCollateral', type: 'number', prefix: '$' })
  },
  token: ({ data }) => {
    return <Type.Caption color="neutral1">{data.token ? `$${data.token}` : '--'}</Type.Caption>
  },
  invested: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'invested', type: 'number', prefix: '$' })
  },
  audit: renderAudit,
  minTradingFee: ({ data }) => {
    if (!data) return null
    return (
      <Type.Caption color="neutral1">
        {data.minTradingFee != null ? `${formatNumber(data.minTradingFee)}%` : '--'} -{' '}
        {data.maxTradingFee != null ? `${formatNumber(data.maxTradingFee)}%` : '--'}
      </Type.Caption>
    )
  },
  makerFee: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'makerFee', type: 'number', suffix: '%' })
  },
  takerFee: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'takerFee', type: 'number', suffix: '%' })
  },
  borrowFee: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'borrowFee', type: 'number', suffix: '%' })
  },
  hasFundingFee: ({ data }) => {
    return renderNormalValue({ data, valueKey: 'hasFundingFee', type: 'boolean' })
  },
  minReferralCommission: ({ data }) => {
    return (
      <Type.Caption color="neutral1">
        {data.minReferralCommission != null ? `${formatNumber(data.minReferralCommission)}%` : '--'} -{' '}
        {data.maxReferralCommission != null ? `${formatNumber(data.maxReferralCommission)}%` : '--'}
      </Type.Caption>
    )
  },
  rewards: ({ data }) => {
    return <Type.Caption color="neutral1">{data?.rewards}</Type.Caption>
  },
  pairs: ({ data }) => {
    return (
      <Flex sx={{ width: '100%', justifyContent: 'left' }}>
        <MarketGroup symbols={data.pairs} />
      </Flex>
    )
  },
  tradeUrl: ({ data }) => {
    return (
      <Flex
        as="a"
        href={data?.tradeUrl}
        target="_blank"
        sx={{
          alignItems: 'center',
          gap: 1,
          color: 'primary1',
          '&:hover': { color: 'primary2' },
        }}
      >
        <Type.Caption>Trade</Type.Caption> <ArrowSquareOut size={16} />
      </Flex>
    )
  },
}
