import { CopyTradeConfigTypeEnum, CopyTradePlatformEnum } from 'utils/config/enums'

export interface RequestCopyTradeConfigData {
  maxPositions?: number
  type?: CopyTradeConfigTypeEnum
  exchange?: CopyTradePlatformEnum
  apiKey?: string
}

export interface CopyTradeConfigData {
  id: string
  userId: string
  type: CopyTradeConfigTypeEnum
  exchange: CopyTradePlatformEnum
  apiKey: string
  maxPositions: number
  createdAt: string
}
