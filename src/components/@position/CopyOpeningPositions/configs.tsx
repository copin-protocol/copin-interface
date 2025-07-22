import { Trans } from '@lingui/macro'
import { CaretRight, Warning } from '@phosphor-icons/react'

import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import LabelEPnL from 'components/@ui/LabelEPnL'
import { CopyPositionData } from 'entities/copyTrade.d'
import { Button } from 'theme/Buttons'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'

import {
  renderCollateral,
  renderEntry,
  renderOpeningROI,
  renderOpeningSize,
  renderPnL,
  renderSLTP,
  renderSource,
  renderTrader,
} from '../configs/copyPositionRenderProps'
import { ExternalSourceCopyPositions, LayoutType } from '../types'
import LiteFilterOpeningPositionTrader from './LiteOpeningFilterTrader'
import MismatchPosition from './MismatchPosition'

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
    filterComponent: <LiteFilterOpeningPositionTrader type="icon" />,
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
    title: 'Value',
    dataIndex: 'sizeDelta',
    key: 'sizeDelta',
    style: { minWidth: '220px' },
    render: (item) => renderOpeningSize(item),
  },
  {
    title: 'Collateral',
    dataIndex: 'initialVol',
    key: 'initialVol',
    style: { minWidth: '80px', textAlign: 'right' },
    render: renderCollateral,
  },
  {
    title: 'Stop Loss / Take Profit',
    dataIndex: 'stopLossPrice',
    key: 'stopLossPrice',
    style: { minWidth: '150px', textAlign: 'right' },
    render: renderSLTP,
  },
  {
    title: 'ROI',
    key: undefined,
    style: { minWidth: '60px', textAlign: 'right' },
    render: renderOpeningROI,
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
    style: { minWidth: '80px', maxWidth: '80px', textAlign: 'right' },
    render: (item, _, externalSource) => {
      if (item.openingPositionType === 'onlyLiveApp') {
        return <MismatchPosition data={item} externalSource={externalSource} />
      }
      return (
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
      )
    },
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
    title: 'ROI',
    key: 'realisedPnl', // just for identify
    style: { minWidth: 50, maxWidth: 50, textAlign: 'right' },
    render: renderOpeningROI,
  },
  {
    title: <LabelEPnL />,
    dataIndex: 'pnl',
    key: 'pnl',
    style: { minWidth: '80px', textAlign: 'right' },
    render: (item) => renderPnL(item),
  },
  // {
  //   title: <Box pr={1}>Source</Box>,
  //   dataIndex: 'id',
  //   key: 'id',
  //   style: { minWidth: '70px', textAlign: 'right' },
  //   render: renderSource,
  // },
]

export const getColumns = ({
  type,
  excludingColumnKeys,
}: {
  type: LayoutType
  excludingColumnKeys?: (keyof CopyPositionData)[]
}) => {
  let columns = openingColumns
  switch (type) {
    case 'lite':
      columns = liteOpeningColumns
      break
    case 'simple':
      columns = simpleOpeningColumns
      break
  }
  if (excludingColumnKeys) {
    columns = columns.filter((v) => (v.key != null ? !excludingColumnKeys.includes(v.key) : true))
  }
  return columns
}
