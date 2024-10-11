import { CopyPositionData } from 'entities/copyTrade.d'
import { ReferralData, ReferralStat, UserData } from 'entities/user.d'
import { DEFAULT_LIMIT } from 'utils/config/constants'

import { ApiListResponse } from './api'
import requester from './index'
import { GetApiParams, GetMyPositionRequestBody, GetMyPositionsParams } from './types'

const POSITION_SERVICE = 'copy-positions'
const USER_SERVICE = 'users'

export async function getMyProfileApi() {
  return requester.get(`me`).then((res: any) => res.data as UserData)
}

export async function changePasswordApi({ oldPassword, password }: { oldPassword: string; password: string }) {
  return requester.put(`update-password`, { oldPassword, password }).then((res: any) => res.data as UserData)
}

export async function getMyCopyPositionsApi(params: GetMyPositionsParams, body?: GetMyPositionRequestBody) {
  const newParams: Record<string, any> = { ...params }
  !!params.status?.length && (newParams.status = params.status?.join(','))
  if (!!params.sortBy) {
    newParams.sort_by = params.sortBy
    delete newParams.sortBy
  }
  if (!!params.sortType) {
    newParams.sort_type = params.sortType
    delete newParams.sortType
  }
  return requester
    .post(`${POSITION_SERVICE}/page`, body, { params: newParams })
    .then((res: any) => res.data as ApiListResponse<CopyPositionData>)
}

export async function getReferralListApi({ limit = DEFAULT_LIMIT, offset = 0 }: GetApiParams) {
  return requester
    .get(`${USER_SERVICE}/referral/page`, { params: { limit, offset } })
    .then((res: any) => res.data as ApiListResponse<ReferralData>)
}

export async function getReferralStatsApi() {
  return requester.get(`${USER_SERVICE}/referral/stats`).then((res: any) => res.data as ReferralStat)
}

export async function addReferralCodeApi(referralCode: string) {
  return requester.post(`${USER_SERVICE}/add-referral`, { referralCode }).then((res: any) => res.data as UserData)
}

export async function skipReferralApi() {
  return requester.post(`${USER_SERVICE}/skip-referral`).then((res: any) => res.data as UserData)
}

export async function customRefCodeApi({ data }: { data: { referralCode: string } }) {
  return requester.put(`${USER_SERVICE}/custom-referral-code`, data).then((res: any) => res.data as UserData)
}

export async function checkBeforeAddRefApi() {
  return requester.get(`${USER_SERVICE}/add-referral/eligible`).then((res: any) => res.data as boolean)
}
