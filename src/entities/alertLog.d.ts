import { AlertTypeEnum, ChannelTypeEnum, CopyTradePlatformEnum, OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'

export interface AlertLogData {
  userId: string
  name: string
  username: string
  channelName?: string
  alertChannel: ChannelTypeEnum
  alertType: AlertTypeEnum
  data: AlertLogDetailData
  isSuccess: boolean
  errorMsg?: string
  createdAt: string
  updatedAt: string
}

export interface AlertLogDetailData {
  chatId: string
  userId: string
  name: string
  account: string
  protocol: ProtocolEnum
  alertType: AlertTypeEnum
  type: OrderTypeEnum
  exchange: CopyTradePlatformEnum
  walletName: string
  channelName: string
  activityLogId: string
  positionId: string
  token: string
  leverage: string
  volume: number
  pnl: number
  roi: number
  price: number
  isLong: boolean
  isReverse: boolean
  isSuccess: boolean
  isProcessing: boolean
  isNeedUpgrade?: boolean
  errorMsg?: string
  alertTag: string
  userRef: string
  copyTradeTitle?: string
  webhookUrl: string
  time: string
}
