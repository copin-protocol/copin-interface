import { Trans } from '@lingui/macro'
import { CaretRight, ClockCounterClockwise } from '@phosphor-icons/react'

import { PositionPairFilterTitle } from 'components/@dailyTrades/PositionPairFilterTitle'
import { PositionRangeFilterIcon } from 'components/@dailyTrades/PositionRangeFilterIcon'
import { PositionStatusFilterTitle } from 'components/@dailyTrades/PositionStatusFilterTitle'
import { POSITION_RANGE_KEYS } from 'components/@dailyTrades/configs'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import TraderAddress from 'components/@ui/TraderAddress'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { renderEntry, renderOpeningPnL, renderOpeningRoi, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import SkullIcon from 'theme/Icons/SkullIcon'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { PROTOCOLS_IN_TOKEN } from 'utils/config/protocols'
import { formatDuration, formatLeverage, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

const orderCountColumn: ColumnData<PositionData> = {
  title: 'Total Orders',
  dataIndex: 'orderCount',
  key: 'orderCount',
  sortBy: 'orderCount',
  style: { minWidth: '100px', textAlign: 'right', flex: 1 },
  render: (item) => <Type.Caption color="neutral1">{item.orderCount}</Type.Caption>,
}

const collateralColumn: ColumnData<PositionData> = {
  title: 'Collateral',
  dataIndex: 'collateral',
  key: 'collateral',
  sortBy: 'collateral',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => renderPositionCollateral(item),
}
const renderPositionCollateral = (item: PositionData, defaultToken?: string) => (
  <Type.Caption color="neutral1">
    <ValueOrToken
      protocol={item.protocol}
      indexToken={item.collateralToken}
      value={item.collateral}
      valueInToken={item.collateralInToken}
      defaultToken={defaultToken}
    />
  </Type.Caption>
)
const feeColumn: ColumnData<PositionData> = {
  title: 'Fee',
  dataIndex: 'fee',
  key: 'fee',
  sortBy: 'fee',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPositionFee(item),
}

const renderPositionFee = (item: PositionData, prefix = '$') => (
  <Type.Caption color="neutral1">
    <ValueOrToken
      protocol={item.protocol}
      indexToken={item.collateralToken}
      value={item.fee != null ? item.fee * -1 : undefined}
      valueInToken={item.feeInToken != null ? item.feeInToken * -1 : undefined}
      component={
        <SignedText
          value={item.fee == null && item.feeInToken == null ? undefined : (item.fee ?? item.feeInToken) * -1}
          maxDigit={2}
          minDigit={2}
          prefix={prefix}
        />
      }
    />
  </Type.Caption>
)
const avgDurationColumn: ColumnData<PositionData> = {
  title: 'Duration',
  dataIndex: 'durationInSecond',
  key: 'durationInSecond',
  sortBy: 'durationInSecond',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{formatDuration(item.durationInSecond)}</Type.Caption>,
}

const renderPositionRoi = (item: PositionData) => (
  <Type.Caption color="neutral1">
    <SignedText value={item.realisedRoi} maxDigit={2} minDigit={2} suffix="%" />
  </Type.Caption>
)

const roiColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'realisedRoi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: renderPositionRoi,
}
const openTimeColumn: ColumnData<PositionData> = {
  title: 'Open Time',
  dataIndex: 'openBlockTime',
  key: 'openBlockTime',
  sortBy: 'openBlockTime',
  style: { minWidth: '156px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.openBlockTime} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
    </Type.Caption>
  ),
}
const openTimeShortColumn: ColumnData<PositionData> = {
  title: 'Time',
  dataIndex: 'openBlockTime',
  key: 'openBlockTime',
  style: { width: '45px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      <RelativeShortTimeText date={item.openBlockTime} />
    </Type.Caption>
  ),
}
const closeTimeColumn: ColumnData<PositionData> = {
  title: 'Close Time',
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  sortBy: 'closeBlockTime',
  style: { minWidth: '156px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      {item.status !== PositionStatusEnum.OPEN && item.closeBlockTime ? (
        <LocalTimeText date={item.closeBlockTime} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
      ) : (
        '--'
      )}
    </Type.Caption>
  ),
}
const timeColumn: ColumnData<PositionData> = {
  title: 'Time',
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  style: { minWidth: '90px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      <LocalTimeText date={item.closeBlockTime} />
    </Type.Caption>
  ),
}
const entryColumn: ColumnData<PositionData> = {
  title: 'Entry',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { minWidth: '115px' },
  render: (item) => renderEntry(item),
}
const sizeColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => renderPositionSize(item),
}
const renderPositionSize = (item: PositionData, hasPrefix = true) => (
  <Flex justifyContent="end" alignItems="center">
    <Type.Caption color="neutral1">
      {PROTOCOLS_IN_TOKEN.includes(item.protocol) ? (
        <ValueOrToken
          protocol={item.protocol}
          indexToken={item.collateralToken}
          value={item.size}
          valueInToken={item.sizeInToken}
        />
      ) : (
        `${hasPrefix ? '$' : ''}${formatNumber(item.size, 0, 0)}`
      )}
    </Type.Caption>
  </Flex>
)
const sizeOpeningColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { width: '215px' },
  render: (item) => renderSizeOpening(item),
}
const leverageColumn: ColumnData<PositionData> = {
  title: 'Leverage',
  dataIndex: 'leverage',
  key: 'leverage',
  sortBy: 'leverage',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => (
    <Flex justifyContent="end" alignItems="center">
      <Type.Caption color="neutral1">{formatLeverage(item.marginMode, item.leverage)}</Type.Caption>
    </Flex>
  ),
}
const pnlColumnFull: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'realisedPnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
        {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
        <ValueOrToken
          protocol={item.protocol}
          indexToken={item.collateralToken}
          value={item.realisedPnl}
          valueInToken={item.realisedPnlInToken}
          component={
            <SignedText value={item.realisedPnl ?? item.realisedPnlInToken} maxDigit={2} minDigit={2} prefix="$" />
          }
        />
      </Flex>
    )
  },
}
const pnlColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPositionPnL(item),
}
const renderPositionPnL = (item: PositionData, prefix = '$') => {
  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
      {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
      <ValueOrToken
        protocol={item.protocol}
        indexToken={item.collateralToken}
        value={item.realisedPnl}
        valueInToken={item.realisedPnlInToken}
        component={
          <SignedText value={item.realisedPnl ?? item.realisedPnlInToken} maxDigit={2} minDigit={2} prefix={prefix} />
        }
      />
    </Flex>
  )
}

const pnlOpeningColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'realisedPnl',
  style: { width: '75px', textAlign: 'right' },
  render: (item) => renderOpeningPnL(item),
}
const roiOpeningColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'realisedRoi',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => renderOpeningRoi(item),
}
const actionColumn: ColumnData<PositionData> = {
  title: ' ',
  dataIndex: 'id',
  key: 'id',
  style: { width: '40px', textAlign: 'right', flex: '0 0 40px' },
  render: () => (
    <Box sx={{ position: 'relative', top: '2px' }}>
      <CaretRight />
    </Box>
  ),
}

const positionStatusColumn: ColumnData<PositionData> = {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => {
    const isOpen = item.status === PositionStatusEnum.OPEN
    const isLong = item.isLong
    return (
      <Box
        sx={{
          color: isOpen ? 'green1' : 'neutral2',
        }}
      >
        <Type.Caption color="inherit">{isOpen ? `Open` : 'Close'}</Type.Caption>
      </Box>
    )
  },
}
const accountColumn: ColumnData<PositionData> = {
  title: 'Account',
  dataIndex: 'account',
  key: 'account',
  style: { minWidth: '75px' },
  render: (item) => {
    return (
      <Flex sx={{ width: '100%', '& > *': { width: 'max-content' } }}>
        <TraderAddress address={item.account} protocol={item.protocol} />
      </Flex>
    )
  },
}
const pairColumn: ColumnData<PositionData> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => {
    return <Market symbol={getSymbolFromPair(item.pair)} hasName sx={{ '& *': { fontSize: '12px !important' } }} />
  },
}
const positionTimeColumn: ColumnData<PositionData> = {
  title: 'Time',
  dataIndex: undefined,
  key: undefined,
  style: {},
  render: (item) => {
    return (
      <Type.Caption sx={{ display: 'flex', flexDirection: 'column' }}>
        {item.status !== PositionStatusEnum.OPEN && item.closeBlockTime ? (
          <LocalTimeText date={item.closeBlockTime} format={TIME_FORMAT} />
        ) : (
          '--'
        )}
        <Box as="span" color="neutral3">
          <LocalTimeText date={item.openBlockTime} format={TIME_FORMAT} />
        </Box>
      </Type.Caption>
    )
  },
}
const mixPnLColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: undefined,
  key: undefined,
  style: { textAlign: 'right' },
  render: (item) => {
    return (
      <Type.Caption sx={{ display: 'flex', flexDirection: 'column' }}>
        <>
          {pnlColumn.render?.(item)}
          <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
            {roiColumn.render?.(item)}
          </Flex>
        </>
      </Type.Caption>
    )
  },
}

export const historyColumns: ColumnData<PositionData>[] = [
  { ...timeColumn, style: { flex: 1 } },
  { ...entryColumn, style: { flex: 1.8 } },
  { ...sizeColumn, style: { flex: 1, textAlign: 'right' } },
  { ...leverageColumn, style: { flex: 0.8, textAlign: 'right' } },
  { ...pnlColumn, style: { flex: 1.4, textAlign: 'right' } },
  { ...actionColumn, style: { width: 24, pr: 1, textAlign: 'right', flex: '0 0 24px' } },
]
export const fullHistoryColumns: ColumnData<PositionData>[] = [
  { ...openTimeColumn, style: { flex: 1.5 } },
  { ...closeTimeColumn, style: { flex: 1.5, pl: 2 } },
  { ...entryColumn, style: { flex: 1.5, pl: 2 } },
  { ...sizeColumn, style: { flex: 1, textAlign: 'right' } },
  { ...leverageColumn, style: { flex: 1, textAlign: 'right' } },
  { ...collateralColumn, style: { flex: 1, textAlign: 'right' } },
  { ...avgDurationColumn, style: { flex: 1, textAlign: 'right' } },
  { ...orderCountColumn, style: { flex: 1, textAlign: 'right' } },
  { ...feeColumn, style: { flex: 1, textAlign: 'right' } },
  { ...roiColumn, style: { flex: 1, textAlign: 'right' } },
  { ...pnlColumnFull, style: { flex: 1.3, textAlign: 'right' } },
  { ...actionColumn, style: { width: 40, pr: 2, textAlign: 'right', flex: '0 0 40px' } },
]

export const dailyPositionColumns: ColumnData<PositionData>[] = [
  {
    ...positionTimeColumn,
    title: <Trans>TIME</Trans>,
    style: { flex: 1, display: ['block', 'block', 'block', 'none'] },
  },
  {
    ...openTimeColumn,
    title: <Trans>OPEN TIME</Trans>,
    style: { flex: 1.5, display: ['none', 'none', 'none', 'block'] },
    text: 'Open Time',
  },
  {
    ...closeTimeColumn,
    title: <Trans>CLOSE TIME</Trans>,
    style: { flex: 1.5, pl: 2, display: ['none', 'none', 'none', 'block'], text: 'Close Time' },
  },
  // {
  //   ...pairColumn,
  //   style: { flex: 1, pl: 1, '@media all and (min-width: 1400px)': { display: 'none' } },
  //   title: <PositionPairFilterTitle />,
  //   sortBy: undefined,
  //   hasFilter: true,
  // },
  { ...positionStatusColumn, style: { flex: 0.8 }, title: <PositionStatusFilterTitle /> },
  { ...accountColumn, title: <Trans>ACCOUNT</Trans>, style: { flex: [2, 2, 2, 2, 1.7] } },
  {
    ...entryColumn,
    style: { flex: [1.3, 1.3, 1.8, 1.3], pl: 1 },
    title: <PositionPairFilterTitle title={<Trans>MARKET</Trans>} />,
    sortBy: undefined,
  },
  {
    ...sizeColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    title: <Trans>SIZE ($)</Trans>,
    filterComponent: (
      // @ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.size} />
    ),
    text: 'Size',
    render: (item) => renderPositionSize(item, false),
  },
  {
    ...leverageColumn,
    style: {
      flex: 1,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1400px)': { display: 'flex' },
      justifyContent: 'end',
    },
    title: <Trans>LEVERAGE</Trans>,
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.leverage} />
    ),
    text: 'Leverage',
  },
  {
    ...collateralColumn,
    style: {
      flex: 1.3,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1400px)': { display: 'flex' },
      justifyContent: 'end',
    },
    title: <Trans>COLLATERAL ($)</Trans>,
    filterComponent: (
      <PositionRangeFilterIcon
        //@ts-ignore
        valueKey={POSITION_RANGE_KEYS.collateral}
      />
    ),
    text: 'Collateral',
    render: (item) => renderPositionCollateral(item, 'USDT'),
  },
  {
    ...avgDurationColumn,
    style: {
      flex: 1,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1400px)': { display: 'flex' },
      justifyContent: 'end',
    },
    title: <Trans>DURATION</Trans>,
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.durationInSecond} />
    ),
    text: 'Duration',
  },
  {
    ...orderCountColumn,
    title: <Trans>TOTAL ORDER</Trans>,
    style: { flex: 1, textAlign: 'right', display: 'none', '@media all and (min-width: 1800px)': { display: 'block' } },
    sortBy: undefined,
  },
  {
    ...feeColumn,
    title: <Trans>FEE ($)</Trans>,
    style: { flex: 1, textAlign: 'right', display: 'none', '@media all and (min-width: 1800px)': { display: 'block' } },
    sortBy: undefined,
    render: (item) => renderPositionFee(item, ''),
  },
  {
    ...roiColumn,
    style: {
      flex: 0.8,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1800px)': { display: 'flex', width: '100%', justifyContent: 'end' },
    },
    title: <Trans>ROI</Trans>,
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedRoi} />
    ),
    text: 'ROI',
    render: (item) => (item.status === PositionStatusEnum.OPEN ? renderOpeningRoi(item) : renderPositionRoi(item)),
  },
  {
    dataIndex: 'pnl',
    key: 'pnl',
    style: { flex: 1.1, textAlign: 'right', justifyContent: 'end' },
    title: <Trans>PNL ($)</Trans>,
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedPnl} />
    ),
    text: 'PnL',
    render: (item) => {
      return item.status === PositionStatusEnum.OPEN ? renderOpeningPnL(item) : renderPositionPnL(item, '')
    },
  },
  // { ...mixPnLColumn, style: { flex: 1, display: ['block', 'block', 'none', 'none'] } },
  { ...actionColumn, style: { width: 40, pr: 2, textAlign: 'right', flex: '0 0 40px' } },
]

export const fullOpeningColumns: ColumnData<PositionData>[] = [
  openTimeColumn,
  { ...entryColumn, style: { minWidth: 150 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  collateralColumn,
  avgDurationColumn,
  orderCountColumn,
  feeColumn,
  roiOpeningColumn,
  { ...pnlOpeningColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]

export const openingColumns: ColumnData<PositionData>[] = [
  openTimeShortColumn,
  entryColumn,
  sizeOpeningColumn,
  pnlOpeningColumn,
  actionColumn,
]

export function ShortDuration({ durationInSecond }: { durationInSecond?: number }) {
  return (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <IconBox icon={<ClockCounterClockwise size={16} />} color="neutral3" />
      <Type.Caption color="neutral1">{formatDuration(durationInSecond)}</Type.Caption>
    </Flex>
  )
}
