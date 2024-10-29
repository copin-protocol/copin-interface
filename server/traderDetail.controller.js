import axios from 'axios'

import { configs } from './configs.js'
import {
  addressShorten,
  formatLocalRelativeDate,
  formatNumber,
  generateAvatar,
  generateProtocolName,
  renderHTML,
} from './utils.js'

const getTraderDetail = async (req, res) => {
  const { time = 'FULL' } = req.query
  const { protocol: _protocol, address } = req.params
  const protocol = _protocol ? _protocol.split('-')[0].toUpperCase() : 'GMX'

  const url = `${configs.baseUrl}/trader/${address}/${protocol.toLowerCase()}?time=${time}&${new Date().getTime()}`
  const encodedUrl = encodeURIComponent(url)

  const protocolName = generateProtocolName(protocol)
  const thumbnail = `http://image.copin.io/thumb.php?profile=${encodedUrl}`

  // let thumbnail = `${configs.baseUrl}/images/cover/default-trader-cover.png`
  let traderStats = {}
  let description = ''

  try {
    traderStats = await axios
      .get(`${configs.apiUrl}/public/${protocol}/position/statistic/trader/${account}`)
      .then((res) => {
        return res.data?.['FULL']
      })
    if (traderStats) {
      const { emoji } = generateAvatar(address)
      description = `${emoji} PnL: ${formatNumber(traderStats.realisedPnl)}$ | Trades: ${formatNumber(
        traderStats.totalTrade
      )} | WinRate: ${formatNumber(traderStats.winRate, 2, 2)}% | Profit Rate: ${formatNumber(
        traderStats.profitRate,
        2,
        2
      )}% | Last Trade: ${traderStats.lastTradeAt ? formatLocalRelativeDate(traderStats.lastTradeAt) : '--'}.`
    }
  } catch {}

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(address)} via ${protocolName} - Explore. Copy. Win on Copin`,
        description: !!description ? description : undefined,
        thumbnail,
        url,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getTraderDetail }
