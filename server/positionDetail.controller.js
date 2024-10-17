import axios from 'axios'

import { configs } from './configs.js'
import { addressShorten, generateProtocolName, renderHTML } from './utils.js'

const getPositionDetails = async (req, res) => {
  const { account, log_id, next_hours } = req.query
  const { protocol, id } = req.params

  let thumbnail = `${configs.baseUrl}/images/cover/default-position-cover.png`
    let url = ''
  try {
     url = id?.startsWith('0x')
      ? `${configs.baseUrl}/${protocol}/position/${id}?account=${account}&log_id=${log_id}${
            next_hours ? `?next_hours=${next_hours}` : ''
        }`
      : `${configs.baseUrl}/${protocol}/position/${id}${next_hours ? `?next_hours=${next_hours}` : ''}`
      const encodedUrl = encodeURIComponent(url)
      const imageUrl = `http://image.copin.io/thumb.php?profile=${encodedUrl}`
    const image = await axios.get(imageUrl)
    if (image.data) thumbnail = imageUrl + `?${new Date().getTime()}`
  } catch {}

  const protocolName = generateProtocolName(protocol)

  try {
    renderHTML({
      req,
      res,
      params: id?.startsWith('0x')
        ? {
            title: `Trader ${addressShorten(account)} on ${protocolName} - View this position details on Copin`,
            thumbnail,
            url,
          }
        : {
            title: `Trade on ${protocolName} - View this position details on Copin`,
            thumbnail,
            url,
          },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPositionDetails }
