import { HLTwapDirectionFilterIcon } from 'components/@position/HLTraderOpeningPositions/HLTwapDirectionFilterIcon'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText, RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { HlTwapOrderData } from 'entities/hyperliquid'
import useGlobalStore from 'hooks/store/useGlobalStore'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import OrderTwapPairFilterIcon from './OrderTwapPairFilterIcon'

// Time columns
const timeColumn: ColumnData<HlTwapOrderData> = {
  title: <TimeColumnTitleWrapper>Time</TimeColumnTitleWrapper>,
  dataIndex: 'timestamp',
  key: 'timestamp',
  sortBy: 'timestamp',
  style: { minWidth: '156px' },
  render: (item) => <TwapTime data={item} />,
}
function TwapTime({ data }: { data: HlTwapOrderData }) {
  const [positionTimeType, currentTime] = useGlobalStore((state) => [state.positionTimeType, state.currentTime])
  return positionTimeType === 'absolute' ? (
    <Box>
      <Box display={['none', 'none', 'none', 'block']}>{renderTwapBlockTime(data)}</Box>
      <Box display={['block', 'block', 'block', 'none']}>{renderTwapBlockTime(data, TIME_FORMAT)}</Box>
    </Box>
  ) : (
    <Flex color="neutral2" sx={{ alignItems: 'center', gap: 2 }}>
      <RelativeTimeText key={currentTime} date={data.timestamp} textStyle={{ fontSize: '12px' }} />
    </Flex>
  )
}

export const renderTwapBlockTime = (item: HlTwapOrderData, format = DAYJS_FULL_DATE_FORMAT) => (
  <Flex alignItems="center" sx={{ gap: 2 }}>
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.timestamp} format={format} hasTooltip={false} />
    </Type.Caption>
  </Flex>
)

const shortTimeColumn: ColumnData<HlTwapOrderData> = {
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

// Other columns
const pairColumn: ColumnData<HlTwapOrderData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  style: { minWidth: '75px' },
  render: (item) => <Type.Caption color="neutral1">{getSymbolFromPair(item.pair)}</Type.Caption>,
}
const directionColumn: ColumnData<HlTwapOrderData> = {
  title: 'Direction',
  dataIndex: 'isLong',
  key: 'isLong',
  style: { minWidth: '90px' },
  render: (item) => <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.direction}</Type.Caption>,
}
const valueColumn: ColumnData<HlTwapOrderData> = {
  title: 'Value',
  dataIndex: 'sizeNumber',
  key: 'sizeNumber',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {item.sizeNumber
        ? `$${externalSource?.isExpanded ? formatNumber(item.sizeNumber, 0, 0) : compactNumber(item.sizeNumber, 2)}`
        : '--'}
    </Type.Caption>
  ),
}
const sizeColumn: ColumnData<HlTwapOrderData> = {
  title: 'Size',
  dataIndex: 'sizeInTokenNumber',
  key: 'sizeInTokenNumber',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral1">
      {item.sizeInTokenNumber
        ? `${
            externalSource?.isExpanded
              ? formatNumber(item.sizeInTokenNumber, 2, 2)
              : compactNumber(item.sizeInTokenNumber, 2)
          }`
        : '--'}
    </Type.Caption>
  ),
}
const priceColumn: ColumnData<HlTwapOrderData> = {
  title: 'Price',
  dataIndex: 'priceNumber',
  key: 'priceNumber',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      {item.priceNumber ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 }) : '--'}
    </Type.Caption>
  ),
}
const feeColumn: ColumnData<HlTwapOrderData> = {
  title: 'Fee',
  dataIndex: 'fee',
  key: 'fee',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <>
      {!!item.fee ? (
        <SignedText
          value={item.fee}
          maxDigit={2}
          minDigit={2}
          prefix="$"
          isCompactNumber={!externalSource?.isExpanded}
          sx={{ color: 'neutral1', fontSize: '12px' }}
        />
      ) : (
        '--'
      )}
    </>
  ),
}
const pnlColumn: ColumnData<HlTwapOrderData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  style: { minWidth: '85px', textAlign: 'right' },
  render: (item, _, externalSource: any) => (
    <Type.Caption color="neutral3">
      {!!item.pnl ? (
        <SignedText
          isCompactNumber={!externalSource?.isExpanded}
          value={item.pnl}
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
const twapIdColumn: ColumnData<HlTwapOrderData> = {
  title: 'TWAP ID',
  dataIndex: 'twapOrderId',
  key: 'twapOrderId',
  style: { minWidth: '90px', textAlign: 'right', pr: 12 },
  render: (item) => <Type.Caption color="neutral1">#{item.twapOrderId}</Type.Caption>,
}
const startPositionColumn: ColumnData<HlTwapOrderData> = {
  title: 'Start Position',
  dataIndex: 'startPosition',
  key: 'startPosition',
  style: { minWidth: '150px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{item.startPosition}</Type.Caption>,
}

// Main columns
export const fullTwapColumns: ColumnData<HlTwapOrderData>[] = [
  timeColumn,
  { ...pairColumn, filterComponent: <OrderTwapPairFilterIcon /> },
  { ...directionColumn, filterComponent: <HLTwapDirectionFilterIcon /> },
  { ...startPositionColumn },
  { ...sizeColumn },
  { ...valueColumn },
  { ...priceColumn },
  { ...feeColumn },
  { ...pnlColumn },
  twapIdColumn,
]

export const twapColumns: ColumnData<HlTwapOrderData>[] = [
  shortTimeColumn,
  pairColumn,
  directionColumn,
  valueColumn,
  priceColumn,
  pnlColumn,
  twapIdColumn,
]

export const drawerTwapColumns: ColumnData<HlTwapOrderData>[] = [
  timeColumn,
  pairColumn,
  directionColumn,
  sizeColumn,
  valueColumn,
  priceColumn,
  feeColumn,
  pnlColumn,
  twapIdColumn,
]
