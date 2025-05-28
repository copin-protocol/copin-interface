import { PositionData } from 'entities/trader'

export type ExternalSourceHlPosition = {
  submitting?: boolean
  currentId?: string
  handleClosePosition?: (data: PositionData) => void
  handleSelectPosition?: (data: PositionData) => void
}
