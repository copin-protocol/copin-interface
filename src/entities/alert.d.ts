import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'

export interface BotAlertData {
  id: string
  userId: string
  chatId?: string
  createdAt: string
}

export interface TraderAlertData {
  id: string
  address: string
  protocol: ProtocolEnum
  createdAt: string
}

export interface CopyTradeAlertData {
  copyTradeId: string
  exchange: CopyTradePlatformEnum
  protocol: ProtocolEnum
  createdAt: string
}

export interface BotAlertRequestData {
  copyTradeList?: CopyTradeAlertData[]
  traderList?: TraderAlertData[]
}
