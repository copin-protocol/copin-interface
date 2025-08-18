import { Trans } from '@lingui/macro'
import { CaretRight, ClockCounterClockwise } from '@phosphor-icons/react'

import { PositionPairFilterIcon } from 'components/@dailyTrades/PositionPairFilterIcon'
import { PositionRangeFilterIcon } from 'components/@dailyTrades/PositionRangeFilterIcon'
import { PositionStatusFilterIcon } from 'components/@dailyTrades/PositionStatusFilterIcon'
import { POSITION_RANGE_KEYS } from 'components/@dailyTrades/configs'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { DualTimeText, LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { PairFilterIcon } from 'components/@widgets/PairFilterIcon'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import TimeColumnTitleWrapper from 'components/@widgets/TimeColumeTitleWrapper'
import { renderEntry, renderOpeningPnL, renderOpeningRoi, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useGlobalStore from 'hooks/store/useGlobalStore'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import SkullIcon from 'theme/Icons/SkullIcon'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { PROTOCOLS_IN_TOKEN } from 'utils/config/protocols'
import { compactNumber, formatDuration, formatLeverage, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

const orderCountColumn: ColumnData<PositionData> = {
  title: 'Orders',
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
      hasPrefix={true}
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
      indexToken={item.fee == null && item.feeInToken != null ? item.collateralToken : undefined}
      value={item.fee != null ? item.fee * -1 : undefined}
      valueInToken={item.feeInToken != null ? item.feeInToken * -1 : undefined}
      component={
        <SignedText
          value={item.fee == null && item.feeInToken == null ? undefined : (item.fee ?? item.feeInToken) * -1}
          maxDigit={2}
          minDigit={2}
          prefix={'$'}
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

const RenderPositionRoi = ({ item }: { item: PositionData }) => {
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const value = pnlWithFeeEnabled ? item.roi : item.realisedRoi

  return (
    <Type.Caption color="neutral1">
      <SignedText value={value} maxDigit={2} minDigit={2} suffix="%" />
    </Type.Caption>
  )
}

const roiColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => <RenderPositionRoi item={item} />,
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
  style: { minWidth: '45px' },
  render: (item) => (
    <Type.Caption color="neutral3">
      <RelativeShortTimeText date={item.openBlockTime} />
    </Type.Caption>
  ),
}
const openDualTimeColumn: ColumnData<PositionData> = {
  title: 'Open Time',
  dataIndex: 'openBlockTime',
  key: 'openBlockTime',
  sortBy: 'openBlockTime',
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <DualTimeText date={item.openBlockTime} />
    </Type.Caption>
  ),
}
const closeDualTimeColumn: ColumnData<PositionData> = {
  title: 'Close Time',
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  sortBy: 'closeBlockTime',
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <DualTimeText date={item.closeBlockTime} />
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
  title: <TimeColumnTitleWrapper>Time</TimeColumnTitleWrapper>,
  dataIndex: 'closeBlockTime',
  key: 'closeBlockTime',
  style: { minWidth: '90px' },
  render: (item) => <PositionTime data={item} />,
}

function PositionTime({ data }: { data: PositionData }) {
  const [positionTimeType, currentTime] = useGlobalStore((state) => [state.positionTimeType, state.currentTime])
  return (
    <Type.Caption color="neutral3">
      {positionTimeType === 'absolute' ? (
        <LocalTimeText date={data.closeBlockTime} />
      ) : (
        <RelativeShortTimeText key={currentTime} date={data.closeBlockTime} suffix="ago" />
      )}
    </Type.Caption>
  )
}
//Filter market by pair
export function getEntryColumn(
  pairs: string[],
  excludedPairs: string[],
  changePairs: (...args: any[]) => void
): ColumnData<PositionData> {
  return {
    title: 'Entry',
    dataIndex: 'averagePrice',
    key: 'averagePrice',
    sortBy: 'averagePrice',
    style: { flex: 1, minWidth: 170 },
    render: (item) => renderEntry(item),
    filterComponent: <PairFilterIcon pairs={pairs} excludedPairs={excludedPairs} changePairs={changePairs} />,
  }
}
const entryColumn: ColumnData<PositionData> = {
  title: 'Entry',
  dataIndex: 'pair',
  key: 'pair',
  sortBy: 'averagePrice',
  style: { minWidth: '115px' },
  render: (item) => renderEntry(item),
}
const sizeColumn: ColumnData<PositionData> = {
  title: 'Value',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => renderPositionSize({ item }),
}
const renderPositionSize = ({
  item,
  hasPrefix = true,
  isCompactNumber = false,
}: {
  item: PositionData
  hasPrefix?: boolean
  isCompactNumber?: boolean
}) => (
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
        `${hasPrefix ? '$' : ''}${isCompactNumber ? compactNumber(item.size, 2) : formatNumber(item.size, 0, 0)}`
      )}
    </Type.Caption>
  </Flex>
)
const sizeOpeningColumn: ColumnData<PositionData> = {
  title: 'Value',
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

const pnlColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return <PnlValueCell item={item} isCompactNumber={false} />
  },
}
//Pnl with fee - Apply with close position
const PnlValueCell = ({ item, isCompactNumber = false }: { item: PositionData; isCompactNumber: boolean }) => {
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const pnlValue = pnlWithFeeEnabled ? item.pnl : item.realisedPnl

  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
      {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
      <ValueOrToken
        protocol={item.protocol}
        indexToken={item.realisedPnl == null && item.realisedPnlInToken != null ? item.collateralToken : undefined}
        value={pnlValue}
        valueInToken={item.realisedPnlInToken}
        component={
          <SignedText
            value={pnlValue ?? item.realisedPnlInToken}
            maxDigit={2}
            minDigit={2}
            prefix="$"
            isCompactNumber={isCompactNumber}
          />
        }
      />
    </Flex>
  )
}
// Pnl without fee - Apply with opening position
const renderPositionPnL = ({
  item,
  prefix = '$',
  isCompactNumber,
}: {
  item: PositionData
  prefix?: string
  isCompactNumber?: boolean
}) => {
  return <PositionPnLCell item={item} prefix={prefix} isCompactNumber={isCompactNumber} />
}
const PositionPnLCell = ({
  item,
  prefix = '$',
  isCompactNumber,
}: {
  item: PositionData
  prefix?: string
  isCompactNumber?: boolean
}) => {
  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
      {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
      <ValueOrToken
        protocol={item.protocol}
        indexToken={item.realisedPnl == null ? item.collateralToken : undefined}
        value={item.realisedPnl}
        valueInToken={item.realisedPnlInToken}
        hasPrefix={item.realisedPnl != null}
        component={
          <SignedText
            value={item.realisedPnl ?? item.realisedPnlInToken}
            maxDigit={2}
            minDigit={2}
            prefix={prefix}
            isCompactNumber={isCompactNumber}
          />
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
    <Box sx={{ position: 'relative' }}>
      <CaretRight color={themeColors.neutral3} size={12} />
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
        <Type.Caption color="inherit">{isOpen ? `OPEN` : 'CLOSE'}</Type.Caption>
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
        <AccountInfo address={item.account} protocol={item.protocol} avatarSize={24} textSx={{ color: 'neutral1' }} />
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
  key: 'openBlockTime',
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
  { ...timeColumn, style: { minWidth: 80, flex: 1 } },
  { ...entryColumn, style: { flex: 1.8, minWidth: 170 } },
  {
    ...sizeColumn,
    style: { minWidth: 60, flex: 1, textAlign: 'right', justifyContent: 'end' },
    render: (item) => renderPositionSize({ item, isCompactNumber: true }),
  },
  { ...leverageColumn, style: { minWidth: 60, flex: 0.8, textAlign: 'right', justifyContent: 'end' } },
  {
    ...pnlColumn,
    style: { minWidth: 70, flex: 1.4, textAlign: 'right', justifyContent: 'end' },
    render: (item) => <PnlValueCell item={item} isCompactNumber={true} />,
  },
  { ...actionColumn, style: { width: 24, pr: 1, textAlign: 'right', justifyContent: 'end', flex: '0 0 24px' } },
]

export const fullHistoryColumns: ColumnData<PositionData>[] = [
  { ...openTimeColumn, style: { flex: 1.5 } },
  { ...closeTimeColumn, style: { flex: 1.5, pl: 2 } },
  {
    ...sizeColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.size} />,
  },
  {
    ...leverageColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.leverage} />,
  },
  {
    ...collateralColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.collateral} />,
  },
  { ...avgDurationColumn, style: { flex: 1, textAlign: 'right', justifyContent: 'end' } },
  { ...orderCountColumn, style: { flex: 0.7, textAlign: 'right', justifyContent: 'end' } },
  {
    ...feeColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.fee} />,
  },
  {
    ...roiColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedRoi} />,
  },
  {
    ...pnlColumn,
    style: { flex: 1.3, textAlign: 'right', justifyContent: 'end' },
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedPnl} />,
  },
  { ...actionColumn, style: { width: 40, pr: 2, textAlign: 'right', justifyContent: 'end', flex: '0 0 40px' } },
]

export const dailyPositionColumns: ColumnData<PositionData>[] = [
  {
    ...positionTimeColumn,
    title: <Trans>TIME</Trans>,
    style: { flex: 1, display: ['flex', 'flex', 'flex', 'none'] },
  },
  {
    ...openTimeColumn,
    title: <Trans>OPEN TIME</Trans>,
    style: { flex: 1.5, display: ['none', 'none', 'none', 'flex'] },
    text: 'Open Time',
  },
  {
    ...closeTimeColumn,
    title: <Trans>CLOSE TIME</Trans>,
    style: { flex: 1.5, pl: 2, display: ['none', 'none', 'none', 'flex'], text: 'Close Time' },
  },
  // {
  //   ...pairColumn,
  //   style: { flex: 1, pl: 1, '@media all and (min-width: 1400px)': { display: 'none' } },
  //   title: <PositionPairFilterTitle />,
  //   sortBy: undefined,
  //   hasFilter: true,
  // },
  {
    ...positionStatusColumn,
    style: { flex: 0.8 },
    title: <Trans>STATUS</Trans>,
    filterComponent: <PositionStatusFilterIcon />,
  },
  { ...accountColumn, title: <Trans>ACCOUNT</Trans>, style: { flex: [2, 2, 2, 2, 1.7] } },
  {
    ...entryColumn,
    style: { flex: [1.3, 1.3, 1.8, 1.3], pl: 1 },
    title: <Trans>MARKET</Trans>,
    filterComponent: <PositionPairFilterIcon />,
    sortBy: undefined,
  },
  {
    ...sizeColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    title: <Trans>VALUE</Trans>,
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.size} />,
    text: 'Size',
    render: (item) => renderPositionSize({ item, hasPrefix: true }),
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
    filterComponent: <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.leverage} />,
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
    title: <Trans>COLLATERAL</Trans>,
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
    style: {
      flex: 1,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1800px)': { display: 'flex' },
      justifyContent: 'end',
    },
    sortBy: undefined,
  },
  {
    ...feeColumn,
    title: <Trans>FEE</Trans>,
    style: {
      flex: 1,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1800px)': { display: 'flex' },
      justifyContent: 'end',
    },
    sortBy: undefined,
    render: (item) => renderPositionFee(item, ''),
  },
  {
    ...roiColumn,
    style: {
      flex: 0.8,
      textAlign: 'right',
      display: 'none',
      '@media all and (min-width: 1800px)': { display: 'flex', justifyContent: 'end' },
    },
    title: <Trans>ROI</Trans>,
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedRoi} />
    ),
    text: 'ROI',
    render: (item) =>
      item.status === PositionStatusEnum.OPEN ? renderOpeningRoi(item) : <RenderPositionRoi item={item} />,
  },
  {
    dataIndex: 'pnl',
    key: 'pnl',
    style: { flex: 1.1, textAlign: 'right', justifyContent: 'end' },
    title: (
      <Trans>
        <PnlTitle />
      </Trans>
    ),
    filterComponent: (
      //@ts-ignore
      <PositionRangeFilterIcon valueKey={POSITION_RANGE_KEYS.realisedPnl} />
    ),
    text: 'PnL',
    render: (item) => {
      return item.status === PositionStatusEnum.OPEN ? renderOpeningPnL(item) : renderPositionPnL({ item, prefix: '$' })
    },
  },
  // { ...mixPnLColumn, style: { flex: 1, display: ['block', 'block', 'none', 'none'] } },
  { ...actionColumn, style: { width: 40, pr: 2, textAlign: 'right', flex: '0 0 40px' } },
]

export const fullOpeningColumns: ColumnData<PositionData>[] = [
  openTimeColumn,
  { ...entryColumn, style: { minWidth: 170 } },
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
  { ...entryColumn, style: { minWidth: 180 } },
  { ...sizeOpeningColumn, style: { minWidth: 190 } },
  { ...pnlOpeningColumn, style: { minWidth: 80, textAlign: 'right' } },
  actionColumn,
]

export const minimumOpeningColums: ColumnData<PositionData>[] = [entryColumn, sizeOpeningColumn, pnlOpeningColumn]

export const drawerHistoryColumns: ColumnData<PositionData>[] = [
  { ...openTimeColumn, style: { flex: 1.5 } },
  { ...closeTimeColumn, style: { flex: 1.5, pl: 2 } },
  { ...entryColumn, style: { minWidth: 185, flex: 1.5, pl: 2 } },
  {
    ...sizeColumn,
    style: { flex: 1, textAlign: 'right', justifyContent: 'end' },
    render: (item) => renderPositionSize({ item, isCompactNumber: true }),
  },
  { ...leverageColumn, style: { flex: 1, textAlign: 'right', justifyContent: 'end' } },
  { ...collateralColumn, style: { flex: 1.2, textAlign: 'right', justifyContent: 'end' } },
  { ...avgDurationColumn, style: { flex: 1, textAlign: 'right', justifyContent: 'end' } },
  {
    ...pnlColumn,
    style: { flex: 1.3, textAlign: 'right', justifyContent: 'end' },
    render: (item) => renderPositionPnL({ item, isCompactNumber: true }),
  },
  { ...actionColumn, style: { width: 40, pr: 2, textAlign: 'right', justifyContent: 'end', flex: '0 0 40px' } },
]

export const xlHistoryColumns: ColumnData<PositionData>[] = [
  { ...openTimeColumn, style: { minWidth: 140, flex: 1.5 } },
  { ...closeTimeColumn, style: { minWidth: 140, flex: 1.5, pl: 2 } },
  { ...entryColumn, style: { minWidth: 170, flex: 1.5, pl: 2 } },
  {
    ...sizeColumn,
    style: { minWidth: 80, flex: 1, textAlign: 'right', justifyContent: 'end' },
    render: (item) => renderPositionSize({ item, isCompactNumber: true }),
  },
  { ...leverageColumn, style: { minWidth: 80, flex: 1, textAlign: 'right', justifyContent: 'end' } },
  { ...collateralColumn, style: { minWidth: 80, flex: 1.2, textAlign: 'right', justifyContent: 'end' } },
  { ...avgDurationColumn, style: { minWidth: 60, flex: 1, textAlign: 'right', justifyContent: 'end' } },
  {
    ...pnlColumn,
    style: { minWidth: 80, flex: 1.3, textAlign: 'right', justifyContent: 'end' },
    render: (item) => renderPositionPnL({ item, isCompactNumber: true }),
  },
  { ...actionColumn, style: { width: 24, pr: 2, textAlign: 'right', justifyContent: 'end', flex: '0 0 40px' } },
]

export const drawerOpeningColumns: ColumnData<PositionData>[] = [
  openTimeColumn,
  { ...entryColumn, style: { minWidth: 180 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  collateralColumn,
  avgDurationColumn,
  { ...pnlOpeningColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]

export const vaultHistoryColumns: ColumnData<PositionData>[] = [
  openDualTimeColumn,
  closeDualTimeColumn,
  entryColumn,
  sizeColumn,
  leverageColumn,
  collateralColumn,
  avgDurationColumn,
  orderCountColumn,
  feeColumn,
  roiColumn,
  pnlColumn,
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
