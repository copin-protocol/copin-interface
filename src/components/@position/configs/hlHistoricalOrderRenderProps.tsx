import { v4 as uuid } from 'uuid'

import { convertHlOrderStatus } from 'components/@position/helpers/hyperliquid'
import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { HlHistoricalOrderData } from 'entities/hyperliquid'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, IGNORED_REASON_HL_ORDER_STATUS } from 'utils/config/constants'
import { HlOrderStatusEnum } from 'utils/config/enums'
import { HYPERLIQUID_ORDER_STATUS_TRANS } from 'utils/config/translations'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import HistoricalOrderPairFilterIcon from './HistoricalOrderPairFilterIcon'

const openTimeColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '156px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip />
    </Type.Caption>
  ),
}
const openTimeShortColumn: ColumnData<HlHistoricalOrderData> = {
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

const priceColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Limit Price',
  dataIndex: 'priceNumber',
  key: 'priceNumber',
  sortBy: 'priceNumber',
  style: { minWidth: '110px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      {item.priceNumber && !item.isPositionTpsl
        ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 })
        : 'Market'}
    </Type.Caption>
  ),
}

const sizeColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Value',
  dataIndex: 'sizeNumber',
  key: 'sizeNumber',
  sortBy: 'sizeNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {item.sizeNumber
        ? `$${externalSource?.isExpanded ? formatNumber(item.sizeNumber, 0, 0) : compactNumber(item.sizeNumber, 2)}`
        : '--'}
    </Type.Caption>
  ),
}

const sizeInTokenColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Size',
  dataIndex: 'sizeInTokenNumber',
  key: 'sizeInTokenNumber',
  sortBy: 'sizeInTokenNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {item.sizeInTokenNumber
        ? `${
            externalSource?.isExpanded
              ? formatNumber(item.sizeInTokenNumber, 2, 2)
              : compactNumber(item.sizeInTokenNumber, 2)
          }`
        : '--'}
    </Type.Caption>
  ),
}

const originalSizeInTokenColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Filled Size',
  dataIndex: 'originalSizeInTokenNumber',
  key: 'originalSizeInTokenNumber',
  sortBy: 'originalSizeInTokenNumber',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {item.status === HlOrderStatusEnum.FILLED && item.originalSizeInTokenNumber
        ? `${
            externalSource?.isExpanded
              ? formatNumber(item.originalSizeInTokenNumber, 2, 2)
              : compactNumber(item.originalSizeInTokenNumber, 2)
          }`
        : '--'}
    </Type.Caption>
  ),
}

const symbolColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  // sortBy: 'pair',
  style: { minWidth: '80px' },
  render: (item) => {
    const symbol = getSymbolFromPair(item.pair)
    return <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
  },
}

const orderTypeColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Type',
  dataIndex: 'orderType',
  key: 'orderType',
  // sortBy: 'orderType',
  style: { minWidth: '100px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>
  },
}

const directionColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Direction',
  dataIndex: 'side',
  key: 'side',
  style: { minWidth: '100px' },
  render: (item) => {
    return (
      <Type.Caption color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}>
        {item.reduceOnly ? 'Close ' : ''}
        {item.isLong ? 'Long' : 'Short'}
      </Type.Caption>
    )
  },
}

const triggerConditionColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Trigger Condition',
  dataIndex: 'triggerCondition',
  key: 'triggerCondition',
  // sortBy: 'triggerCondition',
  style: { minWidth: '120px', textAlign: 'right', pr: '12px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.triggerCondition ?? '--'}</Type.Caption>
  },
}

const reduceOnlyColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Reduce Only',
  dataIndex: 'reduceOnly',
  key: 'reduceOnly',
  // sortBy: 'reduceOnly',
  style: { minWidth: '80px' },
  render: (item) => {
    return <Type.Caption color="neutral1">{item.reduceOnly ? 'Yes' : 'No'}</Type.Caption>
  },
}

const orderStatusColumn: ColumnData<HlHistoricalOrderData> = {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  sortBy: 'status',
  style: { minWidth: '100px', textAlign: 'right', pr: '12px' },
  render: (item) => {
    const status = item.status ? HYPERLIQUID_ORDER_STATUS_TRANS[item.status] : '--'
    const hasTooltip = !IGNORED_REASON_HL_ORDER_STATUS.includes(item.status)
    const tooltipId = uuid()
    return (
      <Box color="neutral1">
        {hasTooltip ? (
          <LabelWithTooltip
            id={tooltipId}
            tooltip={
              <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
                {convertHlOrderStatus(item.status)}
              </Type.Caption>
            }
            dashed
          >
            {status}
          </LabelWithTooltip>
        ) : (
          <Type.Caption> {status}</Type.Caption>
        )}
      </Box>
    )
  },
}

export const fullHistoricalOrderColumns: ColumnData<HlHistoricalOrderData>[] = [
  openTimeColumn,
  orderTypeColumn,
  { ...symbolColumn, filterComponent: <HistoricalOrderPairFilterIcon /> },
  directionColumn,

  reduceOnlyColumn,
  sizeInTokenColumn,
  sizeColumn,

  originalSizeInTokenColumn,
  priceColumn,
  triggerConditionColumn,
  orderStatusColumn,
]

export const historicalOrderColumns: ColumnData<HlHistoricalOrderData>[] = [
  openTimeShortColumn,
  symbolColumn,
  directionColumn,
  sizeInTokenColumn,
  sizeColumn,
  originalSizeInTokenColumn,
  priceColumn,
  orderStatusColumn,
]

export const drawerHistoricalOrderColumns: ColumnData<HlHistoricalOrderData>[] = [
  openTimeColumn,
  orderTypeColumn,
  symbolColumn,
  directionColumn,

  // reduceOnlyColumn,
  sizeInTokenColumn,
  sizeColumn,
  originalSizeInTokenColumn,
  priceColumn,
  orderStatusColumn,
  // triggerConditionColumn,
]
