import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import { HlOrderData } from 'entities/hyperliquid'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { ColumnData } from 'theme/Table/types'
import { Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import OpenOrderPairFilterIcon from './OpenOrderPairFilterIcon'

const openTimeColumn: ColumnData<HlOrderData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '156px' },
  render: (item) => renderOpenTime(item, DAYJS_FULL_DATE_FORMAT),
}
export const renderOpenTime = (item: HlOrderData, format = DAYJS_FULL_DATE_FORMAT) => (
  <Type.Caption color="neutral1">
    <LocalTimeText date={item.timestamp} format={format} hasTooltip />
  </Type.Caption>
)

const openTimeShortColumn: ColumnData<HlOrderData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '60px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      <RelativeShortTimeText date={item.timestamp} />
    </Type.Caption>
  ),
}

const priceColumn: ColumnData<HlOrderData> = {
  title: 'Limit Price',
  dataIndex: 'priceNumber',
  key: 'priceNumber',
  sortBy: 'priceNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPrice(item),
}
export const renderPrice = (item: HlOrderData) => {
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(item.pair)

  return (
    <Type.Caption color="neutral1">
      {item.priceNumber && !item.isPositionTpsl
        ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2, hlDecimals })
        : 'Market'}
    </Type.Caption>
  )
}

const sizeColumn: ColumnData<HlOrderData> = {
  title: 'Value',
  dataIndex: 'sizeNumber',
  key: 'sizeNumber',
  sortBy: 'sizeNumber',
  style: { minWidth: '85px', textAlign: 'right' },
  render: (item, _, externalSource: any) => renderSize(item, externalSource),
}
export const renderSize = (item: HlOrderData, externalSource?: any) => (
  <Type.Caption color="neutral1">
    {item.sizeNumber
      ? `$${externalSource?.isExpanded ? formatNumber(item.sizeNumber, 0, 0) : compactNumber(item.sizeNumber, 2)}`
      : '--'}
  </Type.Caption>
)

const sizeInTokenColumn: ColumnData<HlOrderData> = {
  title: 'Size',
  dataIndex: 'sizeInTokenNumber',
  key: 'sizeInTokenNumber',
  sortBy: 'sizeInTokenNumber',
  style: { minWidth: '85px', textAlign: 'right' },
  render: (item, _, externalSource: any) => renderSizeInToken(item, externalSource),
}
export const renderSizeInToken = (item: HlOrderData, externalSource?: any) => (
  <Type.Caption color="neutral1">
    {!!item.sizeInTokenNumber
      ? `${
          externalSource?.isExpanded
            ? formatNumber(item.sizeInTokenNumber, 2, 2)
            : compactNumber(item.sizeInTokenNumber, 2)
        }`
      : '--'}
  </Type.Caption>
)

const symbolColumn: ColumnData<HlOrderData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  // sortBy: 'pair',
  style: { minWidth: '75px' },
  render: (item) => renderSymbol(item),
}
export const renderSymbol = (item: HlOrderData) => {
  const symbol = getSymbolFromPair(item.pair)
  return <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
}

const orderTypeColumn: ColumnData<HlOrderData> = {
  title: 'Type',
  dataIndex: 'orderType',
  key: 'orderType',
  // sortBy: 'orderType',
  style: { minWidth: '100px' },
  render: (item) => renderType(item),
}
export const renderType = (item: HlOrderData) => <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>

const directionColumn: ColumnData<HlOrderData> = {
  title: 'Direction',
  dataIndex: 'side',
  key: 'side',
  style: { minWidth: '70px' },
  render: (item) => renderDirection(item),
}
export const renderDirection = (item: HlOrderData) => (
  <Type.Caption color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}>
    {item.reduceOnly ? 'Close ' : ''}
    {item.isLong ? 'Long' : 'Short'}
  </Type.Caption>
)

const triggerConditionColumn: ColumnData<HlOrderData> = {
  title: 'Trigger Condition',
  dataIndex: 'triggerCondition',
  key: 'triggerCondition',
  // sortBy: 'triggerCondition',
  style: { minWidth: '150px', textAlign: 'right', pr: 12 },
  render: (item) => renderTriggerCondition(item),
}
export const renderTriggerCondition = (item: HlOrderData) => (
  <Type.Caption color="neutral1">{item.triggerCondition ?? '--'}</Type.Caption>
)

const reduceOnlyColumn: ColumnData<HlOrderData> = {
  title: 'Reduce Only',
  dataIndex: 'reduceOnly',
  key: 'reduceOnly',
  // sortBy: 'reduceOnly',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => renderReduceOnly(item),
}
export const renderReduceOnly = (item: HlOrderData) => (
  <Type.Caption color="neutral1">{item.reduceOnly ? 'Yes' : 'No'}</Type.Caption>
)

export const fullOrderColumns: ColumnData<HlOrderData>[] = [
  openTimeColumn,
  { ...orderTypeColumn, style: { ...orderTypeColumn.style, minWidth: '150px' } },
  {
    ...symbolColumn,
    style: { ...symbolColumn.style, minWidth: '150px' },
    filterComponent: <OpenOrderPairFilterIcon />,
  },
  directionColumn,
  sizeInTokenColumn,
  sizeColumn,
  priceColumn,
  reduceOnlyColumn,
  triggerConditionColumn,
]

export const orderColumns: ColumnData<HlOrderData>[] = [
  openTimeShortColumn,
  symbolColumn,
  directionColumn,
  sizeInTokenColumn,
  sizeColumn,
  priceColumn,
]

export const drawerOrderColumns: ColumnData<HlOrderData>[] = [
  openTimeColumn,
  orderTypeColumn,
  symbolColumn,
  directionColumn,
  sizeInTokenColumn,
  sizeColumn,
  priceColumn,
  reduceOnlyColumn,
  triggerConditionColumn,
]
