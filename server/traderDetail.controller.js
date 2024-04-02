import axios from 'axios'

import { configs } from './configs.js'
import { addressShorten, generateProtocolName, renderHTML } from './utils.js'

const getTraderDetail = async (req, res) => {
  const { time = 'D60' } = req.query
  const { protocol: _protocol, address } = req.params
  const protocol = _protocol ? _protocol.split('-')[0].toUpperCase() : 'GMX'

  let thumbnail = `${configs.baseUrl}/images/cover/default-trader-cover.png`
  try {
    const newThumbnail = `${
      configs.imageApiUrl
    }/address_${address}_protocol_${protocol}_time_${time}?${new Date().getTime()}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail
  } catch {}

  const protocolName = generateProtocolName(protocol)

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(address)} on ${protocolName} - Copy this trader on Copin`,
        thumbnail,
        url: `${configs.baseUrl}/trader/${address}/${protocol.toLowerCase()}?time=${time}`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getTraderDetail }
