import { FillRangeFilterIcon } from 'components/@dailyTrades/FillRangeFilterIcon'
import { FILL_RANGE_KEYS } from 'components/@dailyTrades/configs'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText, RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { GroupedFillsData } from 'entities/hyperliquid'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { HLDirectionFilterIcon } from '../HLTraderOpeningPositions/HLDirectionFilterIcon'
import OrderFilledPairFilterIcon from './OrderFilledPairFilterIcon'

const timeColumn: ColumnData<GroupedFillsData> = {
  title: <TimeColumnTitleWrapper>Time</TimeColumnTitleWrapper>,
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '156px' },
  render: (item) => <FillTime data={item} />,
}

function FillTime({ data }: { data: GroupedFillsData }) {
  const [positionTimeType, currentTime] = useGlobalStore((state) => [state.positionTimeType, state.currentTime])
  return positionTimeType === 'absolute' ? (
    <Box>
      <Box display={['none', 'none', 'none', 'block']}>{renderFillsBlockTime(data)}</Box>
      <Box display={['block', 'block', 'block', 'none']}>{renderFillsBlockTime(data, TIME_FORMAT)}</Box>
    </Box>
  ) : (
    <Flex color="neutral2" sx={{ alignItems: 'center', gap: 2 }}>
      <RelativeTimeText key={currentTime} date={data.timestamp} textStyle={{ fontSize: '12px' }} hasTooltip />
    </Flex>
  )
}

export const renderFillsBlockTime = (item: GroupedFillsData, format = DAYJS_FULL_DATE_FORMAT) => (
  <Flex alignItems="center" sx={{ gap: 2 }}>
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.timestamp} format={format} hasTooltip />
    </Type.Caption>
  </Flex>
)

const shortTimeColumn: ColumnData<GroupedFillsData> = {
  title: 'Time',
  dataIndex: 'timestamp',
  key: 'timestamp',
  style: { minWidth: '60px' },
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
  style: { minWidth: '75px' },
  render: (item) => <Type.Caption color="neutral1">{getSymbolFromPair(item.pair)}</Type.Caption>,
}

const directionColumn: ColumnData<GroupedFillsData> = {
  title: 'Direction',
  dataIndex: 'direction',
  key: 'direction',
  style: { minWidth: '70px' },
  render: (item) => <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.direction}</Type.Caption>,
}

const sizeUsdColumn: ColumnData<GroupedFillsData> = {
  title: 'Value',
  dataIndex: 'totalSize',
  key: 'totalSize',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {`$${externalSource?.isExpanded ? formatNumber(item.totalSize, 0) : compactNumber(item.totalSize, 2)}`}
    </Type.Caption>
  ),
}

const sizeTokenColumn: ColumnData<GroupedFillsData> = {
  title: 'Size',
  dataIndex: 'totalSizeInToken',
  key: 'totalSizeInToken',
  style: { minWidth: '85px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {`${
        externalSource?.isExpanded ? formatNumber(item.totalSizeInToken, 2, 2) : compactNumber(item.totalSizeInToken, 2)
      }`}
    </Type.Caption>
  ),
}

const fillsColumn: ColumnData<GroupedFillsData> = {
  title: 'Fill Count',
  dataIndex: 'fills',
  key: 'fills',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{item.fills.length} fills</Type.Caption>,
}

const priceColumn: ColumnData<GroupedFillsData> = {
  title: 'Avg. Price',
  dataIndex: 'avgPrice',
  key: 'avgPrice',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">{PriceTokenText({ value: item.avgPrice, maxDigit: 2, minDigit: 2 })}</Type.Caption>
  ),
}

const feeColumn: ColumnData<GroupedFillsData> = {
  title: 'Fee',
  dataIndex: 'totalFee',
  key: 'totalFee',
  style: { minWidth: '70px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral3">
      {!!item.totalFee ? (
        <SignedText
          isCompactNumber={!externalSource?.isExpanded}
          value={item.totalFee * -1}
          maxDigit={2}
          minDigit={2}
          prefix="$"
        />
      ) : (
        '--'
      )}
    </Type.Caption>
  ),
}

const pnlColumn: ColumnData<GroupedFillsData> = {
  title: 'PnL',
  dataIndex: 'totalPnl',
  key: 'totalPnl',
  style: { minWidth: '85px', textAlign: 'right', pr: 12 },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral3">
      {!!item.totalPnl ? (
        <SignedText
          isCompactNumber={!externalSource?.isExpanded}
          value={item.totalPnl}
          maxDigit={2}
          minDigit={2}
          prefix="$"
        />
      ) : (
        '--'
      )}
    </Type.Caption>
  ),
}

export const fullFillColumns: ColumnData<GroupedFillsData>[] = [
  timeColumn,
  { ...pairColumn, filterComponent: <OrderFilledPairFilterIcon /> },
  { ...directionColumn, filterComponent: <HLDirectionFilterIcon /> },
  { ...sizeTokenColumn, filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalSizeInToken} /> },
  { ...sizeUsdColumn, filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalSize} /> },
  fillsColumn,
  { ...priceColumn, filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.avgPrice} /> },
  { ...feeColumn, filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalFee} /> },
  {
    ...pnlColumn,
    style: { ...pnlColumn.style, minWidth: '100px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalPnl} />,
  },
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
  { ...pnlColumn, style: { ...pnlColumn.style, minWidth: '100px' } },
]
