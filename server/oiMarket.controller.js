import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getOpenInterestMarket = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__oi-market-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Open Interest by Market | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/open-interest/market`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getOpenInterestMarket }
