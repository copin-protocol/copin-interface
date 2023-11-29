import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getSubscription = async (req, res) => {
  const thumbnail = `${configs.baseUrl}/images/cover/subscription-cover.png`

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
