import { useMemo } from 'react'

import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import { HlOrderData } from 'entities/hyperliquid'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'

type ExternalSource = {
  totalOrders: number
  highlightTxHash?: string
}

export default function ListHLOrderTable({ data }: { data: HlOrderData[] }) {
  const orders = [...(data ?? [])].sort((a, b) => b.timestamp - a.timestamp)

  const tableData = useMemo(() => {
    return { data: orders, meta: { limit: orders.length, offset: 0, total: orders.length, totalPages: 1 } }
  }, [orders])

  const columns = useMemo(() => {
    const result: ColumnData<HlOrderData, ExternalSource>[] = [
      {
        title: 'Time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        style: { minWidth: '182px' },
        render: (item) => (
          <Type.Caption color="neutral1">
            <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
          </Type.Caption>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'orderType',
        key: 'orderType',
        style: { minWidth: '150px', textAlign: 'left' },
        render: (item) => <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>,
      },
      {
        title: 'Direction',
        dataIndex: 'isLong',
        key: 'isLong',
        style: { minWidth: '120px', textAlign: 'left' },
        render: (item) => (
          <Type.Caption
            color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}
          >
            {item.reduceOnly ? 'Close ' : ''}
            {item.isLong ? 'Long' : 'Short'}
          </Type.Caption>
        ),
      },
      {
        title: 'Trigger Condition',
        dataIndex: 'triggerCondition',
        key: 'triggerCondition',
        sortBy: 'triggerCondition',
        style: { minWidth: '150px', textAlign: 'left' },
        render: (item) => renderOrderTriggerCondition(item),
      },
      {
        title: 'Value',
        dataIndex: 'sizeNumber',
        key: 'sizeNumber',
        style: { minWidth: '105px', textAlign: 'right' },
        render: (item) => renderOrderSize(item),
      },
      {
        title: 'Value',
        dataIndex: 'sizeInTokenNumber',
        key: 'sizeInTokenNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item) => renderOrderSizeInToken(item),
      },
      {
        title: 'Market Price',
        dataIndex: 'priceNumber',
        key: 'priceNumber',
        style: { minWidth: '100px', textAlign: 'right' },
        render: renderOrderPrice,
      },
    ]
    return result
  }, [])

  const externalSource: ExternalSource = {
    totalOrders: tableData?.meta?.total ?? 0,
  }
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Table
        wrapperSx={{
          display: 'block !important',
          pr: 0,
          table: {
            '& th:first-child, td:first-child': {
              pl: 3,
            },
            '& th:last-child, td:last-child': {
              pr: 3,
            },
          },
        }}
        data={tableData?.data}
        columns={columns}
        externalSource={externalSource}
        tableBodyWrapperSx={{ overflow: 'auto' }}
        isLoading={false}
      />
    </Box>
  )
}
export const renderOrderTriggerCondition = (item: HlOrderData) => (
  <Type.Caption color="neutral1">{item.triggerCondition ?? '--'}</Type.Caption>
)
export const renderOrderSize = (item: HlOrderData) => (
  <Type.Caption color="neutral1">{item.sizeNumber ? formatNumber(item.sizeNumber, 0, 0) : '--'}</Type.Caption>
)

export const renderOrderSizeInToken = (item: HlOrderData) => (
  <Type.Caption color="neutral1">
    {item.sizeInTokenNumber ? formatNumber(item.sizeInTokenNumber, 2, 2) : '--'}
  </Type.Caption>
)

export const renderOrderPrice = (item: HlOrderData) => (
  <Type.Caption color="neutral1">
    {item.priceNumber && !item.isPositionTpsl
      ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 })
      : 'Market'}
  </Type.Caption>
)
