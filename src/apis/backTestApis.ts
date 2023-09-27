import {
  BackTestResultData,
  BackTestTradersResultData,
  RequestBackTestData,
  RequestBackTestTradersData,
} from 'entities/backTest.d'
import { ProtocolEnum } from 'utils/config/enums'

import requester from './index'

const SERVICE = 'back-testing'

export async function requestTestSingleOrderApi({
  protocol,
  data,
}: {
  protocol: ProtocolEnum
  data: RequestBackTestData
}) {
  return requester.post(`${protocol}/${SERVICE}/single-order`, data).then((res: any) => {
    return res.data as BackTestResultData[]
  })
}

export async function requestTestMultiOrderApi({
  protocol,
  data,
}: {
  protocol: ProtocolEnum
  data: RequestBackTestData
}) {
  return requester.post(`${protocol}/${SERVICE}/multiple-order`, data).then((res: any) => {
    return res.data as BackTestResultData[]
  })
}

export async function requestBacktestTradersApi(data: RequestBackTestTradersData) {
  return requester.post('back-testing/filter', data, { timeout: 300000 }).then((res: any) => {
    return res.data as BackTestTradersResultData[]
  })
}
