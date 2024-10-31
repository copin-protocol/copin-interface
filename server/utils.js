// import { getAddress } from 'ethers/lib/utils.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import { readFile } from 'fs'
import { resolve } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

import { configs } from './configs.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const indexPath = resolve(__dirname, '..', 'build', 'index.html')

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(duration)
dayjs.extend(timezone)

export const DATE_FORMAT = 'YYYY/MM/DD'
export const DATE_TEXT_FORMAT = 'DD MMM, YYYY'
export const TIME_FORMAT = 'HH:mm:ss'
export const DAYJS_FULL_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss'

const renderHTML = ({ req, res, params = {} }) => {
  const {
    title = 'Trader Explorer | Copin Analyzer',
    description = 'Explore, analyze, and evaluate on-chain traders from all of the perpetual DEXs (GMX, Kwenta, DYDX, etc.)',
    thumbnail = `${configs.baseUrl}/images/cover/cover.png`,
    url = `${configs.baseUrl}`,
  } = params
  readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err)
      return res.status(404).end()
    }

    const baseHtmlData = replaceBaseMeta(htmlData, { title, description, thumbnail, url })

    return res.send(baseHtmlData)
  })
}

function replaceBaseMeta(htmlData, { title, description, thumbnail, url }) {
  const newData = htmlData
    .replace('<title>Copin Analyzer</title>', `<title>${normalizeText(title)}</title>`)
    .replace(/__TITLE__/g, normalizeText(title))
    .replace(/__DESCRIPTION__/g, normalizeText(shortenText(description, 250)))
    .replace(/__THUMBNAIL__/g, normalizeText(thumbnail))
    .replace(/__URL__/g, normalizeText(url))
  return newData
}

function normalizeText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function shortenText(str, length) {
  if (!str) return ''
  if (!length || str.length <= length) return str
  const prefix = str.slice(0, length - 3)
  return `${prefix}...`
}

function addressShorten(address, num, numsPrefix) {
  if (!address) return ''
  if (!num) num = 4
  if (num >= address.length / 2) return address
  const prefix = address.slice(0, numsPrefix ? numsPrefix : num + 2)
  const suffix = address.slice(-num, address.length)
  return `${prefix}...${suffix}`
}

function generateProtocolName(protocol) {
  if (!protocol) return ''
  // TODO: Check when add new protocol
  switch (protocol) {
    case 'GMX':
      return 'GMX'
    case 'GMX_V2':
      return 'GMX (V2)'
    case 'GNS':
      return 'gTrade (ARB)'
    case 'GNS_POLY':
      return 'gTrade (MATIC)'
    case 'GNS_BASE':
      return 'gTrade (Base)'
    case 'KWENTA':
      return 'Kwenta'
    case 'POLYNOMIAL':
      return 'Polynomial'
    case 'LEVEL_BNB':
      return 'Level (BNB)'
    case 'LEVEL_ARB':
      return 'Level (ARB)'
    case 'MUX_ARB':
      return 'MUX'
    case 'EQUATION_ARB':
      return 'Equation'
    case 'BLOOM_BLAST':
      return 'Bloom'
    case 'APOLLOX_BNB':
      return 'ApolloX (BNB)'
    case 'AVANTIS_BASE':
      return 'Avantis'
    case 'TIGRIS_ARB':
      return 'Tigris'
    case 'LOGX_BLAST':
      return 'LogX (BLAST)'
    case 'LOGX_MODE':
      return 'LogX (MODE)'
    case 'MYX_ARB':
      return 'MYX'
    case 'HMX_ARB':
      return 'HMX'
    case 'DEXTORO':
      return 'DexToro'
    case 'VELA_ARB':
      return 'Vela'
    case 'SYNTHETIX_V3':
      return 'Synthetix (V3)'
    case 'COPIN':
      return 'Copin'
    case 'KTX_MANTLE':
      return 'KTX'
    case 'CYBERDEX':
      return 'CyberDEX'
    case 'YFX_ARB':
      return 'YFX'
    case 'KILOEX_OPBNB':
      return 'KiloEx (opBNB)'
    case 'ROLLIE_SCROLL':
      return 'Rollie Finance'
    case 'PERENNIAL_ARB':
      return 'Perennial'
    case 'MUMMY_FANTOM':
      return 'Mummy Finance'
    case 'MORPHEX_FANTOM':
      return 'Morphex'
    case 'HYPERLIQUID':
      return 'Hyperliquid'
    case 'SYNFUTURE_BASE':
      return 'Synfutures'
    case 'DYDX':
      return 'dYdX'
    case 'BSX':
      return 'BSX'
    case 'UNIDEX_ARB':
      return 'UniDex'
    default:
      return ''
  }
}

function formatNumber(num, maxDigit = 2, minDigit) {
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

function formatDuration(durationInSecond) {
  if (!durationInSecond) return '--'
  if (durationInSecond < 60) return `${formatNumber(durationInSecond, 0, 0)}s`
  if (durationInSecond < 3600) return `${formatNumber(durationInSecond / 60, 1, 1)}m`
  if (durationInSecond < 86400) return `${formatNumber(durationInSecond / (60 * 60), 1, 1)}h`
  return `${formatNumber(durationInSecond / (60 * 60 * 24), 0, 0)}d`
}

const formatLocalRelativeDate = (date) => dayjs.utc(date).local().fromNow()
const formatLocalRelativeShortDate = (date) => {
  const arr = dayjs.utc(date).local().fromNow(true).split(' ')
  return `${arr[0] === 'a' || arr[0] === 'an' ? '1' : arr[0]}${arr[1].includes('month') ? 'mo' : arr[1]?.charAt(0)}`
}

const formatRelativeDate = (date) => dayjs.utc(date).fromNow()
const formatRelativeShortDate = (date) => {
  const arr = dayjs.utc(date).fromNow(true).split(' ')
  return `${arr[0]}${arr[1]?.charAt(0)}`
}

const formatLocalDate = (date, format) => {
  if (!date) return ''

  return dayjs
    .utc(date)
    .local()
    .format(format ?? DATE_FORMAT)
}

const formatDate = (date, format) => {
  if (!date) return ''

  return dayjs.utc(date).format(format ?? DAYJS_FULL_DATE_FORMAT)
}

const EMOJII =
  '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 🥹 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🫥 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐻‍❄️ 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🪱 🐛 🦋 🐌 🐞 🐢 🐍 🦖 🐙 🦑 🦐 🦀 🪸 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐲 🦥 🌵 🎄 🌲 🌳 🍀 🍁 🍄 🐚 🌹 🌺 🌸 🌼 🔥 🌈 💧 ⛄️ 🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🌶 🫑 🌽 🥐 🍞 🥖 🧀 🥚 🥪 🧇 🍔 🍟 🍕 🌮 🍙 🍘 🍥 🍣 🥮 🎂 🍭 🍿 🍩 🍪 🍼 🍺 🍷 ⚽️ 🏀 🏈 ⚾️ 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🎨 🧩 🏵 🥊 🍯'

const emojiList = EMOJII.split(' ')
function lighten(col, amt) {
  let usePound = false

  if (col[0] == '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let b = ((num >> 8) & 0x00ff) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  let g = (num & 0x0000ff) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

const mapCharToNumber = (char) => {
  const code = char.charCodeAt(0)
  if (code >= 'g'.charCodeAt(0) && code <= 'z'.charCodeAt(0)) {
    return (code - 'g'.charCodeAt(0)) % 10
  }
  return char
}

function generateAvatar(address) {
  let renderAddress
  if (address?.startsWith('dydx')) {
    const addressWithoutPrefix = address.slice(5)
    renderAddress = Array.from(addressWithoutPrefix, mapCharToNumber).join('')
  }
  const emojiHex = renderAddress ? renderAddress.slice(0, 2) : address.slice(2, 4)
  const emoji = emojiList[parseInt(emojiHex, 16)]
  const bg = `#${renderAddress ? renderAddress.slice(3, 9) : address.slice(5, 11)}`
  return {
    emoji,
    bg,
    gradient: `linear-gradient(-70deg, ${lighten(bg, 50)} 0%, ${lighten(bg, 50)} 41%, ${bg} 40%, ${bg} 100%)`,
  }
}

export {
  renderHTML,
  normalizeText,
  shortenText,
  addressShorten,
  generateProtocolName,
  generateAvatar,
  formatNumber,
  formatDuration,
  formatLocalDate,
  formatLocalRelativeDate,
  formatDate,
  formatRelativeShortDate,
  formatLocalRelativeShortDate,
  formatRelativeDate,
}
