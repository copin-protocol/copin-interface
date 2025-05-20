import { UserRoleEnum } from 'utils/config/enums'

export interface LoginResponse {
  verifyCode: string
}

export interface VerifyLoginResponse {
  access_token: string
  id: string
  username: string
  account: string
  role: UserRoleEnum
  copyTradeQuota: number
  isActivated: boolean
  isAddedReferral?: boolean
  isSkippedReferral?: boolean
  isBlocked: boolean
  blockNote?: string
  referralCode?: string
  createdAt: string
  updatedAt: string
  subscription?: {
    plan: SubscriptionPlanEnum
    expiredTime: string
  }
}

export interface RegisterResponse {
  otp: string
}

export interface VerifyRegisterResponse {
  access_token: string
  username: string
}

export interface VerifyForgotPasswordResponse {
  access_token: string
  username: string
}
