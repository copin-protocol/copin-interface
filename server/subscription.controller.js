import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getSubscription = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__subscription-cover?v=3`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Subscription Plans | Copin Analyzer`,
        thumbnail,
        url: `${configs.baseUrl}/subscription`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getSubscription }
