import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getOpenInterestPositions = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__oi-positions-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Open Interest by Positions | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/open-interest/positions`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getOpenInterestPositions }
