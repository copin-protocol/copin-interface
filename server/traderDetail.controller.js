import { configs } from './configs.js'
import { addressShorten, renderHTML } from './utils.js'
import axios from 'axios'

const getTraderDetail = async (req, res) => {
  const { time = 'D60' } = req.query
  const { protocol, address } = req.params

  let thumbnail = `${configs.baseUrl}/images/cover/cover.png`
  try {
    const newThumbnail = `${configs.imageApiUrl}/address_${address}_protocol_${protocol}_time_${time}`
    const image = await axios.get(`${newThumbnail}`)
    if (image.data) thumbnail = newThumbnail
  } catch {}

  try {
    renderHTML({req, res, params: {
      title: `Trader ${addressShorten(address)} on ${protocol} - Copy this trader on Copin`,
      thumbnail,
      url: `${configs.baseUrl}/${protocol}/trader/${address}?time=${time}`,
    }})
  } catch {
    renderHTML({req, res})
  }
}

export { getTraderDetail }
