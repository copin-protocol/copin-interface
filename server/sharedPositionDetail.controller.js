import axios from 'axios'

import apiRequester from './apiRequest.js'
import { configs } from './configs.js'
import { addressShorten, renderHTML } from './utils.js'

const getSharedPositionDetails = async (req, res) => {
  const { protocol, sharedId } = req.params

  try {
    const sharedData = await apiRequester.get(`/share/${sharedId}`).then((res) => res.query)
    const { account, txHashes, logId } = sharedData
    const txHash = txHashes[0]
    let thumbnail = `${configs.apiUrl}/storage/image/cover__default-position-cover`
    const newThumbnail = `${configs.imageApiUrl}/share_${protocol}_${txHash}_${account}_${logId}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail + `?${new Date().getTime()}`

    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(account)} on ${protocol} - View this position details on Copin`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/position/share/${sharedId}`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getSharedPositionDetails }
