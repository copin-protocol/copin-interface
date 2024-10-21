import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getOpenInterestPositions = async (req, res) => {
  const thumbnail = `${configs.baseUrl}/images/cover/oi-positions-cover.png`

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
