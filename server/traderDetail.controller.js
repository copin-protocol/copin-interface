import axios from 'axios';



import { configs } from './configs.js';
import { addressShorten, generateProtocolName, renderHTML } from './utils.js';


const getTraderDetail = async (req, res) => {
  const { time = 'FULL' } = req.query
  const { protocol: _protocol, address } = req.params
  const protocol = _protocol ? _protocol.split('-')[0].toUpperCase() : 'GMX'

  const url = `${configs.baseUrl}/trader/${address}/${protocol.toLowerCase()}?time=${time}&${new Date().getTime()}`
  const encodedUrl = encodeURIComponent(url)

  // let thumbnail = `${configs.baseUrl}/images/cover/default-trader-cover.png`
  // try {
  //   const newThumbnail = `${
  //     configs.imageApiUrl
  //   }/address_${address}_protocol_${protocol}_time_${time}?${new Date().getTime()}`
  //   const image = await axios.get(`${newThumbnail}`)
  //   if (image.data) thumbnail = newThumbnail
  // } catch {}

  const protocolName = generateProtocolName(protocol)

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Trader ${addressShorten(address)} on ${protocolName} - Copy this trader on Copin`,
        thumbnail: `http://image.copin.io/thumb.php?profile=${encodedUrl}`,
        url,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getTraderDetail }