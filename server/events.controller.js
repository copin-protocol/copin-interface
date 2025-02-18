import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getEvents = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__events-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Explore Exciting Crypto Events and Competitions on Copin | Copin Analyzer`,
        description: `Discover upcoming events now and join the Copin community to maximize your copy-trading journey!`,
        thumbnail,
        url: `${configs.baseUrl}/events`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getEvents }
