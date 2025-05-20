import dayjs from 'dayjs'

import { ApiListResponse, ApiMeta } from 'apis/api'
import { ChartData } from 'entities/chart'
import { ApiKeyWallet, CopyWalletData } from 'entities/copyWallet'
import { SPECIAL_SYMBOLS_REGEX, SUPPORTED_LOCALES } from 'utils/config/constants'
import {
  CopyPositionCloseTypeEnum,
  CopyTradePlatformEnum,
  OrderTypeEnum,
  ProtocolEnum,
  SLTPTypeEnum,
  SubscriptionPlanEnum,
  TimeFilterByEnum,
  TimeframeEnum,
} from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import {
  COPY_POSITION_CLOSE_TYPE_TRANS,
  COPY_WALLET_TRANS,
  ORDER_TYPE_TRANS,
  SLTP_TYPE_TRANS,
  SUBSCRIPTION_PLAN_TRANSLATION,
} from 'utils/config/translations'

import { TokenTrade } from '../config/trades'
import { CHAINS } from '../web3/chains'
import { addressShorten, formatNumber, formatZeroBased, shortenText } from './format'
import { EXCHANGE_PRICE_MULTIPLE_MAPPING, PROTOCOL_PRICE_MULTIPLE_MAPPING } from './price'

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
    ? TimeframeEnum.D1
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
      return 15
    case TimeFilterByEnum.S30_DAY:
      return 30
    case TimeFilterByEnum.S60_DAY:
      return 60
    case TimeFilterByEnum.S90_DAY:
      return 90
    case TimeFilterByEnum.S365_DAY:
      return 365
    case TimeFilterByEnum.ALL_TIME:
      return 365 * 10
    default:
      return 7
  }
}

export const getProtocolTradeUrl = (protocol: ProtocolEnum) => {
  const protocolConfig = PROTOCOL_OPTIONS_MAPPING[protocol]
  if (!protocolConfig) return ''
  return protocolConfig.linkTrade || ''
}

export function parseProtocolImage(protocol: ProtocolEnum) {
  return `${import.meta.env.VITE_API}/storage/image/protocols__${protocol}`
}

export function parseExchangeImage(exchange: CopyTradePlatformEnum) {
  return `${import.meta.env.VITE_API}/storage/image/exchanges__${exchange}`
}

export function parseWalletName(wallet: CopyWalletData, returnExchange?: boolean, shortenName?: boolean) {
  if (returnExchange)
    return `${COPY_WALLET_TRANS[wallet.exchange]}: ${
      wallet?.name
        ? shortenName
          ? shortenText(wallet.name, 8)
          : wallet.name
        : wallet?.smartWalletAddress
        ? addressShorten(wallet?.smartWalletAddress)
        : (wallet?.[getExchangeKey(wallet?.exchange)] as ApiKeyWallet)?.apiKey?.slice(0, 5) ?? '--'
    }`

  return wallet.name
    ? wallet.name
    : `${COPY_WALLET_TRANS[wallet.exchange]}: ${
        wallet?.smartWalletAddress
          ? addressShorten(wallet?.smartWalletAddress)
          : (wallet?.[getExchangeKey(wallet?.exchange)] as ApiKeyWallet)?.apiKey?.slice(0, 5) ?? '--'
      }`
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowerFirstLetter(str: string) {
  if (!str) return str
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function convertCamelCaseToText(str: string) {
  const result = str.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function convertDataToText(data: any) {
  if (data === null || data === undefined) return '--'
  if (typeof data === 'object' && !Array.isArray(data)) return JSON.stringify(data)
  if (typeof data === 'boolean') return data ? 'On' : 'Off'
  if (typeof data === 'number' || !isNaN(Number(data))) return formatNumber(data)
  if (Array.isArray(data)) return !!data.length ? data.join(', ') : '--'
  if (typeof data === 'string') {
    switch (data) {
      case CopyPositionCloseTypeEnum.COPY_TRADE:
      case CopyPositionCloseTypeEnum.MANUAL:
      case CopyPositionCloseTypeEnum.STOP_LOSS:
      case CopyPositionCloseTypeEnum.TAKE_PROFIT:
      case CopyPositionCloseTypeEnum.LIQUIDATE:
      case CopyPositionCloseTypeEnum.STOP_COPY_TRADE:
      case CopyPositionCloseTypeEnum.FORCE_CLOSE:
      case CopyPositionCloseTypeEnum.OVERWRITE:
        return COPY_POSITION_CLOSE_TYPE_TRANS[data]
      case OrderTypeEnum.OPEN:
      case OrderTypeEnum.CLOSE:
      case OrderTypeEnum.INCREASE:
      case OrderTypeEnum.DECREASE:
      case OrderTypeEnum.LIQUIDATE:
      case OrderTypeEnum.STOP_LOSS:
      case OrderTypeEnum.TAKE_PROFIT:
      case OrderTypeEnum.MARGIN_TRANSFERRED:
        return ORDER_TYPE_TRANS[data]
      case SLTPTypeEnum.USD:
      case SLTPTypeEnum.PERCENT:
        return SLTP_TYPE_TRANS[data]
      default:
        return data
    }
  }
  return data
}

export function parseMarketImage(symbol: string) {
  return `${import.meta.env.VITE_API}/storage/image/markets__${symbol}`
}

export function parseChainImage(chain: string) {
  return `${import.meta.env.VITE_API}/storage/image/chains__${chain.toUpperCase()}`
}

export function parseChainExplorerImage(icon: string) {
  return `${import.meta.env.VITE_API}/storage/image/chain_explorers__ic-${icon}-explorer`
}

export function parseCollateralImage(symbol: string) {
  return `${import.meta.env.VITE_API}/storage/image/collaterals__${symbol}`
}
export function parseCollateralColorImage(symbol: string) {
  return `${import.meta.env.VITE_API}/storage/image/collaterals_with_color__${symbol.toUpperCase()}`
}

export function parseCoverImage(symbol: string) {
  return `${import.meta.env.VITE_API}/storage/image/cover__${symbol}`
}

export function parseRewardImage(symbol: string) {
  return `${import.meta.env.VITE_API}/storage/image/rewards__${symbol}`
}

export function referRewardImage(tier: any) {
  return `${import.meta.env.VITE_API}/storage/image/referral__referral-tier-${tier}`
}

export function parsePlainProtocolImage(protocol: string, hasBorder?: boolean) {
  return hasBorder
    ? `${import.meta.env.VITE_API}/storage/image/protocol_images__${protocol}`
    : `${import.meta.env.VITE_API}/storage/image/plain_protocol__${protocol}`
}
export function parsePerpdexImage(perpdex: string, hasBorder?: boolean) {
  return hasBorder
    ? `${import.meta.env.VITE_API}/storage/image/perpdex__${perpdex}`
    : `${import.meta.env.VITE_API}/storage/image/plain_perpdex__${perpdex}`
}

export function convertDurationInSecond(openTime: string) {
  return dayjs.duration(dayjs().diff(dayjs(openTime))).asSeconds()
}

export function getSubscriptionPlanConfigs(plan: SubscriptionPlanEnum | undefined) {
  let label = ''
  let color = ''
  switch (plan) {
    case SubscriptionPlanEnum.STARTER:
      label = 'Starter'
      color = 'green2'
      break
    case SubscriptionPlanEnum.PRO:
      label = 'Pro'
      color = 'orange1'
      break
    case SubscriptionPlanEnum.ELITE:
      label = 'Elite'
      color = 'violet'
      break
  }
  return { label, color }
}

export function getProtocolDropdownImage({
  protocol,
  isActive,
  disabled,
}: {
  protocol: ProtocolEnum
  isActive: boolean
  disabled?: boolean
}) {
  const status = disabled ? 'inactive' : isActive ? 'active' : 'inactive_color'
  return `${import.meta.env.VITE_API}/storage/image/protocols_with_status__${protocol}-${status}`
}

export function normalizeProtocolPrice({ symbol, price }: { symbol: string | undefined; price: number | undefined }): {
  originalSymbol: string
  originalPrice: number
} {
  if (!symbol || !price) return { originalSymbol: symbol || '', originalPrice: price || 0 }
  const { originalSymbol, multiple } = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol] ?? {}
  return { originalSymbol: originalSymbol || symbol, originalPrice: price / (multiple ?? 1) }
}

/**
 * `formatPositionChartData` only use with `getChartDataV2`
 */
export function formatPositionChartData({
  data,
  symbol,
}: {
  data: ChartData[] | undefined
  symbol: string | undefined // symbol like 1000PEPE
}) {
  if (!data?.length || !symbol) return [] as ChartData[]
  const { multiple } = PROTOCOL_PRICE_MULTIPLE_MAPPING[symbol] ?? {}
  const _multiple = multiple || 1
  return data.map((v) => {
    const _chartData: ChartData = {
      open: v.open * _multiple,
      close: v.close * _multiple,
      low: v.low * _multiple,
      high: v.high * _multiple,
      timestamp: v.timestamp,
    }
    return _chartData
  })
}

/**
 * `formatCopyPositionChartData` only use with `getChartDataV2`
 */
export function formatCopyPositionChartData({
  data,
  symbol,
  exchange,
}: {
  data: ChartData[] | undefined
  symbol: string | undefined
  exchange: CopyTradePlatformEnum | undefined
}) {
  if (!data?.length || !symbol || !exchange) return [] as ChartData[]
  const { originalSymbol: _symbol } = normalizeProtocolPrice({ symbol, price: 1 }) // only get symbol
  return data.map((v) => {
    const _chartData: ChartData = {
      open: normalizeExchangePrice({ protocolSymbol: _symbol, protocolSymbolPrice: v.open, exchange }),
      close: normalizeExchangePrice({ protocolSymbol: _symbol, protocolSymbolPrice: v.close, exchange }),
      low: normalizeExchangePrice({ protocolSymbol: _symbol, protocolSymbolPrice: v.low, exchange }),
      high: normalizeExchangePrice({ protocolSymbol: _symbol, protocolSymbolPrice: v.high, exchange }),
      timestamp: v.timestamp,
    }
    return _chartData
  })
}

/**
 * `normalizeExchangePrice` use to parse price from protocol price, ex: 1000PEPE on Equation change to PEPE on OKX
 */
export function normalizeExchangePrice({
  protocolSymbol,
  protocolSymbolPrice,
  exchange,
}: {
  protocolSymbol: string | undefined
  protocolSymbolPrice: number | undefined
  exchange: CopyTradePlatformEnum | undefined
}) {
  if (!protocolSymbol || !protocolSymbolPrice || !exchange) return 0

  const { originalSymbol, originalPrice } = normalizeProtocolPrice({
    symbol: protocolSymbol,
    price: protocolSymbolPrice,
  })

  return (EXCHANGE_PRICE_MULTIPLE_MAPPING[exchange]?.[originalSymbol] ?? 1) * originalPrice
}

export const parseChainFromNetwork = (network: string) => {
  const chain = Object.entries(CHAINS).find(([_, values]) => {
    const _network = network.toUpperCase()
    return (
      values.icon === _network || values.label.toUpperCase() === _network || values.label.toUpperCase().match(_network)
    )
  })
  return {
    chainId: chain?.[0] ? Number(chain[0]) : undefined,
    label: chain?.[1]?.label,
    icon: chain?.[1]?.icon,
  }
}

// TODO: Delete comment after at least 1 month
// export function convertUniqueMarkets(protocol: ProtocolEnum, indexTokens?: string[]) {
//   if (!indexTokens) return []
//   const tokenTradeSupport = getTokenTradeSupport(protocol)
//   const markets: { indexToken: string; symbol: string }[] = indexTokens
//     .map((e) => {
//       return { indexToken: e, symbol: tokenTradeSupport[e]?.symbol ?? e }
//     })
//     .reduce((acc: any, market) => {
//       if (!acc[market.symbol]) {
//         acc[market.symbol] = market
//       }
//       return acc
//     }, {})
//   return Object.values(markets).map((market) => market.indexToken)
// }

export function getUniqueTokenTrade(tokenSupport: { [key: string]: TokenTrade | undefined }): TokenTrade[] {
  if (!tokenSupport) return []
  return Object.values(
    Object.values(tokenSupport).reduce((acc: any, market) => {
      if (market && !acc[market.symbol]) {
        acc[market.symbol] = market
      }
      return acc
    }, {})
  )
}

const EXCHANGE_KEY_MAPPING: Partial<Record<CopyTradePlatformEnum, keyof CopyWalletData>> = {
  [CopyTradePlatformEnum.APEX]: 'apex',
  [CopyTradePlatformEnum.BINGX]: 'bingX',
  [CopyTradePlatformEnum.BITGET]: 'bitget',
  [CopyTradePlatformEnum.BINANCE]: 'binance',
  [CopyTradePlatformEnum.BYBIT]: 'bybit',
  [CopyTradePlatformEnum.OKX]: 'okx',
  [CopyTradePlatformEnum.GATE]: 'gate',
  [CopyTradePlatformEnum.HYPERLIQUID]: 'hyperliquid',
}

export const getExchangeKey = (exchange: CopyTradePlatformEnum | undefined): keyof CopyWalletData => {
  if (!exchange) return 'bingX'
  return EXCHANGE_KEY_MAPPING[exchange] ?? 'bingX'
}

export function getTimePeriod(dayCount: number) {
  const to = dayjs().utc().startOf('day').valueOf()
  const from = dayjs(to).utc().subtract(dayCount, 'day').valueOf()
  return [from, to]
}

export function getCurrentTimezone() {
  const timezone = dayjs.tz.guess()
  switch (timezone) {
    case 'Asia/Saigon':
      return 'Asia/Ho_Chi_Minh'
    default:
      return timezone
  }
}

export function getSymbolFromPair(pair: string | undefined, isShowUI?: boolean) {
  if (!pair) return ''
  if (pair === 'NOT_SUPPORTED') return pair
  if (!pair?.includes('USDT')) {
    return isShowUI ? pair?.replace('-', '/') : pair
  }
  let symbol = pair?.split('-')?.[0] ?? ''
  symbol = symbol.split(SPECIAL_SYMBOLS_REGEX)[0]
  symbol = symbol.substring(0, 20)
  return symbol
}
export function getPairFromSymbol(symbol: string) {
  return symbol.includes('-') ? symbol : `${symbol}-USDT`
}
export function formatSymbol(symbol: string) {
  return symbol.includes('-') ? symbol.replace('-', '/') : symbol
}

const MINI_NUMBER_MAPPING: Record<string, string> = {
  '1': '\u2081',
  '2': '\u2082',
  '3': '\u2083',
  '4': '\u2084',
  '5': '\u2085',
  '6': '\u2086',
  '7': '\u2087',
  '8': '\u2088',
  '9': '\u2089',
  '10': '\u2081\u2080',
  '11': '\u2081\u2081',
  '12': '\u2081\u2082',
}
export function convertMiniNumber(value: number | string) {
  return MINI_NUMBER_MAPPING[value.toString()]
}

export function parseColorByValue(value?: number) {
  if (!value) return 'neutral1'
  return value > 0 ? 'green1' : value < 0 ? 'red2' : 'neutral1'
}

// String like '1' will parse to 1
export function parseStorageData<T>({ storageKey, storage }: { storageKey: string; storage: Storage }) {
  const storedString = storage.getItem(storageKey)
  if (storedString == null) return null
  try {
    return JSON.parse(storedString) as T
  } catch {
    return null
  }
}

export function generateVaultInviteCode() {
  const now = dayjs().utc()
  const formatDay = formatZeroBased(Math.round(now.date() / 2))
  const formatMonth = formatZeroBased(now.month() + 1)
  return `VAULT${formatDay}${formatMonth}`
}

export function getSubscriptionPlanLabel({ plan }: { plan: SubscriptionPlanEnum }) {
  return SUBSCRIPTION_PLAN_TRANSLATION[plan]
}

export const getItemsAndRequiredPlan = (
  key: string,
  permissions?: { [key in SubscriptionPlanEnum]: any }
): { [key: string]: SubscriptionPlanEnum } => {
  const itemsMapping: { [key: string]: SubscriptionPlanEnum } = {}
  Object.keys(permissions ?? {}).forEach((plan) => {
    const planEnum = plan as SubscriptionPlanEnum
    permissions?.[planEnum]?.[key]?.forEach((item: any) => {
      if (itemsMapping[item] == null) {
        itemsMapping[item] = planEnum
      }
    })
  })
  return itemsMapping
}

export function goToPreviousPage({
  total,
  currentPage,
  limit,
  changeCurrentPage,
}: {
  total: number
  currentPage: number
  limit: number
  changeCurrentPage: (page: number) => void
}) {
  const newTotal = total - 1
  const remainingItemsOnPage = newTotal - (currentPage - 1) * limit
  if (remainingItemsOnPage <= 0 && currentPage > 1) {
    changeCurrentPage(currentPage - 1)
  }
}
