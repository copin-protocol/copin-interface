import { CopyTradeConfigTypeEnum, CopyTradePlatformEnum } from 'utils/config/enums'

export interface RequestCopyTradeConfigData {
  maxPositions?: number
  type?: CopyTradeConfigTypeEnum
  exchange?: CopyTradePlatformEnum
  identifyKey?: string
}

export interface CopyTradeConfigData {
  id: string
  userId: string
  type: CopyTradeConfigTypeEnum
  exchange: CopyTradePlatformEnum
  copyWalletId: string
  maxPositions: number
  createdAt: string
}
