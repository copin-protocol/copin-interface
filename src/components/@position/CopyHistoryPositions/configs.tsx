import ReverseTag from 'components/@ui/ReverseTag'
import { CopyPositionData } from 'entities/copyTrade.d'
import { ColumnData } from 'theme/Table/types'
import { Box } from 'theme/base'

import {
  renderCloseTime,
  renderCloseType,
  renderCopyTitle,
  renderCopyWallet,
  renderEntry,
  renderLeverage,
  renderOpenTime,
  renderPnL,
  renderSize,
  renderSource,
  renderStatus,
  renderTrader,
} from '../configs/copyPositionRenderProps'
import { ExternalSourceCopyPositions, LayoutType } from '../types'
import LiteHistoryFilterTrader from './LiteHistoryFilterTrader'

export const historyColumns: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] = [
  {
    title: 'Open Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: '170px', width: 170 },
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
    style: { minWidth: '150px', width: 150 },
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
    style: { minWidth: '120px', width: 120 },
    render: renderCopyTitle,
  },
  {
    title: 'Copy Wallet',
    dataIndex: 'copyTradeId',
    key: 'copyTradeId',
    style: { minWidth: '140px', width: 120 },
    render: renderCopyWallet,
  },
  // {
  //   title: 'Source',
  //   dataIndex: 'id',
  //   key: 'id',
  //   style: { minWidth: '100px', width: 100, textAlign: 'center' },
  //   render: (item, index, externalSource) => renderSource(item, index, externalSource, true),
  // }, // enabled later
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
    title: 'PnL',
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
    style: { minWidth: '90px', width: 90, textAlign: 'left' },
    render: renderStatus,
  },
]

const liteHistoryColumns = historyColumns.filter((v) => v.key !== 'copyTradeId')
const traderColumnIndex = liteHistoryColumns.findIndex((v) => v.key === 'copyAccount')
if (traderColumnIndex !== -1) {
  liteHistoryColumns[traderColumnIndex] = {
    ...liteHistoryColumns[traderColumnIndex],
    filterComponent: <LiteHistoryFilterTrader type="icon" />,
  }
}
// const drawerHistoryColumns = historyColumns.filter(
//   (v) => v.key != null && !['copyAccount', 'copyTradeId'].includes(v.key)
// )

const mapping: { [type in LayoutType]: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] } = {
  lite: liteHistoryColumns,
  normal: historyColumns,
  simple: historyColumns,
}

export function getCopyPositionHistoryColumns({
  layoutType,
  excludingColumnKeys,
}: {
  layoutType: LayoutType
  excludingColumnKeys?: (keyof CopyPositionData)[]
}) {
  let columns = mapping[layoutType]
  if (!!excludingColumnKeys) {
    columns = columns.filter((v) => (v.key != null ? !excludingColumnKeys.includes(v.key) : true))
  }
  return columns
}
