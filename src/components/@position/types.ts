import { CopyPositionData, CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { ProtocolEnum } from 'utils/config/enums'

export type ExternalSourceCopyPositions = {
  copyTrades?: CopyTradeData[]
  copyWallets?: CopyWalletData[]
  prices?: UsdPrices
  gainsPrices?: UsdPrices
  submitting?: boolean
  currentId?: string
  onViewSource?: (data: CopyPositionData, event?: any) => void
  handleCloseCopyItem?: (data: CopyPositionData) => void
  handleSelectCopyItem?: (data: CopyPositionData) => void
  getSymbolByIndexToken?: ({
    protocol,
    indexToken,
  }: {
    protocol?: ProtocolEnum
    indexToken: string | undefined
  }) => string | undefined
}
