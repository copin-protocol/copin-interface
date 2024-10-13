import { configs } from './configs.js'
import { generateProtocolName, renderHTML } from './utils.js'

const getLeaderboard = async (req, res) => {
  const { protocol } = req.params
  const thumbnail = `${configs.baseUrl}/images/cover/leaderboard-cover.png`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Leaderboard on ${generateProtocolName(protocol)} | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/leaderboard`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getLeaderboard }
