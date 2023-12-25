import dayjs from 'dayjs'

import { ApiListResponse, ApiMeta } from 'apis/api'
import { CopyWalletData } from 'entities/copyWallet'
import { LINKS, SUPPORTED_LOCALES } from 'utils/config/constants'
import { CopyTradePlatformEnum, ProtocolEnum, TimeFilterByEnum, TimeframeEnum } from 'utils/config/enums'
import { COPY_WALLET_TRANS } from 'utils/config/translations'

import { addressShorten } from './format'

// dayjs.extend(duration)

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
export function parseLocale(maybeSupportedLocale: string) {
  if (typeof maybeSupportedLocale !== 'string') return undefined
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase()
  return SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase() === lowerMaybeSupportedLocale || locale.split('-')[0] === lowerMaybeSupportedLocale
  )
}

export function parseSocialLink(link: string | undefined) {
  if (!link || link.length === 0) return ''

  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link
  }

  return `https://${link}`
}

export function floorNumber(num: number, decimals: number) {
  const multipler = Number('1'.padEnd(1 + decimals, '0'))
  return Math.floor(num * multipler) / multipler
}

export function generateObjectPrefix(arr: string[], prefix: string) {
  const obj: { [key: string]: string } = {}
  return arr.reduce((prev, cur) => {
    prev[cur] = `${prefix}.${cur}`
    return prev
  }, obj)
}

export function generateObjectByKeys<T>(arr: (keyof T)[]): { [key in keyof T]: keyof T } {
  const obj = {} as { [key in keyof T]: keyof T }
  return arr.reduce((prev, cur) => {
    prev[cur] = cur
    return prev
  }, obj)
}

/**
 * https://day.js.org/docs/en/manipulate/utc-offset
 * @param {Date} date
 */
export function toCurrentOffset(date: Date) {
  // initialize
  let result = dayjs(date)

  // remove date offset
  // result = result.subtract(result.utcOffset(), 'minutes')

  // add current offset of today
  result = result.subtract(dayjs().utcOffset(), 'minutes')

  return result.toDate()
}

/**
 * https://day.js.org/docs/en/manipulate/utc-offset
 * @param {Date} date
 */
export function toDateOffset(date: Date) {
  // initialize
  let result = dayjs(date)

  // remove date offset
  // result = result.subtract(dayjs().utcOffset(), 'minutes')

  // add current offset of today
  result = result.add(result.utcOffset(), 'minutes')

  return result.toDate()
}

export const pageToOffset = (page: number, limit: number) => (page - 1) * limit
export const offsetToPage = (offset: number, limit: number) => offset / limit + 1

export function getNextParam(limit: number, meta?: ApiMeta) {
  const _nextOffset = (meta?.offset ?? 0) + limit
  const _total = meta?.total ?? 0
  if (_nextOffset >= _total) {
    return undefined
  }
  return (meta?.offset ?? 0) + limit
}

export function getPaginationDataFromList<T>({
  currentPage,
  limit,
  data,
}: {
  currentPage: number
  limit: number
  data: T[] | undefined
}): ApiListResponse<T> {
  if (!data) {
    return {
      data: [],
      meta: {
        limit,
        offset: 0,
        total: 0,
        totalPages: 0,
      },
    }
  }
  const currentOffset = pageToOffset(currentPage, limit)
  const total = data.length
  const slicedData = data.slice(currentOffset, currentOffset + limit > total ? undefined : currentOffset + limit)
  return { data: slicedData, meta: { limit, offset: currentOffset, total, totalPages: Math.ceil(total / limit) } }
}

export function getTimeframeFromTimeRange(from: number, to: number) {
  const diffDay = dayjs(to).utc().diff(dayjs(from).utc(), 'day')
  const diffHour = dayjs(to).utc().diff(dayjs(from).utc(), 'hour')

  return diffDay > 120
    ? 60 * 24
    : diffDay > 4
    ? TimeframeEnum.H4
    : diffDay > 0
    ? TimeframeEnum.H1
    : diffHour > 8
    ? TimeframeEnum.M15
    : TimeframeEnum.M5
}

export const getDurationFromTimeFilter = (timeFilter?: TimeFilterByEnum) => {
  switch (timeFilter) {
    case TimeFilterByEnum.S7_DAY:
      return 7
    case TimeFilterByEnum.S14_DAY:
      return 14
    case TimeFilterByEnum.S30_DAY:
      return 30
    case TimeFilterByEnum.S60_DAY:
      return 60
    case TimeFilterByEnum.ALL_TIME:
      return 365
    default:
      return 7
  }
}

export const getProtocolTradeUrl = (protocol: ProtocolEnum) => {
  switch (protocol) {
    case ProtocolEnum.GMX:
      return LINKS.tradeGMX
    case ProtocolEnum.KWENTA:
      return LINKS.tradeKwenta
    case ProtocolEnum.POLYNOMIAL:
      return LINKS.tradePolynomial
    default:
      return LINKS.tradeGMX
  }
}

export function parseProtocolImage(protocol: ProtocolEnum) {
  return `/images/protocols/${protocol}.png`
}

export function parseExchangeImage(exchange: CopyTradePlatformEnum) {
  return `/images/exchanges/${exchange}.png`
}

export function parseWalletName(wallet: CopyWalletData) {
  return wallet.name
    ? wallet.name
    : `${COPY_WALLET_TRANS[wallet.exchange]}: ${
        wallet?.smartWalletAddress ? addressShorten(wallet?.smartWalletAddress) : wallet.bingX?.apiKey?.slice(0, 5)
      }`
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowerFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
