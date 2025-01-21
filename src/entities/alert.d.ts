import { AlertTypeEnum, CopyTradePlatformEnum, ProtocolEnum, TelegramTypeEnum } from 'utils/config/enums'

export interface BotAlertData {
  id: string
  userId: string
  chatId?: string
  name?: string
  type?: AlertTypeEnum
  telegramType?: TelegramTypeEnum
  isRunning?: boolean
  lastMessageAt?: string
  createdAt: string
}

export interface TraderAlertData {
  id: string
  address: string
  account?: string
  protocol: ProtocolEnum
  title?: string
  trade24h?: number
  trade30D?: number
  realisedPnl30D?: number
  pnl30D?: number
  status?: string
  lastTradeAt?: string
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
