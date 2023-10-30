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
  localStorage.removeItem(STORAGE_KEYS.WALLET)
  localStorage.removeItem(STORAGE_KEYS.ACCOUNT)
}
export const getStoredJwt = (): string | null => {
  const storedJwt = localStorage.getItem(STORAGE_KEYS.JWT)
  if (!storedJwt) return null
  return storedJwt
}
export const getStoredWallet = (): { account: string | null; wallet: string | null } => {
  const wallet = localStorage.getItem(STORAGE_KEYS.WALLET)
  const account = localStorage.getItem(STORAGE_KEYS.ACCOUNT)
  return { wallet, account }
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
