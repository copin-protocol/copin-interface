import { FillRangeFilterIcon } from 'components/@dailyTrades/FillRangeFilterIcon'
import { FILL_RANGE_KEYS } from 'components/@dailyTrades/configs'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText, RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { GroupedFillsData } from 'entities/hyperliquid'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
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

export function FillTime({ data }: { data: GroupedFillsData }) {
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
  render: (item) => renderPair(item),
}
export const renderPair = (item: GroupedFillsData) => (
  <Type.Caption color="neutral1">{getSymbolFromPair(item.pair)}</Type.Caption>
)

const directionColumn: ColumnData<GroupedFillsData> = {
  title: 'Direction',
  dataIndex: 'direction',
  key: 'direction',
  style: { minWidth: '70px' },
  render: (item) => renderDirection(item),
}
export const renderDirection = (item: GroupedFillsData) => (
  <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.direction}</Type.Caption>
)

const sizeUsdColumn: ColumnData<GroupedFillsData> = {
  title: 'Value',
  dataIndex: 'totalSize',
  key: 'totalSize',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item, _, externalSource: any) => renderSizeUsd(item, externalSource),
}
export const renderSizeUsd = (item: GroupedFillsData, externalSource?: any) => (
  <Type.Caption color="neutral1">
    {`$${externalSource?.isExpanded ? formatNumber(item.totalSize, 0) : compactNumber(item.totalSize, 2)}`}
  </Type.Caption>
)

const sizeTokenColumn: ColumnData<GroupedFillsData> = {
  title: 'Size',
  dataIndex: 'totalSizeInToken',
  key: 'totalSizeInToken',
  style: { minWidth: '85px', textAlign: 'right' },
  render: (item, _, externalSource: any) => renderSizeToken(item, externalSource),
}
export const renderSizeToken = (item: GroupedFillsData, externalSource?: any) => (
  <Type.Caption color="neutral1">
    {`${
      externalSource?.isExpanded ? formatNumber(item.totalSizeInToken, 2, 2) : compactNumber(item.totalSizeInToken, 2)
    }`}
  </Type.Caption>
)

const fillsColumn: ColumnData<GroupedFillsData> = {
  title: 'Fill Count',
  dataIndex: 'fills',
  key: 'fills',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => renderFills(item),
}
export const renderFills = (item: GroupedFillsData) => (
  <Type.Caption color="neutral1">{item.fills.length} fills</Type.Caption>
)

const priceColumn: ColumnData<GroupedFillsData> = {
  title: 'Avg. Price',
  dataIndex: 'avgPrice',
  key: 'avgPrice',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => renderPrice(item),
}
export const renderPrice = (item: GroupedFillsData) => {
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(item.pair)
  return (
    <Type.Caption color="neutral1">
      {PriceTokenText({ value: item.avgPrice, maxDigit: 2, minDigit: 2, hlDecimals })}
    </Type.Caption>
  )
}

const feeColumn: ColumnData<GroupedFillsData> = {
  title: 'Fee',
  dataIndex: 'totalFee',
  key: 'totalFee',
  style: { minWidth: '70px', textAlign: 'right' },
  render: (item, _, externalSource: any) => renderFees(item, externalSource),
}
export const renderFees = (item: GroupedFillsData, externalSource?: any) => (
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
)

const pnlColumn: ColumnData<GroupedFillsData> = {
  title: 'PnL',
  dataIndex: 'totalPnl',
  key: 'totalPnl',
  style: { minWidth: '85px', textAlign: 'right', pr: 12 },
  render: (item, _, externalSource: any) => renderPnl(item, externalSource),
}
export const renderPnl = (item: GroupedFillsData, externalSource?: any) => (
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
)

export const fullFillColumns: ColumnData<GroupedFillsData>[] = [
  { ...timeColumn, style: { ...timeColumn.style, minWidth: '150px' } },
  { ...pairColumn, style: { ...pairColumn.style, minWidth: '150px' }, filterComponent: <OrderFilledPairFilterIcon /> },
  {
    ...directionColumn,
    style: { ...directionColumn.style, minWidth: '150px' },
    filterComponent: <HLDirectionFilterIcon />,
  },
  {
    ...priceColumn,
    style: { ...priceColumn.style, minWidth: '150px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.avgPrice} />,
  },
  {
    ...sizeTokenColumn,
    style: { ...sizeTokenColumn.style, minWidth: '150px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalSizeInToken} />,
  },
  {
    ...sizeUsdColumn,
    style: { ...sizeUsdColumn.style, minWidth: '150px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalSize} />,
  },
  fillsColumn,
  {
    ...feeColumn,
    style: { ...feeColumn.style, minWidth: '150px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalFee} />,
  },
  {
    ...pnlColumn,
    style: { ...pnlColumn.style, minWidth: '150px' },
    filterComponent: <FillRangeFilterIcon valueKey={FILL_RANGE_KEYS.totalPnl} />,
  },
]

export const fillColumns: ColumnData<GroupedFillsData>[] = [
  shortTimeColumn,
  pairColumn,
  directionColumn,
  priceColumn,
  sizeUsdColumn,
  pnlColumn,
]

export const drawerFillColumns: ColumnData<GroupedFillsData>[] = [
  timeColumn,
  pairColumn,
  directionColumn,
  priceColumn,
  sizeTokenColumn,
  sizeUsdColumn,
  fillsColumn,
  feeColumn,
  { ...pnlColumn, style: { ...pnlColumn.style, minWidth: '100px' } },
]
