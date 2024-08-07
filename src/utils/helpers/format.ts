import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isoWeek from 'dayjs/plugin/isoWeek'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { ImageData } from 'entities/image.d'
import { DATE_FORMAT, DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { isAddress } from 'utils/web3/contracts'

import { MarginModeEnum, RewardSymbolEnum } from '../config/enums'
import { MARGIN_MODE_TRANS } from '../config/translations'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(duration)

export function formatDuration(durationInSecond: number | undefined) {
  if (!durationInSecond) return '--'
  if (durationInSecond < 60) return `${formatNumber(durationInSecond, 0, 0)}s`
  if (durationInSecond < 3600) return `${formatNumber(durationInSecond / 60, 1, 1)}m`
  return `${formatNumber(durationInSecond / (60 * 60), 1, 1)}h`
}

export const formatLocalRelativeDate = (date: string | number) => dayjs.utc(date).local().fromNow()
export const formatLocalRelativeShortDate = (date: string | number) => {
  const arr = dayjs.utc(date).local().fromNow(true).split(' ')
  return `${arr[0] === 'a' || arr[0] === 'an' ? '1' : arr[0]}${arr[1].includes('month') ? 'mo' : arr[1]?.charAt(0)}`
}

export const formatRelativeDate = (date: string | number) => dayjs.utc(date).fromNow()
export const formatRelativeShortDate = (date: string | number) => {
  const arr = dayjs.utc(date).fromNow(true).split(' ')
  return `${arr[0]}${arr[1]?.charAt(0)}`
}

export const formatLocalDate = (date: string | number | undefined, format?: string) => {
  if (!date) return ''

  return dayjs
    .utc(date)
    .local()
    .format(format ?? DATE_FORMAT)
}

export const formatDate = (date: string | number | undefined, format?: string) => {
  if (!date) return ''

  return dayjs.utc(date).format(format ?? DAYJS_FULL_DATE_FORMAT)
}

export const formatWeekInYear = (date: string | number) => dayjs.utc(date).week()

export const getUnitDate = (
  date: string | number,
  unit: 'year' | 'month' | 'date' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
) => dayjs.utc(date).get(unit)

export function formatNumber(num?: number | string, maxDigit = 2, minDigit?: number) {
  if (num == null) return '--'
  if (typeof num === 'string') num = Number(num)
  if ((Math.abs(num) !== 0 && Math.abs(num) < 1 && maxDigit === 0) || (Math.abs(num) < 0.1 && maxDigit === 1)) {
    maxDigit = 2
    minDigit = 2
  }
  if (Math.abs(num) < 0.01 && (maxDigit === 2 || maxDigit === 1)) {
    maxDigit = 5
  }
  // if (num > 1000000000) return t`${(num / 1000000000).toFixed(0)} tỷ`
  return `${num.toLocaleString('en-US', { minimumFractionDigits: minDigit, maximumFractionDigits: maxDigit })}`
}

export function formatPrice(num?: number | string, maxDigit = 2, minDigit = 2) {
  if (num == null) return '--'
  if (typeof num === 'string') num = Number(num)
  if (Math.abs(num) < 100) {
    maxDigit = 4
    minDigit = 4
  }
  return formatNumber(num, maxDigit, minDigit)
}

export const formatLeverage = (marginMode?: MarginModeEnum, leverage?: number) => {
  if (marginMode === MarginModeEnum.CROSS) return MARGIN_MODE_TRANS[MarginModeEnum.CROSS]
  if (!leverage) return '--'
  return `${formatNumber(leverage, 1, 1)}x`
}

export function generateImageUrl(image: ImageData | undefined) {
  if (!image || !image.url) return `/images/default-thumbnail.png`
  return `${import.meta.env.VITE_API}/storage${image?.url}`
}

export function formatImageUrl(imageUrl: string | undefined) {
  if (!imageUrl) return `/images/default-thumbnail.png`
  return `${import.meta.env.VITE_API}/storage${imageUrl}`
}

export const formatTraderName = (name?: string, length?: number) => {
  if (!name) return ''
  const nameArr = name.split(' ')
  let formatName = name
  if (nameArr.length > 1) {
    const first = nameArr[1].charAt(0)
    const last = nameArr[0]
    formatName = `${first}.${last}`
  }
  if (!length || formatName.length <= length) return formatName
  const prefix = formatName.slice(0, length)
  return `${prefix}...`
}

export const addressShorten = (address: string, num?: number, numsPrefix?: number) => {
  if (!address) return ''
  if (!num) num = 3
  if (num >= address.length / 2) return address
  const prefix = address.slice(0, numsPrefix ? numsPrefix : num + 2)
  const suffix = address.slice(-num, address.length)
  return `${prefix}...${suffix}`
}

export const shortenText = (text?: string, length?: number) => {
  if (!text) return ''
  if (!length || text.length <= length) return text
  const prefix = text.slice(0, length)
  return `${prefix}...`
}
export function shortenFileName({
  text,
  numsPrefix = 12,
  numsSuffix = 8,
}: {
  text: string
  numsPrefix?: number
  numsSuffix?: number
}) {
  if (text.length < numsPrefix + numsSuffix + 6) return text
  const prefix = text.slice(0, numsPrefix)
  const suffix = text.slice(text.length - numsSuffix)
  return `${prefix}...${suffix}`
}

export function compactNumber(num: number, digits = 1, isInteger?: boolean) {
  if (num === 0) return 0

  if (isInteger && num > 0 && num < 1000) return num

  if (Math.abs(num) < 1) return num.toFixed(digits)
  const lookup = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
    { value: 1, symbol: '' },
  ]
  const item = lookup.find(function (item) {
    return Math.abs(num) >= item.value
  })
  return item ? (num / item.value).toFixed(digits) + item.symbol : '--'
}

export function breakLineTextToArray({ text = '', maxLine = 2, lineMaxLength = 40 }) {
  let textArray: string[] = []
  let tempText = ''
  text.split(' ').forEach((word, index, array) => {
    if (tempText.length + 1 + word.length > lineMaxLength) {
      textArray.push(tempText)
      tempText = ''
    }
    if (tempText.length === 0) {
      tempText = word
    } else {
      tempText = tempText.concat(' ', word)
    }
    if (index === array.length - 1) textArray.push(tempText)
  })
  // limit 2 line
  if (textArray.length > maxLine) {
    textArray = textArray.slice(0, maxLine)
    textArray[maxLine - 1] = textArray[maxLine - 1].concat(' ...')
  }
  return textArray
}

export function formatDisplayName(name: string | undefined, address: string | undefined) {
  return !!name ? (isAddress(name) ? addressShorten(name) : name) : !!address ? addressShorten(address) : ''
}

export function nFormatter(num: number, digits = 2) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

export default function formatTokenPrices({ value }: { value: number | undefined }) {
  const formattedNumber = (value ?? 0).toFixed(18)
  const parts = formattedNumber.split('.')
  const integerPart = parts[0] || '0'
  let decimalPart = parts[1] || '0'
  const consecutiveZerosCount = countConsecutiveZeros(decimalPart)
  const zeroPart = decimalPart.slice(0, consecutiveZerosCount).padStart(consecutiveZerosCount, '0')
  decimalPart = decimalPart.slice(consecutiveZerosCount, consecutiveZerosCount + 3)

  return { formattedNumber: value, integerPart, zeroPart, decimalPart }
}

function countConsecutiveZeros(decimalPart: string): number {
  let maxConsecutiveZeros = 0
  let currentConsecutiveZeros = 0

  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      currentConsecutiveZeros++
      maxConsecutiveZeros = Math.max(maxConsecutiveZeros, currentConsecutiveZeros)
    } else {
      currentConsecutiveZeros = 0
      return maxConsecutiveZeros
    }
  }

  return maxConsecutiveZeros
}

export function formatRewardSymbol(value: string, rewardSymbol?: string) {
  return !rewardSymbol || rewardSymbol === RewardSymbolEnum.USD ? `$${value}` : `${value} ${rewardSymbol}`
}
