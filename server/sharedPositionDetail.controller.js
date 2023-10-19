import axios from 'axios'

import { configs } from './configs.js'
import { addressShorten, renderHTML } from './utils.js'
import apiRequester from './apiRequest.js'

const getSharedPositionDetails = async (req, res) => {
  const { protocol, sharedId } = req.params

  try {
    const sharedData = await apiRequester.get(`/share/${sharedId}`).then((res) => res.query)
    const { account, positionId, indexToken, key, blockNumber } = sharedData
    const isOpening = !positionId && !!account && !!indexToken && !!key
    let thumbnail = `${configs.baseUrl}/cover.png`
    const newThumbnail = isOpening
      ? `${configs.imageApiUrl}/share_opening_${protocol}_${key}_${blockNumber}`
      : `${configs.imageApiUrl}/share_closed_${protocol}_${positionId}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail

    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(account)} on ${protocol} - Copin Analyzer`,
        description: `View this position details on Copin`,
        thumbnail,
        url: `${configs.baseUrl}/${protocol}/position/${sharedId}`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getSharedPositionDetails }
