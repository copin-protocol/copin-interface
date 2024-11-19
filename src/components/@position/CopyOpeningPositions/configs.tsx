import { CaretRight } from '@phosphor-icons/react'

import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import LabelEPnL from 'components/@ui/LabelEPnL'
import { CopyPositionData } from 'entities/copyTrade.d'
import { ColumnData } from 'theme/Table/types'
import { Box, IconBox, Type } from 'theme/base'
import { GAINS_TRADE_PROTOCOLS } from 'utils/config/constants'

import { renderEntry, renderPnL, renderSource, renderTrader } from '../configs/copyPositionRenderProps'
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
