import { configs } from './configs.js'
import { generateProtocolName, renderHTML } from './utils.js'

const getLeaderboard = async (req, res) => {
  const { protocol } = req.params
  const thumbnail = `${configs.apiUrl}/storage/image/cover__trader-board-cover?time=${new Date().getTime()}`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trader Board on ${generateProtocolName(protocol)} | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/trader-board`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getLeaderboard }
