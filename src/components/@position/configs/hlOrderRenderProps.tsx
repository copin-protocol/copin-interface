import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import { HlOrderData } from 'entities/hyperliquid'
import { ColumnData } from 'theme/Table/types'
import { Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import OpenOrderPairFilterIcon from './OpenOrderPairFilterIcon'

const openTimeColumn: ColumnData<HlOrderData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '156px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
    </Type.Caption>
  ),
}
const openTimeShortColumn: ColumnData<HlOrderData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  style: { width: '60px' },
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
  style: { minWidth: '100px', textAlign: 'right', pr: '12px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      {item.priceNumber && !item.isPositionTpsl
        ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 })
        : 'Market'}
    </Type.Caption>
  ),
}

const sizeColumn: ColumnData<HlOrderData> = {
  title: 'Value',
  dataIndex: 'sizeNumber',
  key: 'sizeNumber',
  sortBy: 'sizeNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">{item.sizeNumber ? `$${formatNumber(item.sizeNumber, 0, 0)}` : '--'}</Type.Caption>
  ),
}

const sizeInTokenColumn: ColumnData<HlOrderData> = {
  title: 'Size',
  dataIndex: 'sizeInTokenNumber',
  key: 'sizeInTokenNumber',
  sortBy: 'sizeInTokenNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      {item.sizeInTokenNumber ? formatNumber(item.sizeInTokenNumber, 2, 2) : '--'}
    </Type.Caption>
  ),
}

const symbolColumn: ColumnData<HlOrderData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  sortBy: 'pair',
  style: { width: '100px' },
  render: (item) => {
    const symbol = getSymbolFromPair(item.pair)
    return <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
  },
}

const orderTypeColumn: ColumnData<HlOrderData> = {
  title: 'Type',
  dataIndex: 'orderType',
  key: 'orderType',
  sortBy: 'orderType',
  style: { width: '150px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>
  },
}

const directionColumn: ColumnData<HlOrderData> = {
  title: 'Direction',
  dataIndex: 'side',
  key: 'side',
  style: { width: '100px' },
  render: (item) => {
    return (
      <Type.Caption color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}>
        {item.reduceOnly ? 'Close ' : ''}
        {item.isLong ? 'Long' : 'Short'}
      </Type.Caption>
    )
  },
}

const triggerConditionColumn: ColumnData<HlOrderData> = {
  title: 'Trigger Condition',
  dataIndex: 'triggerCondition',
  key: 'triggerCondition',
  sortBy: 'triggerCondition',
  style: { width: '150px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.triggerCondition ?? '--'}</Type.Caption>
  },
}

const reduceOnlyColumn: ColumnData<HlOrderData> = {
  title: 'Reduce Only',
  dataIndex: 'reduceOnly',
  key: 'reduceOnly',
  sortBy: 'reduceOnly',
  style: { width: '90px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.reduceOnly ? 'Yes' : 'No'}</Type.Caption>
  },
}

export const fullOrderColumns: ColumnData<HlOrderData>[] = [
  openTimeColumn,
  orderTypeColumn,
  { ...symbolColumn, filterComponent: <OpenOrderPairFilterIcon /> },
  directionColumn,
  triggerConditionColumn,
  reduceOnlyColumn,
  sizeColumn,
  sizeInTokenColumn,
  priceColumn,
]

export const orderColumns: ColumnData<HlOrderData>[] = [
  openTimeShortColumn,
  symbolColumn,
  directionColumn,
  sizeColumn,
  sizeInTokenColumn,
  priceColumn,
]

export const drawerOrderColumns: ColumnData<HlOrderData>[] = [
  openTimeColumn,
  orderTypeColumn,
  symbolColumn,
  directionColumn,
  triggerConditionColumn,
  reduceOnlyColumn,
  sizeColumn,
  sizeInTokenColumn,
  priceColumn,
]
