export interface SystemConfigData {
  createdAt: string
}

export interface ListenerStatsData {
  [key: string]: ListenerBlockData
}

export interface ListenerBlockData {
  gnsArbLatestRawDataBlock: number
  gnsArbLatestOrderBlock: number
  gnsArbLatestPositionBlock: number
  gmxV1ArbLatestOrderBlock: number
  gmxV1ArbLatestPositionBlock: number
  gmxV2ArbLatestOrderBlock: number
  gmxV2ArbLatestPositionBlock: number
  synthetixOpLatestRawDataBlock: number
  synthetixOpLatestOrderBlock: number
}

export interface VolumeLimitData {
  volumeWoReferral: number
  volumeReferral: number
  volumePremiumWoReferral: number
  volumePremiumReferral: number
  volumeVipWoReferral: number
  volumeVipReferral: number
}
