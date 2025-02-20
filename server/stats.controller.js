import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getStats = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__stats-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Copin Stats | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/stats`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getStats }
