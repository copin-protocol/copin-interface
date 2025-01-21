import { CaretRight } from '@phosphor-icons/react'

import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import LabelEPnL from 'components/@ui/LabelEPnL'
import ReverseTag from 'components/@ui/ReverseTag'
import { CopyPositionData } from 'entities/copyTrade.d'
import { ColumnData } from 'theme/Table/types'
import { Box, IconBox, Type } from 'theme/base'

import {
  renderCloseTime,
  renderCloseType,
  renderCopyTitle,
  renderEntry,
  renderLeverage,
  renderOpenTime,
  renderPnL,
  renderSize,
  renderSource,
  renderStatus,
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
    render: (item) => renderPnL(item),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '40px', maxWidth: '40px', textAlign: 'right' },
    render: () => <IconBox icon={<CaretRight size={16} />} color="neutral2" />,
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
    render: (item) => renderPnL(item),
  },
  {
    title: <Box pr={1}>Source</Box>,
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '70px', textAlign: 'right' },
    render: renderSource,
  },
]

export const historyColumns: typeof openingColumns = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '172px', width: 172 },
    render: (item) => (
      <Box sx={{ position: 'relative' }}>
        {item.isReverse && <ReverseTag sx={{ top: '-12px', left: '-16px' }} />}
        {renderOpenTime(item)}
      </Box>
    ),
  },
  {
    title: 'Close Time',
    dataIndex: 'lastOrderAt',
    key: 'lastOrderAt',
    sortBy: 'lastOrderAt',
    style: { minWidth: '156px', width: 156 },
    render: renderCloseTime,
  },
  {
    title: 'Trader',
    dataIndex: 'copyAccount',
    key: 'copyAccount',
    style: { minWidth: '180px', width: 180 },
    render: (item) => renderTrader(item.copyAccount, item.protocol),
  },
  {
    title: 'Copy',
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: '130px', width: 130 },
    render: renderCopyTitle,
  },
  {
    title: 'Source',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '100px', width: 100, textAlign: 'center' },
    render: (item, index, externalSource) => renderSource(item, index, externalSource, true),
  },
  {
    title: 'Entry',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    style: { minWidth: '150px', width: 150 },
    render: renderEntry,
  },
  {
    title: 'Size',
    dataIndex: 'totalSizeDelta',
    key: 'totalSizeDelta',
    style: { minWidth: '100px', width: 100, textAlign: 'right' },
    render: renderSize,
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    style: { minWidth: '80px', width: 80, textAlign: 'right' },
    render: renderLeverage,
  },
  {
    title: 'ePnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '100px', width: 100, textAlign: 'right' },
    render: (item) => renderPnL(item),
  },
  {
    title: <Box>Closed Type</Box>,
    dataIndex: 'closeType',
    key: 'closeType',
    sortBy: 'closeType',
    style: { minWidth: '120px', width: 120, textAlign: 'left', pl: 2 },
    render: renderCloseType,
  },
  {
    title: <Box pr={2}>Status</Box>,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: '80px', width: 80, textAlign: 'left' },
    render: renderStatus,
  },
]
