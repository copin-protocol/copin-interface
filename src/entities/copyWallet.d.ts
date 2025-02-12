import { CopyTradePlatformEnum } from 'utils/config/enums'

export interface RequestCopyWalletData {
  exchange?: CopyTradePlatformEnum
  bingX?: ApiKeyWallet
  bitget?: ApiKeyWallet
  binance?: ApiKeyWallet
  bybit?: ApiKeyWallet
  okx?: ApiKeyWallet
  gate?: ApiKeyWallet
  hyperliquid?: ApiKeyWallet
  hyperliquidSignature?: {
    signature: string
    nonce: number
  }
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
  bybit?: ApiKeyWallet
  okx?: ApiKeyWallet
  gate?: ApiKeyWallet
  hyperliquid?: ApiKeyWallet
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
  embeddedWallet?: string
  passPhrase?: string
  isEmbedded?: boolean
  verified?: boolean
}
