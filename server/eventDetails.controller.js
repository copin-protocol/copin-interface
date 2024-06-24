import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getEventDetails = async (req, res) => {
  const { id } = req.params

  const title = `On-chain Copy-Trading to share $50,000 & Merchs rewards | Copin Analyzer`
  const thumbnail = `${configs.baseUrl}/images/cover/event-details-cover.png`
  const url = `${configs.baseUrl}/event/${id}` 
  const description = 'Participate in the competition to copy trades from 300K+ on-chain traders on 20+ perpetual DEXs for a chance to receive a total prize of up to $50K and merchs. The larger the copy volume, the higher your reward!'

  try {
    renderHTML({
      req,
      res,
      params: {
        title,
        thumbnail,
        description,
        url,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getEventDetails }
