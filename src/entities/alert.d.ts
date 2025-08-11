import { QueryFilter, RangeFilter } from 'apis/types'
import { CustomTraderData } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/types'
import {
  AlertCategoryEnum,
  AlertCustomType,
  AlertTypeEnum,
  ChannelStatusEnum,
  ChannelTypeEnum,
  CopyTradePlatformEnum,
  ProtocolEnum,
  TimeFilterByEnum,
} from 'utils/config/enums'

export interface BotAlertData {
  id: string
  userId: string
  chatId?: string
  name?: string
  description?: string
  category: AlertCategoryEnum
  alertType?: AlertTypeEnum
  type?: AlertCustomType
  channels?: AlertSettingData[]
  config?: CustomAlertConfigData
  enableAlert?: boolean
  showAlert?: boolean
  lastMessageAt?: string
  createdAt: string
}

export interface AlertSettingData {
  id: string
  userId: string
  chatId?: string
  webhookUrl?: string
  name?: string
  description?: string
  type: AlertTypeEnum
  channelType?: ChannelTypeEnum
  status?: ChannelStatusEnum
  config?: CustomAlertConfigData
  isPause?: boolean
  createdAt: string
}

export interface TraderAlertData {
  id?: string
  address: string
  account?: string
  protocol: ProtocolEnum
  title?: string
  trade24h?: number
  trade30D?: number
  realisedPnl30D?: number
  pnl30D?: number
  enableAlert?: boolean
  lastTradeAt?: string
  createdAt?: string
  label?: string
  isAlertEnabled?: boolean
}

export interface CopyTradeAlertData {
  copyTradeId: string
  exchange: CopyTradePlatformEnum
  protocol: ProtocolEnum
  createdAt: string
}

export interface ChannelAlertRequestData {
  isPause?: boolean
  name?: string
  webhookUrl?: string
}

export interface CustomAlertRequestData {
  name?: string
  description?: string
  queries?: QueryFilter[]
  ranges?: RangeFilter[]
  enableAlert?: boolean
  showAlert?: boolean
  type?: AlertCustomType
  traderGroup?: TraderGroupRequestData
}

export interface CustomAlertConfigData {
  type?: TimeFilterByEnum

  [key: string]: CustomAlertConfigField
}

export type CustomAlertConfigField = {
  gte?: number
  lte?: number
  in?: string[]
}

export interface TraderGroupRequestData {
  upsert?: CustomTraderData[]
  remove?: CustomTraderData[]
}
