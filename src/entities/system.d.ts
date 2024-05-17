export interface SystemConfigData {
  createdAt: string
}

export interface ListenerStatsData {
  [key: string]: ListenerBlockData
}

export interface ListenerBlockData {
  gnsPolyLatestRawDataBlock: number
  gnsPolyLatestOrderBlock: number
  gnsPolyLatestPositionBlock: number
  gnsArbLatestRawDataBlock: number
  gnsArbLatestOrderBlock: number
  gnsArbLatestPositionBlock: number
  gmxV1ArbLatestOrderBlock: number
  gmxV1ArbLatestPositionBlock: number
  gmxV2ArbLatestOrderBlock: number
  gmxV2ArbLatestPositionBlock: number
  muxArbLatestRawDataBlock: number
  muxArbLatestOrderBlock: number
  muxArbLatestPositionBlock: number
  equationArbLatestRawDataBlock: number
  equationArbLatestOrderBlock: number
  equationArbLatestPositionBlock: number
  levelArbLatestRawDataBlock: number
  levelArbLatestOrderBlock: number
  levelArbLatestPositionBlock: number
  levelBnbLatestRawDataBlock: number
  levelBnbLatestOrderBlock: number
  levelBnbLatestPositionBlock: number
  synthetixOpLatestRawDataBlock: number
  synthetixOpLatestOrderBlock: number
}

export interface FormattedListenerStatsData {
  [key: string]: FormattedListenerBlockData
}

export interface FormattedListenerBlockData {
  protocol?: string
  [key: string]: number | undefined | null
}

export interface VolumeLimitData {
  volumeWoReferral: number
  volumeReferral: number
  volumePremiumWoReferral: number
  volumePremiumReferral: number
  volumeVipWoReferral: number
  volumeVipReferral: number
}
