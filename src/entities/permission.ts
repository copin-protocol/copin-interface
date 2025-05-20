import { CopyTradePlatformEnum, ProtocolEnum, SubscriptionPermission, SubscriptionPlanEnum } from 'utils/config/enums'

import { OrderData, PositionData } from './trader'

export type PermissionData = {
  [SubscriptionPermission.TRADER_EXPLORER]: ExplorerPermission
  [SubscriptionPermission.TRADER_PROFILE]: TraderProfilePermission
  [SubscriptionPermission.TRADER_ALERT]: AlertPermission
  [SubscriptionPermission.COPY_TRADING]: CopyTradePermission
  [SubscriptionPermission.OPEN_INTEREST]: OIPermission
  [SubscriptionPermission.LIVE_TRADES]: LiveTradesPermission
  [SubscriptionPermission.PROTOCOL]: ProtocolPermission
  [SubscriptionPermission.PERP_EXPLORER]: PerpExplorerPermission
  [SubscriptionPermission.USER]: UserPermission
}

export type ProtocolPermission = {
  [key in SubscriptionPlanEnum]: ProtocolPermissionConfig
}

export type TraderProfilePermission = {
  [key in SubscriptionPlanEnum]: TraderProfilePermissionConfig
}

export type ExplorerPermission = {
  [plan in SubscriptionPlanEnum]: DataPermissionConfig
}

export type AlertPermission = {
  [plan in SubscriptionPlanEnum]: AlertPermissionConfig
}

export type CopyTradePermission = {
  [plan in SubscriptionPlanEnum]: CopyTradePermissionConfig
}

export type OIPermission = {
  [plan in SubscriptionPlanEnum]: OIPermissionConfig
}

export type LiveTradesPermission = {
  [plan in SubscriptionPlanEnum]: LiveTradesPermissionConfig
}

export type PerpExplorerPermission = {
  [plan in SubscriptionPlanEnum]: PerpExplorerPermissionConfig
}

export type UserPermission = {
  [plan in SubscriptionPlanEnum]: UserPermissionConfig
}

export interface DataPermissionConfig extends BasePermissionConfig {
  protocolAllowed: ProtocolEnum[]
  protocol: ProtocolEnum[]
  fieldsAllowed: string[]
  timeFramesAllowed: string[]
  isEnableLatestActivities: boolean
  isEnableRankingFilter: boolean
  isEnableCexDepth: boolean
  maxFilterFields: number
  exportExcelQuota: number
}

export interface AlertPermissionConfig extends BasePermissionConfig {
  watchedListQuota: number
  customPersonalQuota: number
  monthlyQuota: number
  webhookQuota: number
  channelQuota: number
  groupQuota: number
}

export interface CopyTradePermissionConfig extends BasePermissionConfig {
  exchangeAllowed: CopyTradePlatformEnum[]
  apiKeyQuota: number
  copyTradeQuota: number
  isEnableBulkAction: boolean
  isEnableMultiAccount: boolean
}

export interface LiveTradesPermissionConfig extends BasePermissionConfig {
  liveOrderDelaySeconds: number
  livePositionDelaySeconds: number
  orderFieldsAllowed: (keyof OrderData)[]
  positionFieldsAllowed: (keyof PositionData)[]
  isEnableLiveOrderFilter: boolean
  isEnableLivePositionFilter: boolean
}

export interface OIPermissionConfig extends BasePermissionConfig {
  fieldsAllowed: string[]
  allowedFilter: boolean
}
export interface ProtocolPermissionConfig extends BasePermissionConfig {
  protocolAllowed: ProtocolEnum[]
}
export interface PerpExplorerPermissionConfig extends BasePermissionConfig {
  fieldsAllowed: string[]
}

export interface TraderProfilePermissionConfig extends BasePermissionConfig {
  isEnableOpeningPosition: boolean
  isEnablePosition: boolean
  isEnableTokenStats: boolean
  isEnableTraderStats: boolean
  isEnableCompareTrader: boolean
  isEnableBackTest: boolean
  maxPositionHistory: number
  traderRankingFields: string[]
  timeFramesAllowed: string[]
}

interface BasePermissionConfig {
  isEnabled: boolean
}

export interface ProtocolPermissionConfig extends BasePermissionConfig {
  protocolAllowed: ProtocolEnum[]
}

export interface UserPermissionConfig extends BasePermissionConfig {
  allowedCustomReferralCode: boolean
}
