import { UserData } from 'entities/user'
import { STORAGE_KEYS } from 'utils/config/keys'

import requester from './index'

export const setJwt = (jwt: string) => {
  requester.defaults.headers.common['Authorization'] = jwt
}
export const storeAuth = ({ jwt, wallet, account }: { jwt: string; wallet?: string; account: string }) => {
  setJwt(jwt)
  localStorage.setItem(STORAGE_KEYS.JWT, jwt)
  if (wallet) localStorage.setItem(STORAGE_KEYS.WALLET, wallet)
  localStorage.setItem(STORAGE_KEYS.ACCOUNT, account)
}

export const clearAuth = () => {
  requester.defaults.headers.common['Authorization'] = ''
  localStorage.removeItem(STORAGE_KEYS.JWT)
  localStorage.removeItem(STORAGE_KEYS.ACCOUNT)
}
export const getStoredJwt = (): string | null => {
  const storedJwt = localStorage.getItem(STORAGE_KEYS.JWT)
  if (!storedJwt) return null
  return storedJwt
}

export const getStoredAccount = (): string | null => {
  const storedAccount = localStorage.getItem(STORAGE_KEYS.ACCOUNT)
  if (!storedAccount) return null
  return storedAccount
}

export const getStoredConnection = (): { address?: string; connectorType?: string } => {
  const connections = localStorage.getItem(STORAGE_KEYS.PRIVY_CONNECTIONS)
  if (!connections) return {}
  try {
    const parsedConnections = JSON.parse(connections)
    return parsedConnections[0] ?? {}
  } catch {}
  return {}
}

export const getUnverifiedAccount = (): string | undefined => {
  const account = localStorage.getItem(STORAGE_KEYS.UNVERIFIED_ACCOUNT)
  if (!account) return undefined
  return account
}

export const storeUnverifiedAccount = (account: string) => {
  localStorage.setItem(STORAGE_KEYS.UNVERIFIED_ACCOUNT, account)
}

export const clearUnverifiedAccount = () => {
  localStorage.removeItem(STORAGE_KEYS.UNVERIFIED_ACCOUNT)
}

const URL_PUBLIC = '/public/'
const URL_PRIVATE = '/'

export const apiWrapper = (url: string): string => {
  if (requester?.defaults?.headers && requester.defaults.headers.common['Authorization']) {
    return URL_PRIVATE + url
  }
  return URL_PUBLIC + url
}

export function parseMyProfileResponse(data: UserData) {
  const newResponse: UserData = { ...data, plan: data.subscription?.plan ?? data.plan }
  return newResponse
}
