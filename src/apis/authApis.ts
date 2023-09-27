import requester from 'apis/index'
import {
  LoginResponse,
  VerifyForgotPasswordResponse,
  VerifyLoginResponse,
  VerifyRegisterResponse,
} from 'entities/auth.d'

const SERVICE = 'auth'

export async function requestRegisterApi({
  email,
  password,
  referralCode,
}: {
  email: string
  password: string
  referralCode?: string
}) {
  return requester.post(`${SERVICE}/register`, { email, password, referralCode }).then((res: any) => res.data)
}

export async function requestOtpApi({ email }: { email: string }) {
  return requester.post(`${SERVICE}/register/request-otp`, { email }).then((res: any) => res.data)
}

export async function verifyRegisterApi({ email, password, otp }: { email: string; password: string; otp: string }) {
  return requester
    .post(`${SERVICE}/register/verify`, { email, password, otp })
    .then((res: any) => res.data as VerifyRegisterResponse)
}

export async function requestForgotPasswordApi({ email }: { email: string }) {
  return requester.post(`${SERVICE}/forgot-password/request`, { email }).then((res: any) => res.data)
}

export async function verifyForgotPasswordApi({
  email,
  password,
  otp,
}: {
  email: string
  password: string
  otp: string
}) {
  return requester
    .post(`${SERVICE}/forgot-password`, { email, password, otp })
    .then((res: any) => res.data as VerifyForgotPasswordResponse)
}

export async function requestLoginApi({ username, password }: { username: string; password: string }) {
  return requester.post(`${SERVICE}/login`, { username, password }).then((res: any) => res.data as VerifyLoginResponse)
}

export async function loginWeb3Api(address: string) {
  return requester.post(`${SERVICE}/web3/login`, { address }).then((res: any) => res.data as LoginResponse)
}

export async function verifyLoginWeb3Api(address: string, sign: string, time: string) {
  return requester
    .post(`${SERVICE}/web3/verify-login`, { address, sign, time })
    .then((res: any) => res.data as VerifyLoginResponse)
}

export async function logoutApi() {
  return requester.post(`${SERVICE}/logout`)
}
