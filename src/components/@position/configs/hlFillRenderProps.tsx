import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import { GroupedFillsData } from 'entities/hyperliquid'
import { ColumnData } from 'theme/Table/types'
import { Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

const timeColumn: ColumnData<GroupedFillsData> = {
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

const shortTimeColumn: ColumnData<GroupedFillsData> = {
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

const pairColumn: ColumnData<GroupedFillsData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  style: { width: '100px' },
  render: (item) => <Type.Caption color="neutral1">{getSymbolFromPair(item.pair)}</Type.Caption>,
}

const directionColumn: ColumnData<GroupedFillsData> = {
  title: 'Direction',
  dataIndex: 'direction',
  key: 'direction',
  style: { width: '100px' },
  render: (item) => <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.direction}</Type.Caption>,
}

const sizeUsdColumn: ColumnData<GroupedFillsData> = {
  title: 'Size ($)',
  dataIndex: 'totalSize',
  key: 'totalSize',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{formatNumber(item.totalSize, 0)}</Type.Caption>,
}

const sizeTokenColumn: ColumnData<GroupedFillsData> = {
  title: 'Size',
  dataIndex: 'totalSizeInToken',
  key: 'totalSizeInToken',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{formatNumber(item.totalSizeInToken, 2, 2)}</Type.Caption>,
}

const fillsColumn: ColumnData<GroupedFillsData> = {
  title: 'Fill Count',
  dataIndex: 'fills',
  key: 'fills',
  style: { width: '120px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{item.fills.length} fills</Type.Caption>,
}

const priceColumn: ColumnData<GroupedFillsData> = {
  title: 'Avg. Price',
  dataIndex: 'avgPrice',
  key: 'avgPrice',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">{PriceTokenText({ value: item.avgPrice, maxDigit: 2, minDigit: 2 })}</Type.Caption>
  ),
}

const feeColumn: ColumnData<GroupedFillsData> = {
  title: 'Fee',
  dataIndex: 'totalFee',
  key: 'totalFee',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral3">
      {!!item.totalFee ? <SignedText value={item.totalFee * -1} maxDigit={2} minDigit={2} prefix="$" /> : '--'}
    </Type.Caption>
  ),
}

const pnlColumn: ColumnData<GroupedFillsData> = {
  title: 'PnL',
  dataIndex: 'totalPnl',
  key: 'totalPnl',
  style: { minWidth: '105px', textAlign: 'right', pr: 12 },
  render: (item) => (
    <Type.Caption color="neutral3">
      {!!item.totalPnl ? <SignedText value={item.totalPnl} maxDigit={2} minDigit={2} prefix="$" /> : '--'}
    </Type.Caption>
  ),
}

export const fullFillColumns: ColumnData<GroupedFillsData>[] = [
  timeColumn,
  pairColumn,
  directionColumn,
  sizeTokenColumn,
  sizeUsdColumn,
  fillsColumn,
  priceColumn,
  feeColumn,
  pnlColumn,
]

export const fillColumns: ColumnData<GroupedFillsData>[] = [
  shortTimeColumn,
  pairColumn,
  directionColumn,
  sizeUsdColumn,
  priceColumn,
  pnlColumn,
]

export const drawerFillColumns: ColumnData<GroupedFillsData>[] = [
  timeColumn,
  pairColumn,
  directionColumn,
  sizeTokenColumn,
  sizeUsdColumn,
  fillsColumn,
  priceColumn,
  feeColumn,
  pnlColumn,
]
