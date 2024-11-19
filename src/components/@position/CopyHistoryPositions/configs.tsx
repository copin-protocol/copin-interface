import ReverseTag from 'components/@ui/ReverseTag'
import { CopyPositionData } from 'entities/copyTrade.d'
import { ColumnData } from 'theme/Table/types'
import { Box } from 'theme/base'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'

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
import { ExternalSourceCopyPositions } from '../types'

export const historyColumns: ColumnData<CopyPositionData, ExternalSourceCopyPositions>[] = [
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
    title: 'Copy Wallet',
    dataIndex: 'copyTradeId',
    key: 'copyTradeId',
    style: { minWidth: '150px', width: 150 },
    render: renderCopyWallet,
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
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '100px', width: 100, textAlign: 'right' },
    render: (item, _, externalSource) =>
      renderPnL(
        item,
        GAINS_TRADE_PROTOCOLS.includes(item.protocol) ? externalSource?.gainsPrices : externalSource?.prices
      ),
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
