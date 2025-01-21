import { CopyPositionData, CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { ProtocolEnum } from 'utils/config/enums'

export type ExternalSourceCopyPositions = {
  copyTrades?: CopyTradeData[]
  copyWallets?: CopyWalletData[]
  submitting?: boolean
  currentId?: string
  onViewSource?: (data: CopyPositionData, event?: any) => void
  handleCloseCopyItem?: (data: CopyPositionData) => void
  handleSelectCopyItem?: (data: CopyPositionData) => void
  handleUnlinkCopyPosition?: (data: CopyPositionData) => void
  getSymbolByIndexToken?: ({
    protocol,
    indexToken,
  }: {
    protocol?: ProtocolEnum
    indexToken: string | undefined
  }) => string | undefined
}

export type MobileLayoutType = 'GRID' | 'LIST'
export type LayoutType = 'lite' | 'normal' | 'simple'
