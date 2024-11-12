import { CopyPositionData, CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { UsdPrices } from 'hooks/store/useUsdPrices'

export type ExternalSourceCopyPositions = {
  copyTrades?: CopyTradeData[]
  copyWallets?: CopyWalletData[]
  prices?: UsdPrices
  gainsPrices?: UsdPrices
  submitting?: boolean
  currentId?: string
  onViewSource?: (data: CopyPositionData, event?: any) => void
  handleSelectCopyItem?: (data: CopyPositionData) => void
}
