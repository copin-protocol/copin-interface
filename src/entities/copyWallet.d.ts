import { CopyTradePlatformEnum } from 'utils/config/enums'

export interface RequestCopyWalletData {
  exchange?: CopyTradePlatformEnum
  bingX?: ApiKeyWallet
  name?: string
}

export interface CopyWalletData {
  id: string
  userId: string
  name?: string
  exchange: CopyTradePlatformEnum
  bingX?: ApiKeyWallet
  smartWalletAddress?: string
  balance: number
  availableBalance: number
  copyVolume: number
  activeCopy: number
  createdAt: string
}

export interface ApiKeyWallet {
  apiKey?: string
  secretKey?: string
}
