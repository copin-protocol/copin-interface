import { ProtocolEnum } from 'utils/config/enums'

import { RequestBackTestData } from './backTest'

export interface ShareBacktestData {
  protocol: ProtocolEnum
  type: 'back_test' // filter for what ?
  query: {
    setting: RequestBackTestData
    sort?: any
  }
}
