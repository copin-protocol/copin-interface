import { CopyTradePlatformEnum, ProtocolEnum, SystemStatusPageEnum } from 'utils/config/enums'

export interface SystemConfigData {
  copyTradeVolumeConfig: VolumeLimitData
  systemAlert: SystemAlert[]
  planSubscriptionLimitConfig: PlanLimitData[]
}
export interface ListenerStatsData {
  arb: {
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
    mirrorSignalGnsLastBlock: number
    mirrorSignalLevelArbLastBlock: number
    velaArbLatestRawDataBlock: number
    velaArbLatestOrderBlock: number
    velaArbLatestPositionBlock: number
    hmxArbLatestRawDataBlock: number
    hmxArbLatestOrderBlock: number
    hmxArbLatestPositionBlock: number
    myxArbLatestRawDataBlock: number
    myxArbLatestOrderBlock: number
    myxArbLatestPositionBlock: number
    yfxArbLatestRawDataBlock: number
    yfxArbLatestOrderBlock: number
    yfxArbLatestPositionBlock: number
  }
  op: {
    synthetixOpLatestRawDataBlock: number
    synthetixOpLatestOrderBlock: number
    mirrorSignalSnxLastBlock: number
  }
  poly: {
    gnsPolyLatestRawDataBlock: number
    gnsPolyLatestOrderBlock: number
    gnsPolyLatestPositionBlock: number
  }
  bnb: {
    levelBnbLatestRawDataBlock: number
    levelBnbLatestOrderBlock: number
    levelBnbLatestPositionBlock: number
    apolloxBnbLatestRawDataBlock: number
    apolloxBnbLatestOrderBlock: number
    apolloxBnbLatestPositionBlock: number
    mirrorSignalLevelBnbLastBlock: number
  }
  opbnb: {
    kiloexOpBnbLatestRawDataBlock: number
    kiloexOpBnbLatestOrderBlock: number
    kiloexOpBnbLatestPositionBlock: number
  }
  base: {
    avantisBaseLatestRawDataBlock: number
    avantisBaseLatestOrderBlock: number
    avantisBaseLatestPositionBlock: number
    synthetixV3LatestRawDataBlock: number
    synthetixV3LatestOrderBlock: number
    synthetixV3LatestPositionBlock: number
  }
  mantle: {
    ktxMantleLatestRawDataBlock: number
    ktxMantleLatestOrderBlock: number
    ktxMantleLatestPositionBlock: number
  }
  scroll: {
    rollieScrollLatestRawDataBlock: number
    rollieScrollLatestOrderBlock: number
    rollieScrollLatestPositionBlock: number
  }
  blast: {
    logxBlastLatestRawDataBlock: number
    logxBlastLatestOrderBlock: number
    logxBlastLatestPositionBlock: number
  }
  mode: {
    logxModeLatestRawDataBlock: number
    logxModeLatestOrderBlock: number
    logxModeLatestPositionBlock: number
  }
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
  // volumeReferral: number
  // volumePremiumWoReferral: number
  volumePremiumReferral: number
  // volumeVipWoReferral: number
  volumeVipReferral: number
}

export interface SubscriptionLimitData {
  [plan: number]: PlanLimitData
}

export interface PlanLimitData {
  id: string
  customPercentileRank: boolean
  dataFilterDay: number
  copyTrades: number
  maxCopySizePerTrader: number
  maxCopyTradePerTrader: number
  joinCopinAlphaClub: boolean
  traderAlerts: number
  customAlerts: number
  channelAlerts: number
  webhookAlerts: number
  plan: number
  createdAt: string
}

export interface SystemAlertData {
  isActive: boolean
  message: Record<string, string>
  section: SystemAlertSectionEnum
  type: SystemAlertTypeEnum
  sectionData?: Record<string, string>
}

export interface SystemStatusData {
  feature: ProtocolEnum | CopyTradePlatformEnum | SystemStatusPageEnum
  status?: SystemStatusTypeEnum // use for common
  dataStatus?: SystemStatusTypeEnum // use for protocol
  copyTradeStatus?: SystemStatusTypeEnum // use for protocol
  alertStatus?: SystemStatusTypeEnum // use for protocol
  note: string
}
