// import { getAddress } from 'ethers/lib/utils.js'
import { readFile } from 'fs'
import { resolve } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

import { configs } from './configs.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const indexPath = resolve(__dirname, '..', 'build', 'index.html')

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

export { renderHTML, normalizeText, shortenText, addressShorten }
