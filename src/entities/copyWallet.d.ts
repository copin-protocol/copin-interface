import { CopyTradePlatformEnum } from 'utils/config/enums'

export interface RequestCopyWalletData {
  exchange?: CopyTradePlatformEnum
  bingX?: ApiKeyWallet
  bitget?: ApiKeyWallet
  binance?: ApiKeyWallet
  name?: string
}

export interface CopyWalletData {
  id: string
  userId: string
  name?: string
  exchange: CopyTradePlatformEnum
  bingX?: ApiKeyWallet
  bitget?: ApiKeyWallet
  binance?: ApiKeyWallet
  smartWalletAddress?: string
  balance: number
  availableBalance: number
  copyVolume: number
  activeCopy: number
  createdAt: string
  isReferral?: boolean
}

export interface ApiKeyWallet {
  apiKey?: string
  secretKey?: string
  passPhrase?: string
}
