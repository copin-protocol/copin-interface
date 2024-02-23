import { CaretRight } from '@phosphor-icons/react'
import React from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import {
  renderEntry,
  renderOpeningPnLWithPrices,
  renderOpeningRoiWithPrices,
  renderSizeOpening,
} from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import { PositionData } from 'entities/trader'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import SkullIcon from 'theme/Icons/SkullIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { formatDuration, formatNumber } from 'utils/helpers/format'

export type ExternalSource = {
  prices: UsdPrices
}

const orderCountColumn: ColumnData<PositionData> = {
  title: 'Total Orders',
  dataIndex: 'orderCount',
  key: 'orderCount',
  sortBy: 'orderCount',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{item.orderCount}</Type.Caption>,
}
// const orderIncreaseCountColumn: ColumnData<PositionData> = {
//   title: 'Increase Order',
//   dataIndex: 'orderIncreaseCount',
//   key: 'orderIncreaseCount',
//   style: { minWidth: '100px', textAlign: 'right' },
//   render: (item) => <Type.Caption color="neutral1">{formatNumber(item.orderIncreaseCount, 0)}</Type.Caption>,
// }
// const orderDecreaseCountColumn: ColumnData<PositionData> = {
//   title: 'Decrease Order',
//   dataIndex: 'orderDecreaseCount',
//   key: 'orderDecreaseCount',
//   style: { minWidth: '100px', textAlign: 'right' },
//   render: (item) => <Type.Caption color="neutral1">{formatNumber(item.orderDecreaseCount, 0)}</Type.Caption>,
// }
const collateralColumn: ColumnData<PositionData> = {
  title: 'Collateral',
  dataIndex: 'collateral',
  key: 'collateral',
  sortBy: 'collateral',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">${formatNumber(item.collateral, 0)}</Type.Caption>,
}
const feeColumn: ColumnData<PositionData> = {
  title: 'Fee',
  dataIndex: 'fee',
  key: 'fee',
  sortBy: 'fee',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <SignedText value={-item.fee} maxDigit={1} minDigit={1} />
    </Type.Caption>
  ),
}
const avgDurationColumn: ColumnData<PositionData> = {
  title: 'Duration',
  dataIndex: 'durationInSecond',
  key: 'durationInSecond',
  sortBy: 'durationInSecond',
  style: { minWidth: '110px', textAlign: 'right' },
  render: (item) => <Type.Caption color="neutral1">{formatDuration(item.durationInSecond)}</Type.Caption>,
}
const roiColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <SignedText value={item.roi} maxDigit={2} minDigit={2} suffix="%" />
    </Type.Caption>
  ),
}
const openTimeColumn: ColumnData<PositionData> = {
  title: 'Open Time',
  dataIndex: 'openBlockTime',
  key: 'openBlockTime',
  sortBy: 'openBlockTime',
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.openBlockTime} />
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
  style: { minWidth: '100px' },
  render: (item) => (
    <Type.Caption color="neutral1">
      <LocalTimeText date={item.closeBlockTime} />
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
  style: { minWidth: '140px' },
  render: (item) => renderEntry(item),
}
const sizeColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item) => (
    <Flex justifyContent="end" alignItems="center">
      <Type.Caption color="neutral1">${formatNumber(item.size, 0, 0)}</Type.Caption>
    </Flex>
  ),
}
const sizeOpeningColumn: ColumnData<PositionData, ExternalSource> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { width: '205px' },
  render: (item, index, externalSource) =>
    externalSource?.prices ? renderSizeOpening(item, externalSource?.prices) : '--',
}
const leverageColumn: ColumnData<PositionData> = {
  title: 'Leverage',
  dataIndex: 'leverage',
  key: 'leverage',
  sortBy: 'leverage',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item) => (
    <Flex justifyContent="end" alignItems="center">
      <Type.Caption color="neutral1">{formatNumber(item.leverage, 1, 1)}x</Type.Caption>
    </Flex>
  ),
}
const pnlColumnFull: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
        {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
        {SignedText({
          value: item.pnl,
          maxDigit: 1,
          minDigit: 1,
          sx: { textAlign: 'right' },
        })}
      </Flex>
    )
  },
}
const pnlColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => {
    return (
      <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
        {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
        {SignedText({
          value: item.pnl,
          maxDigit: 1,
          minDigit: 1,
          sx: { textAlign: 'right' },
        })}
      </Flex>
    )
  },
}
// const pnlWFeeColumn: ColumnData<PositionData> = {
//   title: 'Closed PnL',
//   dataIndex: undefined,
//   key: undefined,
//   style: { minWidth: '100px', textAlign: 'right' },
//   render: (item) => {
//     return (
//       <Flex alignItems="center" sx={{ gap: '1px' }}>
//         {(item.isLiquidate || item.roi <= -100) && <IconBox sx={{ pl: '2px' }} icon={<SkullIcon />} />}
//         {SignedText({
//           value: item.realisedPnl - item.fee,
//           maxDigit: 1,
//           minDigit: 1,
//           sx: { textAlign: 'right', width: '100%' },
//         })}
//       </Flex>
//     )
//   },
// }
const pnlOpeningColumn: ColumnData<PositionData, ExternalSource> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { width: '75px', textAlign: 'right' },
  render: (item, index, externalSource) =>
    externalSource?.prices ? renderOpeningPnLWithPrices(item, externalSource?.prices, true) : '--',
}
const roiOpeningColumn: ColumnData<PositionData, ExternalSource> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '75px', textAlign: 'right' },
  render: (item, index, externalSource) =>
    externalSource?.prices ? renderOpeningRoiWithPrices(item, externalSource?.prices, true) : '--',
}
const actionColumn: ColumnData<PositionData> = {
  title: ' ',
  dataIndex: 'id',
  key: 'id',
  style: { minWidth: '20px', textAlign: 'right' },
  render: () => (
    <Box sx={{ position: 'relative', top: '2px' }}>
      <CaretRight />
    </Box>
  ),
}

export const historyColumns: ColumnData<PositionData>[] = [
  timeColumn,
  entryColumn,
  sizeColumn,
  leverageColumn,
  pnlColumn,
  actionColumn,
]
export const fullHistoryColumns: ColumnData<PositionData>[] = [
  openTimeColumn,
  closeTimeColumn,
  entryColumn,
  sizeColumn,
  leverageColumn,
  collateralColumn,
  avgDurationColumn,
  orderCountColumn,
  feeColumn,
  roiColumn,
  pnlColumnFull,
  // pnlWFeeColumn,
  // orderIncreaseCountColumn,
  // orderDecreaseCountColumn,
  actionColumn,
]

export const fullOpeningColumns: ColumnData<PositionData, ExternalSource>[] = [
  openTimeColumn,
  entryColumn,
  sizeOpeningColumn,
  collateralColumn,
  avgDurationColumn,
  orderCountColumn,
  feeColumn,
  roiOpeningColumn,
  pnlOpeningColumn,
  actionColumn,
]

export const openingColumns: ColumnData<PositionData, ExternalSource>[] = [
  openTimeShortColumn,
  entryColumn,
  sizeOpeningColumn,
  pnlOpeningColumn,
  actionColumn,
]
