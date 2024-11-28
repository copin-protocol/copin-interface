import axios from 'axios'

import { configs } from './configs.js'
import {
  addressShorten,
  formatLocalRelativeDate,
  formatNumber,
  generateAvatar,
  generateProtocolName,
  renderHTML
} from './utils.js'

const getPositionDetails = async (req, res) => {
  const { account, log_id, side, next_hours } = req.query
  const { protocol, id } = req.params

  const protocolName = generateProtocolName(protocol)

  let url = ''
  let thumbnail = `${configs.baseUrl}/images/cover/default-position-cover.png`
  let description = ''
  try {
    const txHash = id?.startsWith('0x') || id?.length === 64 ? id : ''
    url = !!txHash
      ? `${configs.baseUrl}/${protocol}/position/${id}?account=${account}&log_id=${log_id}&side=${side}${
          next_hours ? `&next_hours=${next_hours}&${new Date().getTime()}` : `&${new Date().getTime()}`
        }`
      : `${configs.baseUrl}/${protocol}/position/${id}${
          next_hours ? `?next_hours=${next_hours}&${new Date().getTime()}` : `?${new Date().getTime()}`
        }`

    const searchPositions = await axios.get(
      `${configs.apiUrl}/${protocol}/position/${txHash}?account=${account}&log_id=${log_id}&side=${side}`
    )
    const data = searchPositions?.data
    if (data) {
      const positionId = !!txHash ? (data && data.length > 0 ? data[0].id : undefined) : id
      const encodedUrl = encodeURIComponent(
        `${configs.baseUrl}/${protocol}/position/${positionId}?${new Date().getTime()}`
      )
      thumbnail = `http://image.copin.io/thumb.php?profile=${encodedUrl}`

      const traderStats = await axios
        .get(`${configs.apiUrl}/public/${protocol}/position/statistic/trader/${account}`)
        .then((res) => {
          return res.data?.['FULL']
        })

      if (traderStats) {
        const { emoji } = generateAvatar(account)
        description = `${emoji} PnL: ${formatNumber(traderStats.realisedPnl)}$ | Trades: ${formatNumber(
          traderStats.totalTrade
        )} | WinRate: ${formatNumber(traderStats.winRate, 2, 2)}% | Profit Rate: ${formatNumber(
          traderStats.profitRate,
          2,
          2
        )}% | Last Trade: ${traderStats.lastTradeAt ? formatLocalRelativeDate(traderStats.lastTradeAt) : '--'}.`
      }
    }
  } catch {}

  try {
    const params = !!description
      ? {
          title: `Trader ${addressShorten(account)} has position via ${protocolName} - Explore. Copy. Win on Copin`,
          description,
          thumbnail,
          url,
        }
      : {
          title: `Position details on ${protocolName} - Explore. Copy. Win on Copin`,
          thumbnail,
          url,
        }
    renderHTML({
      req,
      res,
      params,
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPositionDetails }
