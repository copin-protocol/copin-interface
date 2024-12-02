import { MarginModeEnum, PerpDEXTypeEnum, PositionModeEnum, ProtocolEnum } from 'utils/config/enums'

export interface PerpDEXSourceResponse extends PerpDEXStatistics {
  name: string
  perpdex: string
  protocols: ProtocolEnum[]
  chains: string[] | null
  type: PerpDEXTypeEnum[]
  marginModes: MarginModeEnum[]
  positionModes: PositionModeEnum[]
  runTime: string
  collateralAssets: string[]
  minCollateral: number
  pairs: string[]
  oneClickTrading: boolean
  token: string
  invested: number
  audit: string
  minTradingFee: number
  maxTradingFee: number
  makerFee: number
  takerFee: number
  borrowFee: number
  hasFundingFee: false
  rewards: 'Yes'
  createdAt: string
  updatedAt: string
  id: string
  statistic1dAt: string
  statistic7dAt: string
  statistic30dAt: string
  statisticAt: string
  lastData: Partial<PerpDEXStatistics>
  protocolInfos: ({
    protocol: ProtocolEnum
    lastData: PerpDEXStatistics
    perpdex: string
    pairs: string[]
    name: string
    chain: string
  } & PerpDEXStatistics)[]
  websiteUrl: string
  xUrl?: string
  telegramUrl?: string
  duneUrl?: string
  discordUrl?: string
  githubUrl?: string
  minLeverage: number
  maxLeverage: number
  statisticAt1d: string
  tradeUrl?: string
}

export interface PerpDEXStatistics {
  avgPositionDuration: number | null
  avgPositionSize: number | null
  liquidations: number | null
  longLiquidations: number | null
  longOi: number | null
  longPnl: number | null
  longRatio: number | null
  oi: number | null
  revenue: number | null
  shortLiquidations: number | null
  shortOi: number | null
  shortPnl: number | null
  traderPnl: number | null
  traders: number | null
  volume: number | null
  avgPositionDuration1d: number | null
  avgPositionSize1d: number | null
  liquidations1d: number | null
  longLiquidations1d: number | null
  longOi1d: number | null
  longPnl1d: number | null
  longRatio1d: number | null
  oi1d: number | null
  revenue1d: number | null
  shortLiquidations1d: number | null
  shortOi1d: number | null
  shortPnl1d: number | null
  traderPnl1d: number | null
  traders1d: number | null
  volume1d: number | null
  avgPositionDuration7d: number | null
  avgPositionSize7d: number | null
  liquidations7d: number | null
  longLiquidations7d: number | null
  longOi7d: number | null
  longPnl7d: number | null
  longRatio7d: number | null
  oi7d: number | null
  revenue7d: number | null
  shortLiquidations7d: number | null
  shortOi7d: number | null
  shortPnl7d: number | null
  traderPnl7d: number | null
  traders7d: number | null
  volume7d: number | null
  avgPositionDuration30d: number | null
  avgPositionSize30d: number | null
  liquidations30d: number | null
  longLiquidations30d: number | null
  longOi30d: number | null
  longPnl30d: number | null
  longRatio30d: number | null
  oi30d: number | null
  revenue30d: number | null
  shortLiquidations30d: number | null
  shortOi30d: number | null
  shortPnl30d: number | null
  traderPnl30d: number | null
  traders30d: number | null
  volume30d: number | null
  totalClosedPositionSize7d: number | null
  avgOpeningPositionSize7d: number | null
  avgClosedPositionSize: number | null
  totalOpeningPositionSize7d: number | null
  totalPositions7d: number | null
  avgClosedPositionSize7d: number | null
  totalPositions: number | null
  totalPositionSize: number | null
  avgOpeningPositionSize: number | null
  totalClosedPositions7d: number | null
  totalOrders7d: number | null
  totalPositionDuration7d: number | null
  totalPositionSize7d: number | null
  totalOpeningPositions7d: number | null
  totalClosedPositionSize1d: number | null
  totalPositionSize1d: number | null
  totalPositions1d: number | null
  totalOpeningPositionSize1d: number | null
  avgClosedPositionSize1d: number | null
  totalClosedPositions1d: number | null
  totalPositionDuration1d: number | null
  totalOpeningPositions1d: number | null
  avgOpeningPositionSize1d: number | null
  totalOrders1d: number | null
  avgOpeningPositionSize30d: number | null
  totalClosedPositions30d: number | null
  totalClosedPositionSize30d: number | null
  avgClosedPositionSize30d: number | null
  totalOpeningPositions30d: number | null
  totalPositionDuration30d: number | null
  totalOrders30d: number | null
  totalPositionSize30d: number | null
  totalOpeningPositionSize30d: number | null
  totalPositions30d: number | null
  totalClosedPositions: number | null
  totalOpeningPositions: number | null
  totalClosedPositionSize: number | null
  totalPositionDuration: number | null
  totalOpeningPositionSize: number | null
  totalOrders: number | null
  minReferralCommission: number | null
  maxReferralCommission: number | null
  volumeShare: number | null
  volumeShare1d: number | null
  volumeShare7d: number | null
  volumeShare30d: number | null
  feePerMillion: number | null
  feePerMillion1d: number | null
  feePerMillion7d: number | null
  feePerMillion30d: number | null
  averageFeeRate: number | null
  averageFeeRate1d: number | null
  averageFeeRate7d: number | null
  averageFeeRate30d: number | null
  openInterestShare: number | null
  openInterestShare1d: number | null
  openInterestShare7d: number | null
  openInterestShare30d: number | null
  openInterestToVolumeRatio: number | null
  openInterestToVolumeRatio1d: number | null
  openInterestToVolumeRatio7d: number | null
  openInterestToVolumeRatio30d: number | null
}

export interface PerpDEXEventResponse {
  id: string
  perpdexId: string
  perpdex: {
    perpdex: string
    name: string
  }
  title: string
  link: string
  banner?: string
  featuringScore: number
  isFeaturing: boolean
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
  protocol?: ProtocolEnum
  protocolName?: string
}

export interface ReportPerpDEXResponse {
  perpdex: string
  userId: string
  protocol?: ProtocolEnum
  description: string
  telegramAccount?: string
  createdAt: string
  updatedAt: string
}
