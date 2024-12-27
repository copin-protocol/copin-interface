import { CaretRight } from '@phosphor-icons/react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { renderEntry, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import SkullIcon from 'theme/Icons/SkullIcon'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

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
const fundingColumn: ColumnData<PositionData> = {
  title: 'Funding',
  dataIndex: 'funding',
  key: 'funding',
  sortBy: 'funding',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPositionFunding(item),
}

const renderPositionFunding = (item: PositionData, prefix = '$') => (
  <Type.Caption color="neutral1">
    <ValueOrToken
      protocol={item.protocol}
      indexToken={item.funding == null && item.fundingInToken != null ? item.collateralToken : undefined}
      value={item.funding}
      valueInToken={item.fundingInToken}
      component={
        <SignedText
          value={
            item.funding == null && item.fundingInToken == null ? undefined : (item.funding ?? item.fundingInToken) * -1
          }
          maxDigit={2}
          minDigit={2}
          prefix={prefix}
        />
      }
    />
  </Type.Caption>
)

const renderPositionRoi = (item: PositionData) => (
  <Type.Caption color="neutral1">
    <SignedText value={item.roi} maxDigit={2} minDigit={2} suffix="%" />
  </Type.Caption>
)

const roiColumn: ColumnData<PositionData> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: renderPositionRoi,
}

const entryColumn: ColumnData<PositionData> = {
  title: 'Entry',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { minWidth: '115px' },
  render: (item) => renderEntry(item),
}

const sizeOpeningColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { width: '215px' },
  render: (item) => renderSizeOpening(item),
}

const pnlColumn: ColumnData<PositionData> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPositionPnL(item),
}
const renderPositionPnL = (item: PositionData, prefix = '$') => {
  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1 }}>
      {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
      <ValueOrToken
        protocol={item.protocol}
        value={item.pnl}
        component={<SignedText value={item.pnl} maxDigit={2} minDigit={2} prefix={prefix} />}
      />
    </Flex>
  )
}

const actionColumn: ColumnData<PositionData> = {
  title: ' ',
  dataIndex: 'id',
  key: 'id',
  style: { width: '40px', textAlign: 'right', flex: '0 0 40px' },
  render: () => (
    <Box sx={{ position: 'relative', top: '4px' }}>
      <CaretRight color={themeColors.neutral3} size={16} />
    </Box>
  ),
}

export const fullOpeningColumns: ColumnData<PositionData>[] = [
  { ...entryColumn, style: { minWidth: 150 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  collateralColumn,
  fundingColumn,
  roiColumn,
  { ...pnlColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]

export const openingColumns: ColumnData<PositionData>[] = [
  { ...entryColumn, style: { minWidth: 185 } },
  sizeOpeningColumn,
  pnlColumn,
  actionColumn,
]

export const drawerOpeningColumns: ColumnData<PositionData>[] = [
  { ...entryColumn, style: { minWidth: 150 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  collateralColumn,
  fundingColumn,
  roiColumn,
  { ...pnlColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]
