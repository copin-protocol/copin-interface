import {
  ReferralActivityData,
  ReferralClaimHistoryData,
  ReferralListData,
  ReferralRebateHistoryData,
  ReferralRewardData,
  ReferralStatisticData,
  RequestClaimRewardData,
} from 'entities/referralManagement'
import { ReferralHistoryStatusEnum, ReferralTypeEnum, SortTypeEnum, TimeFilterByEnum } from 'utils/config/enums'

import { ApiListResponse } from './api'
import requester from './index'
import { PaginationParams } from './types'

const SERVICE = 'referrals'

export async function getReferralListApi(
  params?: { referralType: ReferralTypeEnum; sortBy?: string; sortType?: SortTypeEnum } & PaginationParams
) {
  return requester
    .get(`${SERVICE}/referralList/page`, { params })
    .then((res: any) => res.data as ApiListResponse<ReferralListData>)
}

export async function getRebateHistoryListApi(
  params?: {
    referralType?: ReferralTypeEnum
    status?: ReferralHistoryStatusEnum
    sortBy?: string
    sortType?: SortTypeEnum
  } & PaginationParams
) {
  return requester
    .get(`${SERVICE}/history/page`, { params })
    .then((res: any) => res.data as ApiListResponse<ReferralRebateHistoryData>)
}

export async function getClaimHistoryListApi(params?: any) {
  return requester
    .get(`${SERVICE}/claim/history/page`, { params })
    .then((res: any) => res.data as ApiListResponse<ReferralClaimHistoryData>)
}

export async function getReferralStatisticApi() {
  return requester
    .get(`${SERVICE}/statistic`)
    .then((res: any) => res.data as Record<TimeFilterByEnum, ReferralStatisticData>)
}

export async function getReferralActivitiesApi() {
  return requester
    .get(`/public/${SERVICE}/latest`, { params: { limit: 50 } })
    .then((res: any) => res.data as ReferralActivityData[])
}

export async function getReferralRewardApi() {
  return requester.get(`${SERVICE}/reward`).then((res: any) => res.data as ReferralRewardData)
}

export async function requestClaimRewardApi() {
  return requester.post(`${SERVICE}/claim/reward`).then((res: any) => res.data as RequestClaimRewardData)
}
