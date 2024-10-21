import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getDailyTrades = async (req, res) => {
  const thumbnail = `${configs.baseUrl}/images/cover/daily-trades-cover.png`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Daily Trading Order & Positions | Copin Analyzer`,
        description: 'View real-time trading orders & positions on Copin.io with detailed insights into PnL, ROI, and more',
        thumbnail,
        url: `${configs.baseUrl}/daily-trades`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getDailyTrades }
