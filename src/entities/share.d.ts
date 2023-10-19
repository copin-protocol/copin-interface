import { ProtocolEnum } from 'utils/config/enums'

import { RequestBackTestData } from './backTest'
import { ImageData } from './image'

export interface ShareBacktestData {
  protocol: ProtocolEnum
  type: 'back_test' // filter for what ?
  query: {
    setting: RequestBackTestData
    sort?: any
  }
}

export interface GetSharedPositionData {
  protocol: ProtocolEnum
  type: 'position'
  query: {
    type: 'CLOSED' | 'OPEN'
    positionId?: string
    blockNumber?: string
    key?: string
    indexToken?: string
    account?: string
  }
}

export interface SharePositionData {
  file: ImageData
  shareId: string
}
