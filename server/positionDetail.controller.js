import axios from 'axios'

import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getPositionDetails = async (req, res) => {
  const { next_hours } = req.query
  const { protocol, id } = req.params

  let thumbnail = `${configs.baseUrl}/images/cover/cover.png`
  try {
    const newThumbnail = `${configs.imageApiUrl}/share_${protocol}_${id}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail
  } catch {}

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trade on ${protocol} - View this position details on Copin`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/position/${id}${next_hours ? `?next_hours=${next_hours}` : ''}`
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPositionDetails }
