import { EventDetailsData, UserEventRankingData } from 'entities/event'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams } from './types'

export async function getListEvent() {
  return requester.get(`/public/trading-event/list`).then((res: any) => res.data as EventDetailsData[])
}

export async function getEventDetails({ tradingEventId }: { tradingEventId: string | undefined }) {
  return requester.get(`/public/trading-event/${tradingEventId}`).then((res: any) => res.data as EventDetailsData)
}

export async function registerEvent({ tradingEventId }: { tradingEventId: string | undefined }) {
  return requester
    .post(`/leaderboard-trading-event`, { tradingEventId })
    .then((res: any) => res.data as UserEventRankingData)
}

export async function getUserEventRanking({ tradingEventId }: { tradingEventId: string | undefined }) {
  return requester
    .get(`/leaderboard-trading-event/me`, { params: { tradingEventId } })
    .then((res: any) => res.data as UserEventRankingData)
}

export async function getEventTotalVolume({ tradingEventId }: { tradingEventId: string | undefined }) {
  return requester
    .get(`/public/leaderboard-trading-event/totalVolume`, { params: { tradingEventId } })
    .then((res: any) => res.data as number)
}

export async function getEventLeaderboard({
  limit = DEFAULT_LIMIT,
  offset = 0,
  tradingEventId,
}: { tradingEventId: string | undefined } & GetApiParams) {
  return requester
    .get(`/public/leaderboard-trading-event/page`, {
      params: { limit, offset, tradingEventId, sort_by: 'ranking', sort_type: SortTypeEnum.DESC },
    })
    .then((res: any) => res.data as ApiListResponse<UserEventRankingData>)
}
