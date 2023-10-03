import axios from 'axios'

import { configs } from './configs.js'
import { addressShorten, renderHTML } from './utils.js'

const getPositionDetails = async (req, res) => {
  const { id, account, indexToken, key, blockNumber, next_hours } = req.query
  const { protocol } = req.params
  const isOpening = !id

  let thumbnail = `${configs.baseUrl}/cover.png`
  try {
    const newThumbnail = isOpening
      ? `${configs.imageApiUrl}/protocol_${protocol}_key_${key}_blockNumber_${blockNumber}.png`
      : `${configs.imageApiUrl}/protocol_${protocol}_id_${id}.png`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail
  } catch {}

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(account)} on ${protocol} - Copin Analyzer`,
        description: `View this position details on Copin`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/position?${
          isOpening
            ? `account=${account}&indexToken=${indexToken}&key=${key}&blockNumber=${blockNumber}`
            : `id=${id}${next_hours ? `&next_hours=${next_hours}` : ''}`
        }`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getPositionDetails }
