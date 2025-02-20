import { configs } from './configs.js'
import { generateProtocolName, renderHTML } from './utils.js'

const getCopierRanking = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__copier-ranking-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Copier Ranking | Copin Analyzer`,
        description: `Discover best copiers on Copin.io with real-time win rates, volumes, and PnL`,
        thumbnail,
        url: `${configs.baseUrl}/copier-ranking`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getCopierRanking }
