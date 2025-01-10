import { CaretRight } from '@phosphor-icons/react'

import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import LabelEPnL from 'components/@ui/LabelEPnL'
import { CopyPositionData } from 'entities/copyTrade.d'
import { Button } from 'theme/Buttons'
import { ColumnData } from 'theme/Table/types'
import { Box, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'

import {
  renderEntry,
  renderOpeningSize,
  renderPnL,
  renderSource,
  renderTrader,
} from '../configs/copyPositionRenderProps'
import { ExternalSourceCopyPositions } from '../types'

export const simpleOpeningColumns: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] = [
  {
    title: 'Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '60px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <RelativeShortTimeText date={item.createdAt} suffix="ago" />
      </Type.Caption>
    ),
  },
  // {
  //   title: 'Trader',
  //   dataIndex: 'copyAccount',
  //   key: 'copyAccount',
  //   style: { minWidth: '160px' },
  //   render: (item) => <Type.Caption>{addressShorten(item.copyAccount)}</Type.Caption>,
  // },
  {
    title: 'Entry',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item),
  },
  {
    title: <LabelEPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) =>
      renderPnL(
        item,
        GAINS_TRADE_PROTOCOLS.includes(item.protocol) ? externalSource?.gainsPrices : externalSource?.prices
      ),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '40px', maxWidth: '40px', textAlign: 'right' },
    render: () => <IconBox icon={<CaretRight size={16} />} color="neutral2" />,
  },
]

export const liteOpeningColumns: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '156px' },
    render: (item) => (
      <Type.Caption color="neutral1">
        <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} />
      </Type.Caption>
    ),
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '170px' },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '140px' },
    render: (item) => renderEntry(item),
  },
  {
    title: 'Size',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '220px' },
    render: (item, _, externalSource) =>
      renderOpeningSize(
        item,
        GAINS_TRADE_PROTOCOLS.includes(item.protocol) ? externalSource?.gainsPrices : externalSource?.prices
      ),
  },
  {
    title: 'Collateral',
    dataIndex: 'initialVol',
    key: 'initialVol',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">${formatNumber(item.initialVol / item.leverage, 2, 2)}</Type.Caption>
    ),
  },
  {
    title: 'Stop Loss / Take Profit',
    dataIndex: 'stopLossPrice',
    key: 'stopLossPrice',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.stopLossPrice ? formatNumber(item.stopLossPrice, 2, 2) : '--'} /{' '}
        {item.takeProfitPrice ? formatNumber(item.takeProfitPrice, 2, 2) : '--'}
      </Type.Caption>
    ),
  },
  {
    title: <LabelEPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) =>
      renderPnL(
        item,
        GAINS_TRADE_PROTOCOLS.includes(item.protocol) ? externalSource?.gainsPrices : externalSource?.prices
      ),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '60px', maxWidth: '60px', textAlign: 'right' },
    render: (item, _, externalSource) => (
      <Button
        variant="ghostPrimary"
        onClick={(e) => {
          e.stopPropagation()
          if (externalSource?.handleCloseCopyItem) {
            externalSource.handleCloseCopyItem(item)
          }
        }}
      >
        Close
      </Button>
    ),
  },
]

export const openingColumns: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: '90px' },
    render: (item) => (
      <Type.Caption color="neutral1">
        <LocalTimeText date={item.createdAt} />
      </Type.Caption>
    ),
  },
  {
    title: 'Copy Address',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '160px' },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item),
  },
  {
    title: <LabelEPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) =>
      renderPnL(
        item,
        GAINS_TRADE_PROTOCOLS.includes(item.protocol) ? externalSource?.gainsPrices : externalSource?.prices
      ),
  },
  {
    title: <Box pr={1}>Source</Box>,
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '70px', textAlign: 'right' },
    render: renderSource,
  },
]

export const getColumns = (type: 'lite' | 'normal' | 'simple') => {
  switch (type) {
    case 'lite':
      return liteOpeningColumns
    case 'simple':
      return simpleOpeningColumns
    default:
      return openingColumns
  }
}
