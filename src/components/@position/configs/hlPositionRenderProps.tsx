import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { renderEntry, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import SkullIcon from 'theme/Icons/SkullIcon'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { MarginModeEnum } from 'utils/config/enums'
import { PROTOCOLS_IN_TOKEN } from 'utils/config/protocols'
import { overflowEllipsis } from 'utils/helpers/css'
import { compactNumber, formatNumber, formatPrice } from 'utils/helpers/format'
import { formatSymbol, getSymbolFromPair } from 'utils/helpers/transform'
import { UsdPrices } from 'utils/types'

export type ExternalSourceHlPosition = {
  prices?: UsdPrices
  totalPositionValue?: number
  isExpanded?: boolean
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
  style: { minWidth: '130px', textAlign: 'right' },
  render: (item, _, externalSource) => renderPositionCollateral({ item, isCompactNumber: !externalSource?.isExpanded }),
}
export const renderPositionCollateral = ({
  item,
  defaultToken,
  isCompactNumber = false,
}: {
  item: PositionData
  defaultToken?: string
  isCompactNumber?: boolean
}) => {
  return (
    <Type.Caption color="neutral1">
      <ValueOrToken
        protocol={item.protocol}
        indexToken={item.collateralToken}
        value={item.collateral}
        valueInToken={item.collateralInToken}
        hasCompact={isCompactNumber}
        defaultToken={defaultToken}
        maxDigit={isCompactNumber ? 2 : undefined}
        minDigit={isCompactNumber ? 2 : undefined}
      />
      <Type.Small pl={1}>({item.marginMode === MarginModeEnum.CROSS ? 'Cross' : 'Isolated'})</Type.Small>
    </Type.Caption>
  )
}
export const fundingColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Funding',
  dataIndex: 'funding',
  key: 'funding',
  sortBy: 'funding',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource) => renderPositionFunding({ item, isCompactNumber: !externalSource?.isExpanded }),
}

export const renderPositionFunding = ({
  item,
  prefix = '$',
  isCompactNumber = false,
}: {
  item: PositionData
  prefix?: string
  isCompactNumber?: boolean
}) => (
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
          isCompactNumber={isCompactNumber}
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
  render: (item, _, externalSource) => renderPositionPnL({ item, isCompactNumber: !externalSource?.isExpanded }),
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

export const pairColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Pair',
  dataIndex: 'pair',
  key: 'pair',
  sortBy: 'pair',
  style: { minWidth: '125px' },
  render: (item) => <PairComponent data={item} />,
}
export function PairComponent({ data }: { data: PositionData }) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbol = data.pair
    ? getSymbolFromPair(data.pair)
    : data.indexToken
    ? getSymbolByIndexToken?.({ indexToken: data.indexToken }) ?? ''
    : ''
  return (
    <Flex
      sx={{
        gap: 2,
        alignItems: 'center',
        color: 'neutral1',
        pr: 1,
      }}
    >
      <Type.Caption color={data.isLong ? 'green1' : 'red2'} data-key="isLong">
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption data-key="pair">
        <Box as="span" sx={{ display: 'block', width: '100%', ...overflowEllipsis() }}>
          {formatSymbol(symbol)}
        </Box>
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption data-key="leverage">{formatNumber(data.leverage, 0, 0)}x</Type.Caption>
    </Flex>
  )
}

export const entryPriceColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Entry Price',
  dataIndex: 'averagePrice',
  key: 'averagePrice',
  sortBy: 'averagePrice',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderEntryPrice(item),
}
export const renderEntryPrice = (item: PositionData) => {
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(item.pair)

  return (
    <Type.Caption color="neutral1" sx={{ flexShrink: 0 } as any} data-key="averagePrice">
      {item.averagePrice ? PriceTokenText({ value: item.averagePrice, maxDigit: 2, minDigit: 2, hlDecimals }) : '--'}
    </Type.Caption>
  )
}

export const liquidPriceColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Liq. Price',
  dataIndex: 'liquidationPrice',
  key: 'liquidationPrice',
  sortBy: 'liquidationPrice',
  style: { minWidth: '90px', textAlign: 'right' },
  render: (item) => renderLiquidPrice(item),
}
export const renderLiquidPrice = (item: PositionData) => {
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(item.pair)

  return (
    <Type.Caption color="neutral1" sx={{ flexShrink: 0 } as any} data-key="liquidationPrice">
      {item.liquidationPrice
        ? PriceTokenText({ value: item.liquidationPrice, maxDigit: 2, minDigit: 2, hlDecimals })
        : '--'}
    </Type.Caption>
  )
}

export const valueColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Value (Weight)',
  dataIndex: 'size',
  key: 'size',
  sortBy: 'size',
  style: { minWidth: '105px', textAlign: 'right' },
  render: (item, _, externalSource) => renderValue(item, externalSource?.totalPositionValue),
}
export const renderValue = (item: PositionData, totalPositionValue?: number) => {
  const sizeNumber = item.size
  const weightPercent = totalPositionValue ? (sizeNumber / totalPositionValue) * 100 : 0
  return (
    <Type.Caption color="neutral1">
      {PROTOCOLS_IN_TOKEN.includes(item.protocol) ? (
        <ValueOrToken
          protocol={item.protocol}
          value={sizeNumber}
          valueInToken={item.sizeInToken}
          indexToken={item.collateralToken}
          hasCompact={sizeNumber >= 100_100 || (item.sizeInToken ?? 0) >= 100_000}
          hasPrefix={false}
        />
      ) : (
        <Type.Caption>${compactNumber(sizeNumber, 2)}</Type.Caption>
      )}
      {!!totalPositionValue && <Type.Small pl={1}>({formatNumber(weightPercent, 2, 2)}%)</Type.Small>}
    </Type.Caption>
  )
}

export const pnlWithRoiColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'PnL (ROI)',
  dataIndex: 'pnl',
  key: 'pnl',
  sortBy: 'pnl',
  style: { minWidth: '150px', textAlign: 'right' },
  render: (item, _, externalSource) => renderPnLWithRoi({ item, isCompactNumber: !externalSource?.isExpanded }),
}
export const renderPnLWithRoi = ({
  item,
  prefix = '$',
  isCompactNumber = false,
  sx,
}: {
  item: PositionData
  prefix?: string
  isCompactNumber?: boolean
  sx?: any
}) => {
  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1, flexWrap: 'wrap', ...sx }}>
      {item.isLiquidate && <IconBox sx={{ pl: 1 }} icon={<SkullIcon />} />}
      <ValueOrToken
        protocol={item.protocol}
        value={item.pnl}
        component={
          <SignedText value={item.pnl} maxDigit={2} minDigit={2} prefix={prefix} isCompactNumber={isCompactNumber} />
        }
      />
      <Type.Small color="neutral3">
        (
        <SignedText value={item.roi} maxDigit={2} minDigit={2} suffix="%" fontInherit />)
      </Type.Small>
    </Flex>
  )
}

export const weightColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Weight',
  key: undefined,
  sortBy: 'size',
  style: { minWidth: '80px', textAlign: 'right' },
  render: (item, _, externalSource) => renderPositionWeight(item, externalSource?.totalPositionValue),
}
const renderPositionWeight = (item: PositionData, totalPositionValue?: number) => {
  const weightPercent = totalPositionValue ? (item.size / totalPositionValue) * 100 : 0
  return <Type.Caption color="neutral1">{formatNumber(weightPercent, 2, 2)}%</Type.Caption>
}

export const sizeInTokenColumn: ColumnData<PositionData> = {
  title: 'Size',
  dataIndex: 'totalSizeInToken',
  key: 'totalSizeInToken',
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item) => renderSizeInToken(item),
}
export const renderSizeInToken = (item: PositionData) => {
  return <Type.Caption color="neutral1">{compactNumber(item.sizeInToken, 2)}</Type.Caption>
}

export const markPriceColumn: ColumnData<PositionData, ExternalSourceHlPosition> = {
  title: 'Mark Price',
  key: undefined,
  style: { minWidth: '100px', textAlign: 'right' },
  render: (item, _, externalSource) => renderMarkPrice(item, externalSource?.prices),
}
export const renderMarkPrice = (item: PositionData, prices?: UsdPrices) => {
  const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
  const hlDecimals = getHlSzDecimalsByPair?.(item.pair)

  return (
    <Type.Caption color="neutral1">
      {prices ? formatPrice(prices[getSymbolFromPair(item.pair)], 2, 2, { hlDecimals }) : '--'}
    </Type.Caption>
  )
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
  { ...pairColumn, style: { minWidth: 120 } },
  { ...sizeInTokenColumn, style: { minWidth: 100, textAlign: 'right' } },
  { ...valueColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...entryPriceColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...markPriceColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...liquidPriceColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...collateralColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...fundingColumn, style: { minWidth: 140, textAlign: 'right' } },
  { ...pnlWithRoiColumn, style: { minWidth: 140, textAlign: 'right' } },
  actionColumn,
]

export const openingColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...entryColumn, style: { minWidth: 185 } },
  { ...sizeOpeningColumn, style: { minWidth: 200 } },
  {
    ...pnlColumn,
    style: { minWidth: 80, textAlign: 'right' },
    render: (item) => renderPositionPnL({ item, isCompactNumber: true }),
  },
  actionColumn,
]

export const drawerOpeningColumns: ColumnData<PositionData, ExternalSourceHlPosition>[] = [
  { ...pairColumn, style: { minWidth: 140 } },
  // { ...sizeInTokenColumn, style: { minWidth: 60, textAlign: 'right' } },
  { ...valueColumn, style: { minWidth: 120, textAlign: 'right' } },
  { ...entryPriceColumn, style: { minWidth: 100, textAlign: 'right' } },
  { ...markPriceColumn, style: { minWidth: 85, textAlign: 'right' } },
  { ...liquidPriceColumn, style: { minWidth: 100, textAlign: 'right' } },
  collateralColumn,
  { ...fundingColumn, style: { minWidth: 80, textAlign: 'right' } },
  { ...pnlWithRoiColumn, style: { minWidth: 140, textAlign: 'right' } },
  actionColumn,
]
