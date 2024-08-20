import { CopyPositionData } from 'entities/copyTrade'
import { UsdPrices } from 'hooks/store/useUsdPrices'

export type ExternalSourceCopyPositions = {
  prices?: UsdPrices
  submitting?: boolean
  currentId?: string
  onViewSource?: (data: CopyPositionData, event?: any) => void
  handleSelectCopyItem?: (data: CopyPositionData) => void
}
