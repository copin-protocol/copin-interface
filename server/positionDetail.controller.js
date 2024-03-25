import axios from 'axios'

import { configs } from './configs.js'
import { addressShorten, generateProtocolName, renderHTML } from './utils.js'

const getPositionDetails = async (req, res) => {
  const { account, log_id, next_hours } = req.query
  const { protocol, id } = req.params

  let thumbnail = `${configs.baseUrl}/images/cover/default-position-cover.png`
  try {
    const newThumbnail = id?.startsWith('0x')
      ? `${configs.imageApiUrl}/share_${protocol}_${id}_${account}_${log_id}`
      : `${configs.imageApiUrl}/share_closed_${protocol}_${id}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail + `?${new Date().getTime()}`
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
            url: `${configs.baseUrl}/${protocol}/position/${id}?account=${account}&log_id=${log_id}${
              next_hours ? `?next_hours=${next_hours}` : ''
            }`,
          }
        : {
            title: `Trade on ${protocolName} - View this position details on Copin`,
            thumbnail,
            url: `${configs.baseUrl}/${protocol}/position/${id}${next_hours ? `?next_hours=${next_hours}` : ''}`,
          },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPositionDetails }
