import { CopyWalletData } from 'entities/copyWallet'

export type ListCopyTradeType = 'cex' | 'dex' | 'lite' | 'drawer'

export type ExternalResource = {
  copyWallets?: CopyWalletData[]
}
