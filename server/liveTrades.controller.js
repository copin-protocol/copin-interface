import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getLiveTrades = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__live-trades-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Live Trades | Copin Analyzer`,
        description:
          'Track live orders and positions of traders across perpetual DEXs. Stay updated with live data on trades, leverage, and market movements for informed decisions',
        thumbnail,
        url: `${configs.baseUrl}/live-trades`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getLiveTrades }
