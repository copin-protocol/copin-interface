import { CaretRight } from '@phosphor-icons/react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { renderEntry, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import SkullIcon from 'theme/Icons/SkullIcon'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { formatNumber } from 'utils/helpers/format'

export type ExternalSourceHlPosition = {
  totalPositionValue?: number
  submitting?: boolean
  currentId?: string
  handleClosePosition?: (data: PositionData) => void
  handleSelectPosition?: (data: PositionData) => void
}

export const collateralColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Collateral',
  dataIndex: 'collateral',
  key: 'collateral',
  sortBy: 'collateral',
  style: { minWidth: '100px', textAlign: 'right' },
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
export const fundingColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
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

export const roiColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'ROI',
  dataIndex: 'roi',
  key: 'roi',
  sortBy: 'roi',
  style: { minWidth: '90px', textAlign: 'right' },
  render: renderPositionRoi,
}

export const entryColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Entry',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { minWidth: '115px' },
  render: (item) => renderEntry(item),
}

export const sizeOpeningColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Value',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { width: '215px' },
  render: (item) => renderSizeOpening(item),
}

export const pnlColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'PnL',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderPositionPnL({ item }),
}
const renderPositionPnL = ({
  item,
  prefix = '$',
  isCompactNumber = false,
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
        value={item.pnl}
        component={
          <SignedText value={item.pnl} maxDigit={2} minDigit={2} prefix={prefix} isCompactNumber={isCompactNumber} />
        }
      />
    </Flex>
  )
}

export const weightColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Weight',
  key: undefined,
  sortBy: 'size',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource) => renderPositionWeight(item, externalSource?.totalPositionValue),
}
const renderPositionWeight = (item: PositionData, totalPositionValue?: number) => {
  const weightPercent = totalPositionValue ? (item.size / totalPositionValue) * 100 : 0
  return <Type.Caption color="neutral1">{formatNumber(weightPercent, 2, 2)}%</Type.Caption>
}

const actionColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
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

export const fullOpeningColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...entryColumn, style: { minWidth: 150 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  weightColumn,
  collateralColumn,
  fundingColumn,
  roiColumn,
  { ...pnlColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]

export const openingColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...entryColumn, style: { minWidth: 185 } },
  sizeOpeningColumn,
  {
    ...pnlColumn,
    render: (item) => renderPositionPnL({ item, isCompactNumber: true }),
  },
  actionColumn,
]

export const drawerOpeningColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...entryColumn, style: { minWidth: 170 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  weightColumn,
  collateralColumn,
  fundingColumn,
  roiColumn,
  { ...pnlColumn, style: { minWidth: 100, textAlign: 'right' } },
  actionColumn,
]
