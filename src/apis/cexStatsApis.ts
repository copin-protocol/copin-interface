import requester from 'apis'

import { DepthCEXData, DepthHistoriesData, DepthHistoryData } from 'entities/cexStats'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import { DAYJS_FULL_DATE_FORMAT } from '../utils/config/constants'
import { formatLocalDate } from '../utils/helpers/format'

const SERVICE = 'cex-stats'
const DEPTH_SERVICE = 'depth-histories'

export async function getDepthCEXStatsApi({
  exchange,
  account,
}: {
  exchange: CopyTradePlatformEnum
  account?: string
}) {
  return requester
    .get(`${SERVICE}/depth`, { params: { exchange, account } })
    .then((res: any) => res.data as DepthCEXData)
}

export async function getDepthHistoriesApi({
  exchange,
  symbol,
  depthPercentage,
  from,
  to,
}: {
  exchange: CopyTradePlatformEnum
  symbol: string
  depthPercentage: string
  from: number
  to: number
}) {
  return requester
    .get(`${DEPTH_SERVICE}/chart`, { params: { exchange, symbol, depthPercentage, from, to } })
    .then((res) => {
      const data = res.data as DepthHistoriesData
      const tempData: DepthHistoryData[] = []
      let tempTime = ''
      for (let i = 0; i < data.timestamps.length - 1; i++) {
        if (tempTime === data.timestamps[i]) continue
        tempData.push({
          date: formatLocalDate(data.timestamps[i], DAYJS_FULL_DATE_FORMAT),
          timestamp: data.timestamps[i],
          longVolume: data.longVolumes[i],
          shortVolume: data.shortVolumes[i],
        })
        tempTime = data.timestamps[i]
      }
      return tempData
    })
}
