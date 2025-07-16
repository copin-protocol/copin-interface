import { ProtocolEnum } from 'utils/config/enums'

export type LayoutProps = {
  protocolStats?: JSX.Element
  traderInfo?: JSX.Element
  traderStatsSummary?: JSX.Element
  traderStats?: JSX.Element
  traderRanking?: JSX.Element
  traderChartPnl?: JSX.Element
  traderChartPositions?: JSX.Element
  heatmap?: JSX.Element
  openingPositions?: JSX.Element
  closedPositions?: JSX.Element
  hyperliquidApiMode?: JSX.Element
  hlPerformance?: JSX.Element
  hlChartPnl?: JSX.Element
  hlOverview?: JSX.Element
  hlPortfolio?: JSX.Element
  openingPositionFullExpanded?: boolean
  positionFullExpanded?: boolean
  chartFullExpanded?: boolean
  apiMode?: boolean
  protocol?: ProtocolEnum
  address?: string
}
